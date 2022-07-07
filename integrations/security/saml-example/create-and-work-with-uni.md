# Creating Our Uni

This example will create a Uni to store a very simple product catalog.

If not already logged in to the share service do so by running [`share login`](https://vendia.net/docs/share/cli/commands/login):

```bash
share login
```

The `share uni create` command can be used to deploy our Uni.  You will need to copy the file `registration.json.sample` to `registration.json`. We will need to make several changes to the `registration.json` file. 

First, we will Pick a unique `name` for your uni that begins with `test-` - by default all Unis share a common namespace so here is your chance to get creative.  Update the `userId` attribute of each node to reflect your Vendia Share email address.

Second, update the `authorizerArn` to reflect the ARN of the Amazon Cognito user pool that we [created in our previous step](auth0-saml-provider-amazon-cup.md).

```bash
cd uni_configuration
share uni create --config registration.json
```

The Uni will take approximately 5 minutes to deploy.  We can check on its status in the Vendia Share web application or with the `share` CLI.

**NOTE:** The name of your Uni will be different.  Adjust as appropriate.

```bash
share get --uni test-saml-example
```

Make note of the `httpsUrl` of the **DistributionCenter** when the Uni gets to a `RUNNING` state. We will need it when interacting with our Uni.

# Working with Data in Our Uni

Let's go ahead and set shell variables we'll be using to read and write data.

```bash
export GRAPHQL_URL="your-graphql-url"

export AUTHORIZATION="id_token_from_previous_step"
```

If the `id_token` has expired you will receive the error `{"message":"The incoming token has expired"}` when running GraphQL operations. 

If the `Authorization` header is not present you will receive the error `{"message":"Unauthorized"}` when running GraphQL operations.

## Getting Information About InventoryItems

We have the ability to determine the properties of `InventoryItems` using GraphQL introspection.

```bash
curl ${GRAPHQL_URL} \
-H 'Content-Type: application/json' \
-H "Authorization: ${AUTHORIZATION}" \
--data-binary '{"query":"query InventoryItem {\n  __type(name: \"Self_InventoryItem\") {\n    name\n    fields {\n      name\n      type {\n        name\n        kind\n      }\n    }\n  }\n}","variables":{}}' \
--compressed 
```

## Reading Data from Our DistributionCenter Node

Our Uni will not have any `InventoryItems` in it since we did not populate it with `initState` data. However, we can still issue a valid GraphQL query to confirm authentication works as expected. We will need to make a request of our **DistributionCenter** `httpsUrl` GraphQL endpoint. This can be done using a GUI like the [Altair GraphQL Client](https://altair.sirmuel.design/) or even a command line utility like [curl](https://man7.org/linux/man-pages/man1/curl.1.html). The `Authorization` header must be present regardless of the utility used to make the GraphQL query.

```bash
curl ${GRAPHQL_URL} \
-H 'Content-Type: application/json' \
-H "Authorization: ${AUTHORIZATION}" \
--data-binary '{"query":"query q {\n  list_InventoryItemItems {\n    _InventoryItemItems {\n      _id\n      itemName\n      itemNumber\n      quantity\n    }\n  }\n}","variables":{}}' \
--compressed
```

## Writing Data to Our DistributionCenter Node

We can issue a mutation to write data to our Uni using a similar curl command.

```bash
curl ${GRAPHQL_URL} \
-H 'Content-Type: application/json' \
-H "Authorization: ${AUTHORIZATION}" \
--data-binary '{"query":"mutation newItem($itemName: String!, $itemNumber: String!, $quantity: Int!) {\n  add_InventoryItem(input: {itemName: $itemName, itemNumber: $itemNumber,  quantity: $quantity}) {\n    transaction {\n      transactionId\n    }\n  }\n}","variables":{"itemName":"foo bar","itemNumber":"abc123","quantity":100}}' \
--compressed
```

We should see an `_id` value, indicating the write was successful. A subsequent `listAllProducts` query should show our new item.

```bash
curl ${GRAPHQL_URL} \
-H 'Content-Type: application/json' \
-H "Authorization: ${AUTHORIZATION}" \
--data-binary '{"query":"query q {\n  list_InventoryItemItems {\n    _InventoryItemItems {\n      _id\n      itemName\n      itemNumber\n      quantity\n    }\n  }\n}","variables":{}}' \
--compressed
```

[Let's summarize what we did as part of this example](summary.md).

