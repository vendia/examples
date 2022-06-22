from functools import lru_cache
import os
from typing import Any

from aws_lambda_powertools import Logger
import requests
from simple_salesforce import Salesforce
import urllib3

import lib.vendia as vendia


urllib3.disable_warnings()

logger = Logger()

PARTNER = os.getenv('AIRLINE')
CORPORATE_ACCOUNT_TYPE = os.getenv('CORPORATE_ACCOUNT_TYPE')
AGENCY_ACCOUNT_TYPE = os.getenv('AGENCY_ACCOUNT_TYPE')


@lru_cache
def get_sf_client():
    try:
        sf = Salesforce(
            instance_url=os.getenv('SF_INSTANCE_URL'),
            username=os.getenv('SF_USERNAME'),
            password=os.getenv('SF_PASSWORD'),
            security_token=os.getenv('SF_SECURITY_TOKEN')
        )
    except Exception as e:
        logger.error(f'Could not create Salesforce object: {str(e)}')

    return sf


def get_account_name(account_id: str) -> str:
    '''Get the name of the Account given the Account ID

    Parameters
    ----------
    account_id: string
        ID of the account as stored in a Salesforce Opportunity
    
    Returns
    -------
    name: string
        Name of the account (empty string if matching account is not exactly 1)
    '''
    sf = get_sf_client()

    try:
        account_result = sf.query_all(f"SELECT Name FROM Account WHERE Id = '{account_id}'")
        account_matches = account_result['totalSize']
    except Exception as e:
        logger.error(f'Could not retrieve Id from Account: {str(e)}')
        raise Exception(str(e))

    if account_matches == 1:
        return account_result['records'][0]['Name']
    else:
        return ''


def get_account_id(attribute_type: str, identifier: str) -> str:
    '''Return the Salesforce account given an identifier - could be Duns or Branch number

    Parameters
    ----------
    type: type of identifier ('duns' or 'branch')
    
    identifier: string
    
    Returns
    -------
    Id: string
        Id of the account (empty string if matching account is not exactly 1)
    '''
    sf = get_sf_client()

    # Add in the custom indicator for the type
    attribute = f'{attribute_type.title()}__c'

    try:
        result = sf.query_all(f"SELECT Id from Account WHERE {attribute} = '{identifier}'")
    except Exception as e:
        logger.error(f'Could not retrieve Account Id from Salesforce where {attribute} is {identifier}: {str(e)}')
    
    if len(result['records']) == 0:
        logger.info(f'No Account found in Salesforce with {attribute} {identifier}')
        return('')
    else:
        return(result['records'][0]['Id'])


def get_account_id_by_name(account_name: str) -> str:
    '''Return the Salesforce account given an account name

    Parameters
    ----------
    account_name: string
        name of the account
    
    Returns
    -------
    Id: string
        Id of the account (empty string if matching account is not exactly 1)
    '''
    sf = get_sf_client()

    try:
        result = sf.query_all(f"SELECT Id from Account WHERE Name = '{account_name}'")
    except Exception as e:
        logger.error(f'Could not retrieve Account Id from {PARTNER} Salesforce: {str(e)}')
    
    if len(result['records']) == 0:
        logger.info(f'No Account found in {PARTNER} Salesforce with Name {account_name}')
        return('')
    else:
        return(result['records'][0]['Id'])


def get_duns_number(account_id: str) -> str:
    '''Get the Duns of the Account given the Account ID

    Parameters
    ----------
    account_id: string
        ID of the account as stored in a Salesforce Opportunity
    
    Returns
    -------
    duns: string
        Duns__c of the account (empty string if matching account is not exactly 1)
    '''
    sf = get_sf_client()
    
    try:
        account_result = sf.query_all(f"SELECT Duns__c FROM Account WHERE Id = '{account_id}'")
        account_matches = account_result['totalSize']
    except Exception as e:
        logger.error(f'Could not retrieve Duns__c from Account: {str(e)}')
        raise Exception(str(e))
    
    if account_matches == 1:
        return account_result['records'][0]['Duns__c']
    else:
        return ''


