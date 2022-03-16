import csv
import json
import os
import shutil
import sys
import tempfile
import urllib3

from aws_lambda_powertools import Logger
from aws_lambda_powertools import Tracer
import boto3
import botocore.exceptions
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

urllib3.disable_warnings()


# AWS-specific data
aws_region = os.getenv('AWS_REGION')
s3_resource = boto3.resource('s3', region_name=aws_region)

logger = Logger()
tracer = Tracer()

# Vendia Share node data
share_node_url = os.getenv('SHARE_NODE_URL')
share_node_api_key = os.getenv('SHARE_NODE_API_KEY')

transport = RequestsHTTPTransport(
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


@tracer.capture_method
def get_s3_object(bucket, key_name, local_file):
    """Download a S3 object to a local file in the execution environment

    Parameters
    ----------
    bucket: string, required
        S3 bucket that holds the message
    
    key: string, required
        S3 key is the email object
    
    local_file: string, required
        Location of file in Lambda execution environment
    
    Returns
    -------
    result: boolean (True if successful, False if unsuccessful)
    """
    tracer.put_metadata('object', f's3://{bucket}/{key_name}')

    try:
        s3_resource.Bucket(bucket).download_file(key_name, local_file)
        logger.info(f'Successful download of s3://{bucket}/{key_name} to {local_file}')
        tracer.put_annotation('OBJECT_DOWNLOAD', 'SUCCESS')
        result = True
    except Exception as e:
        logger.error(f'Could not download s3://{bucket}/{key_name} to {local_file}: {str(e)}')
        tracer.put_annotation('OBJECT_DOWNLOAD', 'FAILURE')
        result = False

    return(result)


@tracer.capture_method
def post_to_share(csv_file):
    """Post CSV data to Vendia Share node

    Parameters
    ----------
    csv_file: string, required
        Uploaded CSV file

    Returns
    -------
    result: boolean
        Data in CSV POSTed to Share node (True if POST of all data in CSV is successful)
    """
    try:
        with open(csv_file) as f:
            csv_reader = csv.reader(f, delimiter=';')
            header = next(csv_reader)
            if header != None:
                for row in csv_reader:
                    params = {
                        "orderDate": row[0],
                        "status": "pending",
                        "shipperName": row[1],
                        "shipperAddress": row[2],
                        "shipperCity": row[3],
                        "shipperState": row[4],
                        "shipperPostalCode": row[5],
                        "shipperCountry": row[6],
                        "shipperPhone": row[7],
                        "shipperEmail": row[8],
                        "shipperSpecialInstructions": row[9],
                        "referenceNumber": row[10],
                        "carrierName": row[11],
                        "carrierPhone": row[12],
                        "carrierEmail": row[13],
                        "consigneeName": row[14],
                        "consigneeAddress": row[15],
                        "consigneeCity": row[16],
                        "consigneeState": row[17],
                        "consigneePostalCode": row[18],
                        "consigneeCountry": row[19],
                        "consigneePhone": row[20],
                        "consigneeEmail": row[21],
                        "location": [40.5797366, -74.9627307],
                        "goods": json.loads(row[22])
                    }

                    add_query = gql(
                        """
                        mutation addShipment(
                            $orderDate: String!,
                            $status: String!,
                            $shipperName: String!,
                            $shipperAddress: String!,
                            $shipperCity: String!,
                            $shipperState: String!,
                            $shipperPostalCode: String!,
                            $shipperCountry: String!,
                            $shipperPhone: String!,
                            $shipperEmail: String!,
                            $shipperSpecialInstructions: String!,
                            $referenceNumber: String!,
                            $carrierName: String!,
                            $carrierPhone: String!,
                            $carrierEmail: String!,
                            $consigneeName: String!,
                            $consigneeAddress: String!,
                            $consigneeCity: String!,
                            $consigneeState: String!,
                            $consigneePostalCode: String!,
                            $consigneeCountry: String!,
                            $consigneePhone: String!,
                            $consigneeEmail: String!,
                            $location: [Float!],
                            $goods: [goods_elementInput!]
                        ) {
                            addShipment(
                                input: {
                                    orderDate: $orderDate,
                                    status: $status,
                                    shipperName: $shipperName,
                                    shipperAddress: $shipperAddress,
                                    shipperCity: $shipperCity,
                                    shipperState: $shipperState,
                                    shipperPostalCode: $shipperPostalCode,
                                    shipperCountry: $shipperCountry,
                                    shipperPhone: $shipperPhone,
                                    shipperEmail: $shipperEmail,
                                    shipperSpecialInstructions: $shipperSpecialInstructions,
                                    referenceNumber: $referenceNumber,
                                    carrierName: $carrierName,
                                    carrierPhone: $carrierPhone,
                                    carrierEmail: $carrierEmail,
                                    consigneeName: $consigneeName,
                                    consigneeAddress: $consigneeAddress,
                                    consigneeCity: $consigneeCity,
                                    consigneeState: $consigneeState,
                                    consigneePostalCode: $consigneePostalCode,
                                    consigneeCountry: $consigneeCountry,
                                    consigneePhone: $consigneePhone,
                                    consigneeEmail: $consigneeEmail,
                                    location: $location,
                                    goods: $goods
                                }, 
                                syncMode: ASYNC) {
                                transaction {
                                    _id
                                }
                            }
                        }
                        """
                    )
                    try:        
                        result = gql_client.execute(
                            add_query,
                            variable_values=params
                        )
                        logger.info(f'Put item to {share_node_url}: {result}')
                        tracer.put_annotation('STORE_ITEM_IN_SHARE', 'SUCCESS')
                    except Exception as e:
                        logger.error(f'Error: {str(e)}')
                        tracer.put_annotation('STORE_ITEM_IN_SHARE', 'FAILURE')
            return(True)
    except Exception as e:
        logger.error(f'Error: {str(e)}')
        return(False)


@tracer.capture_method
@logger.inject_lambda_context
def lambda_handler(event, context):
    tmpdir = tempfile.mkdtemp()

    try:
        for record in event['Records']:
            bucket_name = record['s3']['bucket']['name']
            key_name = record['s3']['object']['key']
            name = record['s3']['object']['key'].split('/')[-1]
            local_file = os.path.join(tmpdir, name)

            try:
                download_status = get_s3_object(
                    bucket_name,
                    key_name,
                    local_file
                )
            except Exception as e:
                logger.error(str(e))
                continue

            
            post_status = post_to_share(local_file)
    except Exception as e:
        logger.error(str(e))
        raise
    finally:
        shutil.rmtree(tmpdir)

    return('done')
