# Deploying and Configuring Salesforce

Now that you've [deployed your Uni](./deploy-uni.md) and the [Postgres database](./deploy-postgres.md), you will deploy a [Salesforce Connected App](https://help.salesforce.com/s/articleView?id=sf.connected_app_overview.htm&type=5) to allow for your Salesforce instance to capture account contacts sourced from your Postgre database.

## Pre-requisites

You will need to sign up for a free [Salesforce Developer Edition account](https://developer.salesforce.com/signup).

## Configuring API Access

First, log in with your Salesforce credentials.

```bash
sfdx auth:web:login
```

Log in with the Salesforce username and password you specified in `examples/demos/crm-sharing/postgres-to-salesforce/.env` and allow API access.

Use the `sfdx` command to verify the specified user is in the list.

```bash
sfdx auth:list
```

Once you have authenticated successfully, deploy the Salesforce Connected App. The `examples/demos/crm-sharing/postgres-to-salesforce` solution utilizes a Connected App for API interactions.

```bash
sfdx force:source:deploy -x "manifest/package.xml" -u ${SALESFORCE_USERNAME}
```

## Gathering and Storing API Credentials

You can get the `Vendia Connector` credentials by running the following command, clicking opening the on **View** link for `vendia_connector`, and then the _Manage Consumer Details_ button.

```bash
sfdx force:org:open --path /lightning/setup/NavigationMenus/home -u ${SALESFORCE_USERNAME}
```

Be sure to save the `Consumer Key` and `Consumer Secret` to the `SALESFORCE_CONSUMER_KEY` and `SALESFORCE_CONSUMER_SECRET` variables in the att/postgres-to-salesforce/.env` file.

Once the file is saved, be sure to source it by running the following command:

```bash
# Use the actual path to the .env file.
# The entry below may need to be updated. 
. examples/demos/crm-sharing/postgres-to-salesforce/.env
```

## Set up Custom Fields on the Salesforce Contact Object

You will need to define two new custom fields on the existing Contact object.

* Vendia ID (API Name:Vendia_ID__c  Type:Text(255))

* SourceDatabaseUserId (API Name: SourceDatabaseUserId__c Type: Text(255))

The two fields need to be added to the `Contact Layout` of the Contact object.

Once Salesforce is configured, you will [deploy a serverless application](./deploy-serverless-app.md) to capture changes to your Uni and publish them to Salesforce.