def get_branch_number(account_id: str) -> str:
    '''Get the Branch of the Account given the Account ID

    Parameters
    ----------
    account_id: string
        ID of the account as stored in a Salesforce Opportunity
    
    Returns
    -------
    branch: string
        Branch__c of the account (empty string if matching account is not exactly 1)
    '''
    sf = get_sf_client()
    
    try:
        account_result = sf.query_all(f"SELECT Branch__c FROM Account WHERE Id = '{account_id}'")
        account_matches = account_result['totalSize']
    except Exception as e:
        logger.error(f'Could not retrieve Branch__c from Account: {str(e)}')
        raise Exception(str(e))
    
    if account_matches == 1:
        return account_result['records'][0]['Branch__c']
    else:
        return ''

def get_opportunities(last_run: str, status: str = 'active') -> dict:
    '''Get a list of Salesforce opportunities created or updated since last_run

    Parameters
    ----------
    last_run: string
        Timestamp of when the query was last run

    status: string
        active or deleted (default: active)

    Returns
    -------
    result: dict
        Dictionary of items created or updated since last_run
    '''

    sf = get_sf_client()

    if status == 'active':    
        try:
            results = sf.query_all(f"SELECT Id, AccountId, Name, Probability, ExpectedRevenue, CloseDate FROM Opportunity WHERE (SystemModStamp > {last_run} AND Partner_Source__c = NULL) ORDER BY SystemModStamp")
        except Exception as e:
            logger.error(str(e))
            raise Exception(str(e))
    
    elif status == 'deleted':
        try:
            results = sf.query_all(f"SELECT AccountId, Name FROM Opportunity WHERE IsDeleted = True AND (SystemModStamp > {last_run} AND Partner_Source__c = NULL) ORDER BY SystemModStamp", include_deleted=True)
        except Exception as e:
            logger.error(str(e))
            raise Exception(str(e))

    return results


def get_opportunity_id(vendia_id: str) -> str:
    '''Retrieve the Opportunity ID based upon the Vendia ID value.
    The Vendia ID is unique based upon the Partner, Duns, and Opportunity Name stored in Vendia.

    Parameters
    ----------
    vendia_id: str
        ID of entry specified in Vendia Share
    
    Returns
    -------
    opportunity_id: str
        Salesforce Opportunity ID (empty string if matching opportunity is not exactly 1)
    '''

    sf = get_sf_client()

    try:
        opportunity_result = sf.query_all(f"SELECT Id FROM Opportunity where Vendia_ID__c = '{vendia_id}'")
        opportunity_matches = opportunity_result['totalSize']
    except Exception as e:
        logger.error(str(e))
        raise Exception(str(e))

    if opportunity_matches == 1:
        return opportunity_result['records'][0]['Id']
    else:
        return ''


def add_partner_opportunity(
    vendia_id: str,
    partner_name: str,
    account_name: str,
    opportunity_name: str,
    probability: str,
    estimated_revenue: str,
    estimated_close_date: str
) -> dict:
    sf = get_sf_client()

    account_id = get_account_id_by_name(account_name)
    
    # If there is exactly 1 Account match then add the new opportunity
    if account_id:
        # Determine StageName based upon probability
        # First, cast probability to a float
        probability = float(probability)

        if 0 < probability <= 10:
            stage_name = 'Prospecting'
        elif 11 < probability <= 20:
            stage_name = 'Needs Analysis'
        elif 21 < probability <= 50:
            stage_name = 'Value Proposition'
        elif 51 < probability <= 60:
            stage_name = 'Id. Decision Makers'
        elif 61 < probability <= 70:
            stage_name = 'Perception Analysis'
        elif 71 < probability <= 75:
            stage_name = 'Proposal/Price Quote'
        elif 76 < probability <= 99:
            stage_name = 'Negotiation/Review'
        elif probability == 100:
            stage_name = 'Closed Won'
        else:
            stage_name = 'Closed Lost'

        try:
            result = sf.Opportunity.create(
                {
                    'Vendia_ID__c': vendia_id,
                    'Partner_Source__c': partner_name,
                    'AccountId': account_id,
                    'Name': f'{partner_name} - {opportunity_name}',
                    'Probability': probability,
                    'Amount': estimated_revenue,
                    'StageName': stage_name,
                    'CloseDate': estimated_close_date
                }
            )
        except Exception as e:
            logger.error(str(e))
            raise Exception(str(e))
    else:
        logger.error(f'Could not get 1 Salesforce match for Account {account_name} (Duns: {duns}) when adding a new partner Opportunity')
        result = ''
    return result


