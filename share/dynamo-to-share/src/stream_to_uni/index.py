import os
import urllib3

import boto3
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


def add_to_share(
    item_name,
    item_number,
    quantity,
    unit_price,
    tags
):
    '''Add selected inventory data to Vendia Share node

    Parameters
    ----------
    item_name: string, required
    item_number: string, required
    quantity: number, required
    tags: list, required

    Returns
    -------
    result: dict
        Result of the GraphQL query operation
    '''
    params = {
        "itemName": item_name,
        "itemNumber": item_number,
        "quantity": quantity,
        "unitPrice": unit_price,
        "tags": tags
    }

    insert_query = gql(
        """
        mutation addItem(
            $itemName: String!,
            $itemNumber: String!,
            $quantity: Int!,
            $unitPrice: Float!,
            $tags: [String!]
        ) {
            addInventoryItem_async(
                input: {
                    itemName: $itemName,
                    itemNumber: $itemNumber,
                    quantity: $quantity,
                    tags: $tags,
                    unitPrice: $unitPrice
                }
            ) {
                error
                result {
                    _id
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
    except Exception as e:
        raise Exception(f'Error: {str(e)}')

    return(result)


def remove_from_share(
    item_number
):
    '''Remove inventory item from Vendia Share node

    Parameters
    ----------
    item_number: string, required

    Returns
    -------
    result: dict
        Result of the GraphQL query operation
    '''
    # Determine the Vendia id of the item_number
    params = {
        "itemNumber": item_number
    }

    search_query = gql(
        """
        query listItem(
            $itemNumber: String!
        ) {
            listInventoryItems(
                filter: {
                    itemNumber: {
                        eq: $itemNumber
                    }
                }
            ) {
                InventoryItems {
                    _id
                }
            }
        }
        """
    )

    try:
        result = gql_client.execute(
            search_query,
            variable_values=params
        )
    except Exception as e:
        raise Exception(f'Error: {str(e)}')
    
    item_id = result['listInventoryItems']['InventoryItems'][0]['_id']

    # Remove the item from Vendia Share
    params = {
        "_id": item_id
    }

    remove_query = gql(
        """
        mutation removeItem(
            $_id: ID!
        ) {
            removeInventoryItem_async(
                _id: $_id
            ) {
                error
                result {
                    _id
                }
            }
        }
        """
    )

    try:
        result = gql_client.execute(
            remove_query,
            variable_values=params
        )
    except Exception as e:
        raise Exception(f'Error: {str(e)}')

    return(result)


def update_in_share(
    item_name,
    item_number,
    quantity,
    unit_price,
    tags
):
    '''Update inventory item from Vendia Share node

    Parameters
    ----------
    item_name: string, required
    item_number: string, required
    quantity: number, required
    unit_price: number, required
    tags: list, required

    Returns
    -------
    result: dict
        Result of the GraphQL query operation
    '''
    # Determine the Vendia id of the item_number
    params = {
        "itemNumber": item_number
    }

    search_query = gql(
        """
        query listItem(
            $itemNumber: String!
        ) {
            listInventoryItems(
                filter: {
                    itemNumber: {
                        eq: $itemNumber
                    }
                }
            ) {
                InventoryItems {
                    _id
                }
            }
        }
        """
    )

    try:
        result = gql_client.execute(
            search_query,
            variable_values=params
        )
    except Exception as e:
        raise Exception(f'Error: {str(e)}')
    
    item_id = result['listInventoryItems']['InventoryItems'][0]['_id']

    # Update the item in Vendia Share
    params = {
        "_id": item_id,
        "itemName": item_name,
        "itemNumber": item_number,
        "quantity": quantity,
        "unitPrice": unit_price,
        "tags": tags
    }

    update_query = gql(
        """
        mutation updateItem(
            $_id: ID!,
            $itemName: String!,
            $itemNumber: String!,
            $quantity: Int!,
            $unitPrice: Float!,
            $tags: [String!]
        ) {
            putInventoryItem_async(
                _id: $_id,
                input: {
                    itemName: $itemName,
                    itemNumber: $itemNumber,
                    quantity: $quantity,
                    unitPrice: $unitPrice,
                    tags: $tags
                }
            ) {
                error
                result {
                    _id
                }
            }
        }
        """
    )

    try:
        result = gql_client.execute(
            update_query,
            variable_values=params
        )
    except Exception as e:
        raise Exception(f'Error: {str(e)}')

    return(result)



def handler(event, context):
    for record in event['Records']:
        event_name = record["eventName"]

        if event_name == 'INSERT':
            new_image = record['dynamodb']['NewImage']
            tags = [ tag["S"] for tag in new_image["tags"]["L"]]
            
            result = add_to_share(
                item_name=new_image["item_name"]["S"],
                item_number=new_image["item_number"]["S"],
                quantity=int(new_image["quantity"]["N"]),
                unit_price=float(new_image["unit_price"]["N"]),
                tags=tags
            )
        elif event_name == 'REMOVE':
            result = remove_from_share(
                item_number=record['dynamodb']['Keys']['item_number']['S']
            )
        elif event_name == 'MODIFY':
            tags = [ tag["S"] for tag in record["dynamodb"]["NewImage"]["tags"]["L"]]
            
            result = update_in_share(
                item_name=record["dynamodb"]["NewImage"]["item_name"]["S"],
                item_number=record["dynamodb"]["NewImage"]["item_number"]["S"],
                quantity=int(record["dynamodb"]["NewImage"]["quantity"]["N"]),
                unit_price=float(record["dynamodb"]["NewImage"]["unit_price"]["N"]),
                tags=tags
            )
        else:
            print(f"We don't handle {event_name} yet")
            print(event)
        
        print(result)
 
