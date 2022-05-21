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

In this demo, two joint-venture business partners use Vendia Share to exchange account contact information. Each partner has their own account team managing customer relationships. The joint-venture partner account teams need to coordinate with each other on a regular basis.

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

There are two entities added to the Universal Application. However, not all partners will have the same access to the entities.

* __JV2__ will have the ability to _READ_ the Vendia account entry
* __JV2__ will _not_ have any access to the Amazon account entry's __users__ property.

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
1. View the results

#### Explanation

The ACL appended to the first account contact granted read-only access to the Vendia account contacts to __JV2__. The ACL appended to the Amazon account contact prevented the `users` property from reaching the __JV2__ node entirely.

__Note:__ The `nodes` definition in an `aclInput` can be either a list of node names or a wildcard character ("*").

## Step 3 - Add Account Contacts as JV2

__JV2__ must first add tickets to the Uni to make account contacts available to __JV1__.

### Add Account Contacts as JV2

As __JV2__, add several account contacts to the Uni using a set of GraphQL mutations, each with Access Control List (ACL) information that defines the read and write access to the account contact from all other nodes in the Uni.

1. Open the GraphQL Explorer of the __JV2__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [jv2-add-contacts.gql](resources/jv2-add-contacts.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to __JV2__
1. Monitor the progress modal in the lower-right to confirm the account contacts are added successfully

### Confirm Account Contacts as JV2

#### Using GraphQL Explorer

You can view the newly added account contacts through the GraphQL Explorer view of the Vendia Share web app.

1. Open the GraphQL Explorer of __JV2__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [jv2-list-contacts.gql](./resources/jv2-list-contacts.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __JV2__ node
1. Monitor the progress modal in the lower-right of the screen to confirm the _newly added_ account contacts are added successfully and the __users__ object is not null.

### Confirm Account Contacts as JV1

1. Open the GraphQL Explorer of __JV1__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [jv1-list-contacts.gql](./resources/jv1-list-contacts.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __JV1__ node
1. Monitor the progress modal in the lower-right of the screen to confirm the `Disney` account contacts are visible and only the `partner`, `accountName`, `primaryContactName` and `primaryContactEmail` are visible.

#### Explanation

The ACL appended to the first account contact granted read-only access to the Disney account contacts to __JV1__. The ACL appended to the NBC Universal account contact only allowed the `partner`, `accountName`, `primaryContactName` and `primaryContactEmail` properties from reaching the __JV1__ node entirely.

__Note:__ The `nodes` definition in an `aclInput` can be either a list of node names or a wildcard character ("*").

## Demo Conclusion

Through these simple steps, you explored Vendia Share's GraphQL interface and fine-grained data access controls.

To explore more Share capabilities, please explore additional [demos](../../../demos).