def update_partner_opportunity(
    vendia_id: str,
    partner_name: str,
    account_name: str,
    opportunity_name: str,
    probability: str,
    estimated_revenue: str,
    estimated_close_date: str,
) -> dict:
    sf = get_sf_client()

    # Make sure account name represents an existing account
    account_id = get_account_id_by_name(account_name)
    
    # If there is exactly 1 Account match then update the existing opportunity
    if account_id:
        # Determine StageName based upon probability
        # First, cast probability to a float
        probability = float(probability)

        if 0 < probability <=10:
            stage_name = 'Prospecting'
        elif 11 < probability <= 20:
            stage_name = 'Needs Analysis'
        elif 21 < probability <= 50:
            stage_name = 'Value Proposition'
        elif 51 < probability <= 60:
            stage_name = 'Id. Decision Makers'
        elif 61 < probability <= 70:
            stage_name = 'Perception Analysis'
        elif 71 < probability <= 75:
            stage_name = 'Proposal/Price Quote'
        elif 76 < probability <= 90:
            stage_name = 'Negotiation/Review'
        elif probability == 100:
            stage_name = 'Closed Won'
        else:
            stage_name = 'Closed Lost'

        try:
            opportunity_id = get_opportunity_id(vendia_id)

            try:
                result = sf.Opportunity.update(
                    opportunity_id,
                    {
                        'Partner_Source__c': partner_name,
                        'AccountId': account_id,
                        'Name': f'{partner_name} - {opportunity_name}',
                        'Probability': probability,
                        'Amount': estimated_revenue,
                        'StageName': stage_name,
                        'CloseDate': estimated_close_date
                    }
                )
            except Exception as e:
                logger.error(str(e))
                raise Exception(str(e))

        except Exception as e:
            logger.error(str(e))
            raise Exception(str(e))
    else:
        logger.error(f'Could not get 1 Salesforce match for Account {account_id} (Duns: {duns}) when adding a new partner Opportunity')
        result = ''
    
    return result


