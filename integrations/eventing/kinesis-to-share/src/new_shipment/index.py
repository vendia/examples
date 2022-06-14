import base64
import datetime
import json
import os
import urllib3

from aws_lambda_powertools import Logger
from aws_lambda_powertools import Tracer
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

urllib3.disable_warnings()


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

logger = Logger()
tracer = Tracer()


@tracer.capture_method
def add_shipment(order_date, due_date, 
    purchase_order, consignee_name, 
    consignee_address, consignee_city, consignee_state,
    consignee_postal_code, consignee_phone, consignee_email,
    shipment_status='pending', consignee_special_instructions=''):
    '''Add shipment data to Vendia Share node

    Parameters
    ----------
    order_date: string, required
    due_date: string, required
    shipment_status: string, optional
    consignee_name: string, required
    consignee_address: string, required
    consignee_city: string, required
    consignee_state: string, required
    consignee_postal_code: string, required
    consignee_phone: string, required
    consignee_email: string, required
    consignee_special_instructions: string, optional
    purchase_order: string, required
    

    Returns
    -------
    result: dict
        Result of the GraphQL query operation
    '''
    params = {
        "orderDate": order_date,
        "dueDate": due_date,
        "shipmentStatus": shipment_status,
        "consigneeName": consignee_name,
        "consigneeAddress": consignee_address,
        "consigneeCity": consignee_city,
        "consigneeState": consignee_state,
        "consigneePostalCode": consignee_postal_code,
        "consigneePhone": consignee_phone,
        "consigneeEmail": consignee_email,
        "consigneeSpecialInstructions": consignee_special_instructions,
        "purchaseOrder": purchase_order
    }

    insert_query = gql(
        """
        mutation addShipment(
            $orderDate: String!,
            $dueDate: String!,
            $shipmentStatus: Self_Shipment_shipmentStatusEnum!,
            $consigneeName: String!,
            $consigneeAddress: String!,
            $consigneeCity: String!,
            $consigneeState: String!,
            $consigneePostalCode: String!,
            $consigneePhone: String!,
            $consigneeEmail: String!,
            $consigneeSpecialInstructions: String!,
            $purchaseOrder: String!,
        ) {
            add_Shipment(
                input: {
                    orderDate: $orderDate,
                    dueDate: $dueDate,
                    shipmentStatus: $shipmentStatus,
                    consigneeName: $consigneeName,
                    consigneeAddress: $consigneeAddress,
                    consigneeCity: $consigneeCity,
                    consigneeState: $consigneeState,
                    consigneePostalCode: $consigneePostalCode,
                    consigneePhone: $consigneePhone,
                    consigneeEmail: $consigneeEmail,
                    consigneeSpecialInstructions: $consigneeSpecialInstructions,
                    purchaseOrder: $purchaseOrder
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
            insert_query,
            variable_values=params
        )
        logger.info(f'Put shipment with purchase order {purchase_order} to {share_node_url}: {result}')
        tracer.put_annotation('ADD_SHIPMENT_TO_SHARE', 'SUCCESS')
    except Exception as e:
        logger.error(f'Failed to put shipment with purchase order {purchase_order} to {share_node_url}: {str(e)}')
        tracer.put_annotation('ADD_SHIPMENT_TO_SHARE', 'FAILURE')
        raise

    return(result)

    
@tracer.capture_method
@logger.inject_lambda_context
def lambda_handler(event, context):
    for record in event['Records']:
        payload = json.loads(base64.b64decode(record['kinesis']['data']).decode('utf-8'))
        
        # Set the due_date to 7 days beyond the order_date
        order_date = datetime.datetime.strptime(payload['orderDate'], '%Y-%m-%dT%H:%M:%SZ')
        due_date = (order_date + datetime.timedelta(days=7)).strftime('%Y-%m-%dT%H:%M:%SZ')

        result = add_shipment(
            order_date = payload['orderDate'],
            due_date = due_date,
            consignee_name = payload['consigneeName'],
            consignee_address=payload['consigneeAddress'],
            consignee_city=payload['consigneeCity'],
            consignee_state=payload['consigneeState'],
            consignee_postal_code=payload['consigneePostalCode'],
            consignee_phone=payload['consigneePhone'],
            consignee_email=payload['consigneeEmail'],
            purchase_order=payload['purchaseOrder']
        )

        logger.info(result)
        

 
