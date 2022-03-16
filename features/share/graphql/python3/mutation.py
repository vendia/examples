from datetime import datetime
import os

import click
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
import urllib3

urllib3.disable_warnings()

api = os.getenv("API")
api_key = os.getenv("API_KEY")

transport = RequestsHTTPTransport(
    url=api,
    use_json=True,
    headers={
        "Content-type": "application/json",
        "x-api-key": api_key
    },
    verify=False,
    retries=3,
)

gql_client = Client(
    transport=transport,
    fetch_schema_from_transport=True,
)

def get_id(itemname):
    '''Get the _id value associated with the itemname

    Parameters
    ----------
    itemname: string, required

    Returns
    -------
    result: string
        _id value associated with the itemname
    '''

    params = {
        "itemName": itemname
    }

    query = gql(
        """
        query listInventoryItems($itemName:String) {
            list_InventoryItems(filter: {itemName: {eq: $itemName}}) {
                _InventoryItems {
                    _id
                }
            }
        }
        """
    )

    try:
        result = gql_client.execute(
            query,
            variable_values=params
        )
    except Exception as e:
        raise Exception(f'Error: {str(e)}')
    
    try:
        return(result['list_InventoryItems']['_InventoryItems'][0]['_id'])
    except:
        raise Exception(f'{itemname} not found')

def set_quantity(itemid, quantity):
    '''Update the quantity associated with the i

    Parameters
    ----------
    itemid: string, required


    Returns
    -------
    result: string
        _id value associated with the itemname
    '''

    params = {
        "id": itemid,
        "quantity": quantity,
        "lastupdated": datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    }

    query = gql(
        """
        mutation updateInventory($id: ID!, $quantity: Int, $lastupdated: String) {
            update_Inventory(id: $id, input: {quantity: $quantity, lastUpdated: $lastupdated}, syncMode: ASYNC) {
                transaction {
                    _id
                }
            }
        }
        """
    )

    try:
        result = gql_client.execute(
            query,
            variable_values=params
        )
    except Exception as e:
        raise Exception(f'Error: {str(e)}')
    
    try:
        return(result['update_Inventory']['result']['_id'])
    except:
        raise Exception(f'{itemid} not found')


@click.command()
@click.option('--itemname', '-i', default="Thing 1", help="Item name")
@click.option('--quantity', '-q', type=int, default=1, help="Quantity")
def update_quantity(itemname, quantity):
    item_id = get_id(itemname)

    result = set_quantity(item_id, quantity)

    if result:
        print(f'{itemname} quantity: {quantity}')


if __name__ == '__main__':
    update_quantity()