def sync_opportunities_to_share(last_run: str) -> dict:
    '''Helper function to sync records that have been updated
    or deleted since last_run.

    **NOTE:** Updated means records that have been created as well as updated.

    Parameters
    ----------
    last_run: string
        Timestamp of when the sync was last run
    
    Returns
    -------
    result: dict
        Dictionary of items updated and deleted since last_run
    '''
    # Results is a dict of dicts. Keys: 'updated', 'deleted'
    
    results = {}

    # Go through process of getting items that have been created or updated
    try:
        updated_results = get_opportunities(last_run)
    except Exception as e:
        logger.error(str(e))
        raise Exception(str(e))
    
    # List to hold the updated records
    results['updated'] = []

    if len(updated_results['records']) == 0:
        logger.info(f'No opportunities created or updated since {last_run}')
    else:
        for record in updated_results['records']:
            u = {}
            u['account_name'] = get_account_name(record.get('AccountId'))
            u['duns'] = get_duns_number(record.get('AccountId'))
            u['branch'] = get_branch_number(record.get('AccountId'))
            u['opportunity_name'] = record.get('Name')
            u['probability'] = str(record.get('Probability'))
            u['expected_revenue'] = str(record.get('ExpectedRevenue'))
            u['close_date'] = record.get('CloseDate')
            

            # Determine whether there is an opportunity.
            # Records in Vendia Share should be unique based
            # upon Partner + Duns + Branch + Opportunity Name
            opportunity_id = vendia.opportunity_check_if_exists(
                PARTNER,
                u['opportunity_name'],
                u['account_name']
            )

            if opportunity_id:
                u['vendia_operation'] = 'update'
                if u['duns']:
                    try:
                        vendia_result = vendia.corporate_opportunity_update(
                            opportunity_id,
                            PARTNER,
                            u['account_name'],
                            u['duns'],
                            u['opportunity_name'],
                            u['probability'],
                            u['expected_revenue'],
                            u['close_date']
                        )

                        u['vendia_result'] = vendia_result
                    except Exception as e:
                        logger.error(str(e))
                        raise Exception(str(e))
                else:
                    try:
                        vendia_result = vendia.agency_opportunity_update(
                            opportunity_id,
                            PARTNER,
                            u['account_name'],
                            u['branch'],
                            u['opportunity_name'],
                            u['probability'],
                            u['expected_revenue'],
                            u['close_date']
                        )

                        u['vendia_result'] = vendia_result
                    except Exception as e:
                        logger.error(str(e))
                        raise Exception(str(e))
            else:
                u['vendia_operation'] = 'add'
                if u['duns']:
                    try:                        
                        vendia_result = vendia.corporate_opportunity_add(
                            PARTNER,
                            u['account_name'],
                            u['duns'],
                            u['opportunity_name'],
                            u['probability'],
                            u['expected_revenue'],
                            u['close_date']
                        )

                        u['vendia_result'] = vendia_result
                    except Exception as e:
                        logger.error(str(e))
                        raise Exception(str(e))
                else:
                    try:                        
                        vendia_result = vendia.agency_opportunity_add(
                            PARTNER,
                            u['account_name'],
                            u['branch'],
                            u['opportunity_name'],
                            u['probability'],
                            u['expected_revenue'],
                            u['close_date']
                        )

                        u['vendia_result'] = vendia_result
                    except Exception as e:
                        logger.error(str(e))
                        raise Exception(str(e))

            
            results['updated'].append(u)

    # Go through process of getting items that have been deleted
    try:
        deleted_results = get_opportunities(last_run, status='deleted')
    except Exception as e:
        logger.error(str(e))
        raise Exception(str(e))

    # List to hold the updated records
    results['deleted'] = []
    
    if len(deleted_results['records']) == 0:
        logger.info(f'No opportunities deleted since {last_run}')
    else:
        for record in deleted_results['records']:
            d = {}
            d['opportunity_name'] = record.get('Name')
            d['account_name'] = get_account_name(record.get('AccountId'))

            opportunity_id = vendia.opportunity_check_if_exists(
                PARTNER,
                d['opportunity_name'],
                d['account_name']
            )

            if opportunity_id:
                d['vendia_operation'] = 'delete'
                try:
                    vendia_result = vendia.opportunity_delete(opportunity_id)
                    logger.info(f"Successfully deleted {opportunity_id} from Vendia Share: {vendia_result}")
                    d['vendia_result'] = vendia_result
                except Exception as e:
                    logger.error(str(e))
                    raise Exception(str(e))
            else:
                logger.info(f"Could not find Opportunity {d['opportunity_name']} owned by {PARTNER} in the Uni")
        
            results['deleted'].append(d)
    logger.info(results)
    return results


def get_corp_and_agency_accounts(last_run: str) -> dict:
    '''Get a list of Salesforce Corporate and Agency accounts created or updated since last_run

    Parameters
    ----------
    last_run: string
        Timestamp of when the query was last run

    Returns
    -------
    result: dict
        Dictionary of items created or updated since last_run
    '''
    sf = get_sf_client()

    try:
        results = sf.query_all(f"SELECT Id, RecordTypeId, Name, Duns__c, OwnerId, Account_Sales_Manager__c, Account_Analyst__c, Branch__c FROM Account WHERE (SystemModStamp > {last_run}) AND (RecordTypeId = '{CORPORATE_ACCOUNT_TYPE}' OR RecordTypeId = '{AGENCY_ACCOUNT_TYPE}')")
    except Exception as e:
        logger.error(str(e))
        raise Exception(str(e))
    
    return results


