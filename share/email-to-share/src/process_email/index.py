import base64
import email
import json
import os
import shutil
import tempfile
import urllib.parse
import urllib3

from aws_lambda_powertools import Logger
from aws_lambda_powertools import Tracer
import boto3
import botocore
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

urllib3.disable_warnings()


aws_region = os.getenv('AWS_REGION')

attachments_keyspace = os.getenv('ATTACHMENT_KEYSPACE')

s3_resource = boto3.resource('s3', region_name=aws_region)

logger = Logger()
tracer = Tracer()


@tracer.capture_method
def get_s3_object(bucket, key_name, local_file):
    """Download a S3 object to a local file in the execution environment

    Parameters
    ----------
    bucket: string, required
        S3 bucket that holds the message
    
    key: string, required
        S3 key is the email object
    
    Returns
    -------
    email_msg: email.message.Message object
    """
    tracer.put_metadata('object', f's3://{bucket}/{key_name}')

    try:
        s3_resource.Bucket(bucket).download_file(key_name, local_file)
        result = 'ok'
        tracer.put_annotation('OBJECT_DOWNLOAD', 'SUCCESS')
    except Exception as e:
        tracer.put_annotation('OBJECT_DOWNLOAD', 'FAILURE')
        result = f'Error: {str(e)}'

    return(result)


@tracer.capture_method
def put_s3_object(bucket, key_name, local_file):
    """Upload a local file in the execution environment to S3

    Parameters
    ----------
    bucket: string, required
        S3 bucket that will holds the attachment
    
    key_name: string, required
        S3 key is the destination of attachment
    
    local_file: string, required
        Location of the attachment to process

    
    Returns
    -------
    boolean (True if successful, False if not successful)
    """
    tracer.put_metadata('object', f's3://{bucket}/{key_name}')

    try:
        s3_resource.Bucket(bucket).upload_file(local_file, key_name)
        result = True
        tracer.put_annotation('ATTACHMENT_UPLOAD', 'SUCCESS')
    except Exception as e:
        logger.error(str(e))
        tracer.put_annotation('ATTACHMENT_UPLOAD', 'FAILURE')
        result = False

    return(result)



@tracer.capture_method
@logger.inject_lambda_context
def lambda_handler(event, context):
    """Sample pure Lambda function

    Parameters
    ----------
    event: dict, required
        S3 Put Event Format

        Event doc: https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    """
    tmpdir = tempfile.mkdtemp()
    os.makedirs(os.path.join(tmpdir, 'raw_message'))
    raw_message_dir = os.path.join(tmpdir, 'raw_message')
    os.makedirs(os.path.join(tmpdir, 'attachments'))
    attachments_dir = os.path.join(tmpdir, 'attachments')

    for record in event['Records']:
        try:
            bucket_name = record['s3']['bucket']['name']
            key_name = record['s3']['object']['key']
        except Exception as e:
            logger.error(str(e))
            raise Exception('Could not get bucket or key information.')
            
        try:
            local_file = os.path.join(
                            raw_message_dir, 
                            key_name.split('/')[-1]
                        )
        except Exception as e:
            logger.error(f'Could not define local_file: {str(e)}')
            raise Exception(f'Could not define local_file: {str(e)}')
        
        # Get object from S3
        download_status = get_s3_object(
                                bucket_name,
                                key_name,
                                local_file
                            )
        
        if download_status == 'ok':
            success_message = f'Successful download of s3://{bucket_name}/{key_name} '
            success_message += f'to {local_file} '
            success_message += f'for processing'
            logger.info(success_message)
        else:
            logger.error(f'Download failure to {local_file}: {download_status}')
            raise Exception(f'Download failure to {local_file}: {download_status}')
        
        # Open the message from the local file
        try:
            msg = email.message_from_file(open(local_file))
            logger.info(f'Read email from file {local_file}')
        except Exception as e:
            logger.error(f'Could not read email file: {str(e)}')
            raise Exception(f'Could not read email file: {str(e)}')

        # Extract attachments and persist to S3 attachments keyspace in local account
        # and Vendia Share blob storage
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_filename() is None:
                    continue

                if part.get_filename().endswith('.csv'):
                    try:
                        open(f'{attachments_dir}/{part.get_filename()}', 'wb').write(part.get_payload(decode=True))
                        logger.info(f'Wrote attachment to {attachments_dir}/{part.get_filename()}')
                    except Exception as e:
                        logger.error(f'Could not write attachment to {attachments_dir}/{part.get_filename()}: {str(e)}')
                        continue

                    try:
                        result = put_s3_object(
                            bucket_name,
                            f'{attachments_keyspace}/{urllib.parse.quote(part.get_filename())}',
                            f'{attachments_dir}/{part.get_filename()}'
                        )

                        # If attachment was put to local account S3 then try to write to Share blob storage
                        if result:
                            logger.info(f'Successful upload of attachment to s3://{bucket_name}/{attachments_keyspace}/{urllib.parse.quote(part.get_filename())}')
                        else:
                            logger.error(f'Failed to upload attachment {part.get_filename()}')           
                    except Exception as e:
                        logger.error(str(e))
                else:
                    continue

    shutil.rmtree(tmpdir)
    return result
