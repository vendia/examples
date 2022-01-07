import os
import json

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

query = gql(
    """
    query q {
			list_InventoryItems {
				_InventoryItems {
					_id
					itemName
					itemNumber
					quantity
					lastUpdated
				}
			}
		}
    """
)

try:
    result = gql_client.execute(
        query
    )
except Exception as e:
    raise Exception(f'Error: {str(e)}')

print(json.dumps(result, indent=4))