def get_user_attributes(user_id: str, role: str) -> dict:
    '''Create an AccountContact object suitable for Vendia Share
    
    Parameters
    ----------
    user_id: string
    role: string
    
    Returns
    -------
    result: dict, keys: 'first_name', 'last_name', 'email', 'role'
    '''
    sf = get_sf_client()

    try:
        results = sf.query_all(f"SELECT Name, Email FROM User WHERE Id = '{user_id}'")
    except Exception as e:
        raise Exception(str(e))
    
    first_name, last_name = results['records'][0]['Name'].split(' ', 1)
    email = results['records'][0]['Email']
    return({'firstName': first_name, 'lastName': last_name, 'emailAddress': email, 'accountRole': role})


def sync_account_contacts_to_share(last_run: str) -> dict:
    '''Helper function to sync account contact records that have been updated
    or deleted since last_run.

    **NOTE:** Updated means records that have been created as well as updated.

    Parameters
    ----------
    last_run: string
        Timestamp of when the sync was last run
    
    Returns
    -------
    result: dict
        Dictionary of items updated and deleted since last_run
    '''

    # Go through process of getting items that have been created or updated
    try:
        updated_results = get_corp_and_agency_accounts(last_run)
    except Exception as e:
        logger.error(str(e))
        raise Exception(str(e))
    
    if len(updated_results['records']) == 0:
        logger.info(f'No accounts created or updated since {last_run}')
    else:
        for record in updated_results['records']:
            # RecordTypeId drives whether it is a Corporate or Travel Agency Account
            record_type_id = record.get('RecordTypeId')

            # Corporate account
            if record_type_id == CORPORATE_ACCOUNT_TYPE:
                account_name = record.get('Name')
                duns = record.get('Duns__c')
                owner_id = record.get('OwnerId')
                account_sales_manager = record.get('Account_Sales_Manager__c', '')
                account_analyst = record.get('Account_Analyst__c', '')

                # Create list of users
                users = [
                    get_user_attributes(owner_id, 'Account Owner')
                ]

                if account_sales_manager:
                    users.append(get_user_attributes(account_sales_manager, 'Account Sales Manager'))
                
                if account_analyst:
                    users.append(get_user_attributes(account_analyst, 'Account Analyst'))
                
                # Check if the partner + duns combination exists
                id = vendia.account_contact_id('corporate', PARTNER, duns)
                
                # If the AccountContact object exists, update it in the Uni
                if id:
                    try:
                        result = vendia.update_corporate_account_contact(id, PARTNER, account_name, duns, users)
                        logger.info(f'Successfully updated corporate account PARTNER:{PARTNER} account_name:{account_name} duns:{duns}, users:{users}')
                    except Exception as e:
                        logger.error(f'Error: Could not update corporate account PARTNER:{PARTNER} account_name:{account_name} duns:{duns} - {str(e)}')
                        raise Exception(str(e))
                # If the Account object does not exist, create it
                else:
                    try:
                        result = vendia.create_corporate_account_contact(PARTNER, account_name, duns, users)
                        logger.info(f'Succcessfully created corporate account for PARTNER:{PARTNER} account_name:{account_name} duns:{duns}, users:{users}')
                    except Exception as e:
                        logger.error(f'Error: Could not create corporate account for PARTNER:{PARTNER} account_name:{account_name} duns:{duns} - {str(e)}')
                        raise Exception(str(e))
            elif record_type_id == AGENCY_ACCOUNT_TYPE:
                account_name = record.get('Name')
                branch = record.get('Branch__c')
                owner_id = record.get('OwnerId')
                account_sales_manager = record.get('Account_Sales_Manager__c', '')
                account_analyst = record.get('Account_Analyst__c', '')

                # Create list of users
                users = [
                    get_user_attributes(owner_id, 'Account Owner')
                ]

                if account_sales_manager:
                    users.append(get_user_attributes(account_sales_manager, 'Account Sales Manager'))
                
                if account_analyst:
                    users.append(get_user_attributes(account_analyst, 'Account Analyst'))

                # Check if partner + branch combination exists
                id = vendia.account_contact_id('travel_agency', PARTNER, branch)

                # If the AccountContact object exists, update it
                if id:
                    try:
                        result = vendia.update_travel_agency_contact(id, PARTNER, account_name, branch, users)
                        logger.info(f'Succcessfully updated travel agency PARTNER:{PARTNER} account_name:{account_name} branch:{branch} users:{users}')
                    except Exception as e:
                        logger.error(f'Error: Could not update travel agency PARTNER:{PARTNER} account_name:{account_name} branch:{branch} - {str(e)}')
                        raise Exception(str(e))
                # If the AccountContact object does not exist, create it
                else:
                    try:
                        result = vendia.create_travel_agency_contact(PARTNER, account_name, branch, users)
                        logger.info(f'Succcessfully created travel agency for PARTNER:{PARTNER} account_name:{account_name} branch:{branch} users:{users}')
                    except Exception as e:
                        logger.error(f'Error: Could not create travel agency for PARTNER:{PARTNER} account_name:{account_name} branch:{branch} - {str(e)}')
                        raise Exception(str(e))
            else:
                logger.error(f'Unknown record_type_id:{record_type_id}')
                raise Exception(str(e))


