from datetime import datetime
import os

import click
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
import urllib3
from vendia_utils.blocks import MutationVisitor

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

def get_mutations(block_id):
    '''Get the contents of a Vendia block given the block_id
    
    Parameters
    ----------
    block_id: string, required
        Block ID created

    Returns
    -------
    returns: dict (Structured representation of the transactions in block)
    '''
    params = {
        "id": block_id
    }
    
    query = gql(
        """
        query get_Block(
            $id: ID!
        ) {
            getVendia_Block(id: $id) {
                transactions {
                    mutations
                    _owner
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


    for transaction in result['getVendia_Block']['transactions']:        
        yield from MutationVisitor.parse_mutations(transaction["mutations"])

@click.command()
@click.option('--block', '-b', default="000000000000001", help="Block ID")
def block_query(block):
   mutations = get_mutations(block)

   for m in mutations:
       print(m)

if __name__ == '__main__':
    block_query()
