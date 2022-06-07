import csv
import json
import os
import sys
import tempfile
import urllib3

import boto3
import botocore.exceptions
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

urllib3.disable_warnings()


# AWS-specific data
aws_region = os.getenv('AWS_REGION')
s3_resource = boto3.resource('s3', region_name=aws_region)

# Vendia Share node data
share_node_url = os.getenv('SHARE_NODE_URL')
share_node_api_key = os.getenv('SHARE_NODE_API_KEY')
transport=RequestsHTTPTransport(
    url=share_node_url,
    use_json=True,
    headers={
        "Content-type": "application/json",
        "x-api-key": share_node_api_key
    },
    verify=False,
    retries=3,
)

gql_client = Client(
    transport=transport,
    fetch_schema_from_transport=True,
)

schema_query = gql(
    """
    query schemaDefinition {
        getVendia_UniInfo {
            schema
        }
    }
    """
)


result = gql_client.execute(schema_query)
schema = json.loads(result['getVendia_UniInfo']['schema'])

model_properties = set()

## List of schema properties
## These values will be used to check the header of the CSV to ensure
## the fields match what the schema can process.
## Store the model for later use in the Lambda function handler.
## This check is crude - we are not yet checking type, only name.
for model in schema['properties'].keys():
    for attr in schema['properties'][model]['items']['properties'].keys():
        model_properties.add(attr)


def csv_headers_in_model_properties(csv_file):
    '''Confirm CSV headers are in uni schema

    Parameters
    ----------
    csv_file: string, required
        Uploaded CSV file

    Returns
    -------
    result: boolean
        Result of comparison (True if all headers are in model)
    '''
    try:
        with open(csv_file) as f:
            csv_reader = csv.reader(f)
            header = next(csv_reader)
    except Exception as e:
        result = f'Error: {str(e)}'
    
    for item in header:
        if item in model_properties:
            continue
        else:
            raise Exception(f'Header {item} not in uni schema')
            return(False)
    
    return(True)


def get_s3_object(bucket, key_name, local_file):
    '''Download object in S3 to local file

    Parameters
    ----------
    bucket: string, required
        Bucket name where object is located
    
    key_name: string, required
        Key name of object
    
    local_file: string, required
        Local file name in Lambda execution environment

    Returns
    -------
    result: string
        Result of operation ('ok' or exception)
    '''
    try:
        s3_resource.Bucket(bucket).download_file(key_name, local_file)
        result = 'ok'
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == '404':
            result = f'Error: s3://{bucket}/{key_name} doesnot exist'
        else:
            result = f'Error: {str(e)}'
    
    return(result)


def post_to_share(csv_file):
    '''Post CSV data to Vendia Share node

    Parameters
    ----------
    csv_file: string, required
        Uploaded CSV file

    Returns
    -------
    result: boolean
        Data in CSV POSTed to Share node (True if POST of all data in CSV is successful)
    '''
    try:
        with open(csv_file) as f:
            csv_reader = csv.reader(f)
            header = next(csv_reader)
            if header != None:
                for row in csv_reader:
                    params = {
                        "item": row[0],
                        "quantity": row[1],
                        "recommended_location": row[2],
                        "bought": bool(row[3]),
                        "timestamp_added": row[4]
                    }
                    print(params)
                    add_item_query = gql(
                        """
                        mutation addItem(
                            $item: String!,
                            $quantity: String!,
                            $recommended_location: String!,
                            $bought: Boolean!,
                            $timestamp_added: String!
                        ) {
                            add_ShoppingList(
                                input: {
                                    item: $item,
                                    quantity: $quantity,
                                    recommendedLocation: $recommended_location,
                                    bought: $bought,
                                    timestampAdded: $timestamp_added
                                }, 
                                syncMode: ASYNC) {
                                transaction {
                                    transactionId
                                }
                            }
                        }
                        """
                    )
                    try:        
                        result = gql_client.execute(
                            add_item_query,
                            variable_values=params
                        )
                        print(result)
                    except Exception as e:
                        print(f'Error: {str(e)}')
            return(True)
    except Exception as e:
        print(f'Error: {str(e)}')
        return(False)


def handler(event, context):
    tmpdir = tempfile.mkdtemp()

    try:
        for record in event['Records']:
            bucket_name = record['s3']['bucket']['name']
            key_name = record['s3']['object']['key']

            local_file = os.path.join(tmpdir, key_name)

            download_status = get_s3_object(
                bucket_name,
                key_name,
                local_file
            )

            if download_status == 'ok':
                # Make sure the CSV has headers that are present in the schema
                header_check = csv_headers_in_model_properties(local_file)
                post_status = post_to_share(local_file)
            else:
                raise Exception(f'Download failure to {local_file}')
    except Exception as e:
        raise Exception(str(e))
    finally:
        files_to_remove = os.listdir(tmpdir)

        for f in files_to_remove:
            file_path = os.path.join(tmpdir, f)

            try:
                os.remove(file_path)
            except Exception as e:
                print(str(e))
        
        print(f'Removing folder {tmpdir}')
        os.rmdir(tmpdir)

    return('ok')
