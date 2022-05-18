# Vendia Share Demo - A Real-Time Sharing of CRM Data

[Vendia Share](https://www.vendia.net) is the real-time data cloud for rapidly building applications that securely share data across departments, companies, clouds, and regions.  

## Demo Overview

* __Level__
    * Intermediate
* __Highlighted Features__
    * Fine-grained data access controls
    * GraphQL

This demo highlights the relative ease that business partners can share account data in a controlled manner.

## Demo Context

In this demo, three joint-venture business partners use Vendia Share to exchange account contact information. Each partner has their own account team managing customer relationships. The joint-venture partner account teams need to coordinate with each other on a regular basis.

Prior to using Vendia Share, the partners struggled to maintain a consistent, shared source of truth of account contact data. The mechanism used was emailing CSVs on a regular, monthly cadence. However, account team structures change often. Since adopting Vendia Share, the partners have been able to reach counterparts in their joint-venture network on the first try, without relying on outdated information.

This demo does not make use of any specific CRM application and uses native Vendia Share tooling. You can build off of this example as a jump-off point to query a CRM and write shared data back to a CRM.

## Demo Pre-requisites

* [Vendia Share Account](https://share.vendia.net/signup)

* [Vendia Share CLI](https://vendia.net/docs/share/cli)

* [Git Client](https://git-scm.com/downloads)

* [Python3](https://www.python.org/download)

* [jq](https://stedolan.github.io/jq/)

### Clone the Repository with SSH

```bash
git clone git@github.com:vendia/examples.git
```

## Step 1: Create a Multi-Party Uni

* Change to the `uni_configuration` directory

```bash
cd examples/demos/crm-sharing/uni_configuration
```

* Create your own copy of the `registration.json.sample` file, removing the `.sample` suffix

```bash
cp registration.json.sample registration.json
```

* Edit the registration file, taking care to update the `name` and the `userId` values appropriately.

__NOTE:__ [Keep the `test-` prefix in the name](https://www.vendia.net/docs/share/limits#uni-and-node-names).

* Create the Uni

```bash
share uni create --config registration.json
```

Wait about 5 minutes for the Uni to reach a `Running` state.

## Step 2 - Add Account Contacts as JV1

To make contact information availabile to __JV2__, __JV1__ must first add account contacts.

### Add Acount Contacts as JV1

As __JV1__, add account contacts for several customers using a set of GraphQL mutations, each with Access Control List (ACL) information that defines the read and write access to account contacts from all other nodes in the Uni.

1. Open the GraphQL Explorer of the __JV1__ node
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [jv1-add-contacts.gql](./resources/jv1-add-contacts.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __JV1__ node
1. Monitor the progress modal in the lower-right of the screen to confirm the contacts are added successfully

### Confirm Account Contacts as JV2

You can also confirm the existence of the newly added account contacts by executing a GraphQL query from the __JV2__ GraphQL Explorer.

#### Using GraphQL Explorer

You can view the newly added account contacts through the GraphQL Explorer view of the Vendia Share web app.

1. Open the GraphQL Explorer of the __JV2__ node
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [jv2-list-contacts.gql](./resources/jv2-list-contacts.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __JV2__ node
1. Monitor the progress modal in the lower-right of the screen to confirm the contacts are added successfully

#### Using Entity Explorer

1. Select the `Entity Explorer` view of the __JV2__ node
1. Click the `_id` field of one of the account contact entries listed in the table
1. View the results. Notice that most of the fields from the prior mutations are populated, except for the `users` field

#### Explanation

The ACL appended to the first account contact prevented that account contact from reaching __JV2__. The ACL appended to the second account contact allowed it to reach the __JV2__ node but excluded the `users` from being transmitted.

## Step 3 - Add Account Contacts as JV2

