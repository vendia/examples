from datetime import datetime, timedelta
import os

from aws_lambda_powertools import Logger
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
import requests
from simple_salesforce import Salesforce
import urllib3
from vendia_utils.blocks import MutationVisitor

urllib3.disable_warnings()

logger = Logger()

# Vendia Share node data
share_url = os.getenv('SHARE_URL')
share_api_key = os.getenv('SHARE_API_KEY')

transport=RequestsHTTPTransport(
    url=share_url,
    use_json=True,
    headers={
        "Content-type": "application/json",
        "Authorization": share_api_key
    },
    verify=False,
    retries=3,
)

gql_client = Client(
    transport=transport,
    fetch_schema_from_transport=False
)

# Salesforce settings used to create a Salesforce object

sf_token_params = {
    'grant_type': 'password',
    'client_id': os.getenv('SF_CLIENT_ID'),
    'client_secret': os.getenv('SF_CLIENT_SECRET'),
    'username': os.getenv('SF_USERNAME'),
    'password': os.getenv('SF_PASSWORD')
}

try:
    response = requests.post(os.getenv('SF_TOKEN_URL'), params=sf_token_params)
except Exception as e:
    print(f'Error: {str(e)}')

r = response.json()

access_token = r['access_token']
instance_url = r['instance_url']

try:
    sf = Salesforce(
        instance_url = instance_url,
        session_id = access_token
    )
except Exception as e:
    logger.error(str(e))
    raise Exception(str(e))


def get_sf_contact_id(vendia_id):
    '''Return the Salesforce contact ID

    Parameters
    ----------
    vendia_id: string

    Returns
    -------
    string
        Salesforce Contact ID
    '''
    try:
        result = sf.query_all(f"SELECT Id from Contact WHERE Vendia_ID__c='{vendia_id}'")
    except Exception as e:
        logger.error(f'Could not retrieve Salesforce Contact where Vendia_ID__c={vendia_id}')
    
    if len(result['records']) == 0:
        logger.info(f'No Contact found in Salesforce where Vendia_ID__c={vendia_id}')
        return('')
    else:
        return(result['records'][0]['Id'])


def get_sf_account_id(account_number):
    '''Return the Salesforce account ID

    Parameters
    ----------
    account_number: string

    Returns
    -------
    string
        Salesforce Account ID
    '''
    try:
        result = sf.query_all(f"SELECT Id from Account WHERE AccountNumber='{account_number}'")
    except Exception as e:
        logger.error(f'Could not retrieve Salesforce Account where AccountNumber={account_number}')
    
    if len(result['records']) == 0:
        logger.info(f'No Account found in Salesforce where AccountNumber={account_number}')
        return('')
    else:
        return(result['records'][0]['Id'])


def add_salesforce_contact(account_number, db_contact_id, email, first_name, last_name, phone, vendia_id):
    '''Add new contact to Salesforce

    Parameters
    ----------
    account_number: string
    db_contact_id: string
    email: string
    first_name: string
    last_name: string
    phone: string
    vendia_id: string

    Returns
    -------
    result: dict
        Based upon what is returned from Salesforce API
    '''
    try:
        result = sf.Contact.create(
            {
                'AccountId': get_sf_account_id(account_number),
                'SourceDatabaseUserId__c': db_contact_id,
                'Email': email,
                'FirstName': first_name,
                'LastName': last_name,
                'Phone': phone,
                'Vendia_ID__c': vendia_id
            }
        )
    except Exception as e:
        exception_string = f'Could not create new Contact {first_name} {last_name} ({email}) for {account_number}: {str(e)}'
        logger.error(exception_string)
        raise Exception(exception_string)
    
    return(result)


def update_salesforce_contact(account_number, db_contact_id, email, first_name, last_name, phone, vendia_id):
    '''Update existing contact in Salesforce

    Parameters
    ----------
    account_number: string
    db_contact_id: string
    email: string
    first_name: string
    last_name: string
    phone: string
    vendia_id: string

    Returns
    -------
    result: dict
        Based upon what is returned from Salesforce API
    '''
    try:
        result = sf.Contact.update(
            get_sf_contact_id(vendia_id),
            {
                'AccountId': get_sf_account_id(account_number),
                'Email': email,
                'FirstName': first_name,
                'LastName': last_name,
                'Phone': phone,
                'Vendia_ID__c': vendia_id
            }
        )
    except Exception as e:
        exception_string = f'Could not update Contact {first_name} {last_name} ({email}) for {account_number}: {str(e)}'
        logger.error(exception_string)
        raise Exception(exception_string)
    
    return(result)


def remove_salesforce_contact(vendia_id):
    '''Remove contact in Salesforce

    Parameters
    ----------
    vendia_id: string

    Returns
    -------
    result: dict
        Based upon what is returned from Salesforce API
    '''
    try:
        result = sf.Contact.delete(
            get_sf_contact_id(vendia_id)
        )
    except:
        logger.error(f'Could not delete Salesforce contact ID: {str(e)}')
        raise Exception(str(e))
    
    return(result)


def get_mutations(block_id):
    '''Get the contents of a Vendia block given the block_id
    
    Parameters
    ----------
    block_id: string, required
        Block ID created

    Returns
    -------
    returns: dict
        Structured representation of the transactions in the block
    '''
    params = {
        "id": block_id
    }
    
    query = gql(
        """
        query get_Block($id:ID!) {
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

@logger.inject_lambda_context
def handler(event, context):
    for record in event['Records']:
        block_id = record['Sns']['Subject'].split('#')[1]

        # Get the contents of the block from Vendia Share
        mutations = get_mutations(block_id)

        # Iterate through all mutations
        for m in mutations:
            # DEBUG
            logger.info(f'DEBUG - m: {m}')
            operation =  m['__operation']

            if operation not in ['add', 'update', 'remove']:
                logger.info(f'Operation {operation} does not require an update to Salesforce')
                continue

            # Attribute that will be present regardless of the operation
            vendia_id = m['arguments']['id']

            # Attributes that will be present in the block when the operation
            # is either an add or update
            if operation in ['add', 'update']:
                account_number = m['arguments']['input']['accountNumber']
                contact_id = m['arguments']['input']['contactId']
                email = m['arguments']['input']['email']
                first_name = m['arguments']['input']['firstName']
                last_name = m['arguments']['input']['lastName']
                phone = m['arguments']['input']['phone']
            
            if operation == 'add':
                logger.info('** DEBUG - add **')
                result = add_salesforce_contact(
                    account_number,
                    contact_id,
                    email,
                    first_name,
                    last_name,
                    phone,
                    vendia_id
                )
            elif operation == 'update':
                logger.info('** DEBUG - update **')
                result = update_salesforce_contact(
                    account_number,
                    contact_id,
                    email,
                    first_name,
                    last_name,
                    phone,
                    vendia_id
                )
            else:
                logger.info('** DEBUG - remove')
                result = remove_salesforce_contact(
                    vendia_id
                )
            
            logger.info(f'operation:{operation} result:{result}')
    return('ok')