def add_to_salesforce_account_team(tx_partner, tx_key, tx_value, tx_users):
    '''Add new Account Team record to Salesforce
    
    Parameters
    ----------
    tx_partner: string
    tx_key: string (Should be either 'duns' or 'branch')
    tx_value: string
    tx_users: list
    
    Returns
    -------
    result: dict
        Based upon what is returned from Salesforce API
    '''
    sf = get_sf_client()

    attribute = f'{tx_key.title()}__c'
    
    account_id = get_account_id(tx_key, tx_value)
    if account_id:
        for user in tx_users:
            tx_role = str(user['accountRole'])
            email_address = user['emailAddress']
            name = f"{user['firstName']} {user['lastName']}"
            try:
                result = sf.Corporate_Account_Team__c.create(
                    {
                        'Name': f'{tx_partner} - {tx_role}',
                        'Account__c': account_id,
                        'Name_Entry__c': name,
                        'Airline__c': tx_partner,
                        'Role__c': tx_role,
                        'Email_Entry__c': email_address,
                        attribute: tx_value
                    }
                )
            except Exception as e:
                exception_string = f'Could not create new Account Contact {name} ({email_address}) for {tx_partner}: {str(e)}'
                logger.error(exception_string)
                raise Exception(exception_string)
            
            logger.info(result)                

        return('ok')
    else:
        logger.error(f'No account found with {tx_key} of {tx_value}')
        return(f'failure')


def update_salesforce_account_team(tx_partner, tx_key, tx_value, tx_users):
    '''Update existing Account Team record in Salesforce

    Parameters
    ----------
    tx_partner: string
    tx_key: string (Should be either 'duns' or 'branch')
    tx_value: string
    tx_users: list
    
    Returns
    -------
    result: dict
        Based upon what is returned from Salesforce API
    '''

    sf = get_sf_client()

    attribute = f'{tx_key.title()}__c'

    # Ham-handed way to synch Account Contacts
    # Remove existing ones that are associated with the Duns and Airline
    query_result = sf.query_all(f"SELECT Id FROM Corporate_Account_Team__c WHERE Airline__c = '{tx_partner}' AND {attribute} = '{tx_value}'")

    if len(query_result['records']) == 0:
        logger.info(f'No existing Corporate Account Team for Airline {tx_partner} and {tx_key} {tx_value}')
    else:
        for user in query_result['records']:
            try:
                delete_result = sf.Corporate_Account_Team__c.delete(user['Id'])
            except Exception as e:
                logger.error(f'Could not remove user {user["Id"]} from Airline {tx_partner} with {tx_key} {tx_value}: {str(e)}')
                continue
            logger.info(f'Corporate Account Team deletion result for user : {delete_result}')

    
    # Add in the new users
    result = add_to_salesforce_account_team(tx_partner, tx_key, tx_value, tx_users)

    return(result)
