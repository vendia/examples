<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.com/images/logo/logo.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Getting Block Data

In this example we will use Python3 to query our Uni's ledger and retrieve specific [blocks](https://www.vendia.net/docs/share/terms-and-definitions#block).

## Installation

Make sure you have a working Python3 enironment. Run the following command to install the required dependencies:

```bash
python3 -m venv venv
. ./venv/bin/activate
pip install pip --upgrade
pip install -r requirements.txt
```

# Querying our Uni Node

[In an earlier step](../README.md) we created a new Uni and recorded the `httpsUrl` and our `apiKey` of the **Warehouse** node. We will use this information to get transactions associated with a given block. The query is defined in the file [`block_query.py`](block_query.py).

```bash
API="warehouse_https_url" \
API_KEY="warehouse_api_key" \
python block_query.py [--block block_id]
```

The command will return a specified block (default: "000000000000001").

**NOTE:** The results below are representative and may not be identical to this example.

```bash
{'__operation': 'add', '__typename': 'Self_Inventory', 'arguments': {'id': '017f55f3-fda5-a866-f9c8-12ff87f8300f', 'input': {'itemName': 'Thing 2', 'itemNumber': 'th002', 'quantity': 200, 'lastUpdated': '2022-01-01T00:00:00Z'}}}
{'__operation': 'add', '__typename': 'Vendia_DeploymentInfo', 'arguments': {'id': '2022-03-04T17:30:46.924715+00:00', 'input': {'deploymentTime': '2022-03-04T17:30:46.924715+00:00', 'consensusDefinitionHash': 'bb87d9c391a51095a7ad6cb0c6bb4a4254a0e9b35f124121744f3bcde3e8e901', 'versionTag': 'prod-release.2022-03-03.ee5b102'}}}
{'__operation': 'add', '__typename': 'Self_Inventory', 'arguments': {'id': '017f55f3-fcc1-8ef2-007d-a2a4b4f6d859', 'input': {'itemName': 'Thing 1', 'itemNumber': 'th001', 'quantity': 100, 'lastUpdated': '2022-01-01T00:00:00Z'}}}
{'__operation': 'add', '__typename': 'Self_Inventory', 'arguments': {'id': '017f55f3-fee1-c69b-e269-47ca9aff453a', 'input': {'itemName': 'Thing 3', 'itemNumber': 'th003', 'quantity': 300, 'lastUpdated': '2022-01-01T00:00:00Z'}}}
{'__operation': 'put', '__typename': 'Vendia_UniInfo', 'arguments': {'input': {'name': 'test-graphql-goodies.unis.mc-namara.com', 'sku': 'SHARE', 'schema': '{"$schema":"http://json-schema.org/draft-07/schema#","$id":"http://vendia.net/schemas/demos/inventory-management-system.json","title":"Inventory Management System","description":"Store inventory data","type":"object","properties":{"Inventory":{"description":"Inventory","type":"array","items":{"type":"object","properties":{"itemName":{"description":"Item name","type":"string"},"itemNumber":{"description":"Item number","type":"string"},"quantity":{"description":"Available quanitity of item","type":"integer","minimum":0},"lastUpdated":{"description":"Last update timestamp","type":"string","format":"date-time"}}}}}}', 'schemaNamespace': 'Self', 'status': 'RUNNING', 'createdTime': '2022-03-04T17:22:07.390879+00:00', 'updatedTime': '2022-03-04T17:30:46.924715+00:00', 'nodes': [{'name': 'Warehouse', 'userId': 'my-user-id', 'userEmail': 'me@domain.com', 'status': 'RUNNING', 'csp': 'aws', 'region': 'us-west-2', 'tier': {'share': 'ENTERPRISE'}, 'vendiaAccount': {'csp': 'AWS', 'accountId': '123456789012', 'org': '123456789012'}}, {'name': 'Retailer', 'userId': 'my-user-id', 'userEmail': 'me@domain.com', 'status': 'RUNNING', 'csp': 'aws', 'region': 'us-east-2', 'tier': {'share': 'ENTERPRISE'}, 'vendiaAccount': {'csp': 'AWS', 'accountId': '123456789012', 'org': '123456789012'}}]}}}
```

# Summary

What is important to note is that we were able to use Python3 to interact with our GraphQL API to examine the transactions that updated our Uni's data. This information can be used to perform further data processing by each participant. For example, you can take this information and publish it to a data warehouse or other analytics tool.
