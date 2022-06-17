<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# Vendia Transactions

In this example we will use Node.js to work with [Vendia transactions](https://www.vendia.net/docs/share/vendia-transaction). When used to _update_ data, Vendia transactions allow for coordinated updates on multiple values. When used to _query_ data they ensure that all nodes see a consistent value, even if an in-flight transaction is actively being processed.

We will use the [prisma-labs/graphql-request](https://github.com/prisma-labs/graphql-request) module in our example to query our **Warehouse** node.

## Installation

Make sure you have a working Node.js environment. Run the following command from the current directory to install the required dependencies:

```bash
npm install
```

## Configure the Warehouse Node Error Notification

Error notifications are emitted when asynchronous transactions cannot be committed within the retry policy. These notifications are the only way for operators to know when such a failure occurs. For the purpose of this example, you should configure an [email subscriber](https://www.vendia.net/docs/share/integrations#configuring-an-email-subscriber). Know that other cloud specific integration options are available. Please consult the Vendia [integrations documentation](https://www.vendia.net/docs/share/integrations) for more information.

# Using Vendia Transactions

[In our previous step](../README.md) you created a new Uni and recorded the `httpsUrl` and our `apiKey` of the **Warehouse** node. You will use this information to manipulate items in our inventory.

## Reading Data with Vendia Transactions

You can _read_ data using Vendia Transactions to ensure a consistent value is returned, regardless of the node that issued the query. The query is defined in the file [`transaction-query.cjs`](transaction-query.cjs).

```bash
API="warehouse_https_url" \
API_KEY="warehouse_api_key" \
node transaction-query.cjs
```

The command will return each of the items stored in the Uni.

**NOTE:** The results below are representative and may not be identical to this example. If you've made changes using other runtime examples or the GraphQL Explorer they will be reflected in your query results.

```json
{
  "list_InventoryItems": {
    "_InventoryItems": [
      {
        "_id": "017e215e-3b07-45d1-07c7-1b9117c72935",
        "itemName": "Thing 1",
        "itemNumber": "th001",
        "quantity": 100,
        "lastUpdated": "2022-01-01T00:00:00Z"
      },
      {
        "_id": "017e215e-3c60-94a7-c62c-a0cb1393f5d5",
        "itemName": "Thing 2",
        "itemNumber": "th002",
        "quantity": 200,
        "lastUpdated": "2022-01-01T00:00:00Z"
      },
      {
        "_id": "017e215e-3d82-ff72-c516-6c609f145bbf",
        "itemName": "Thing 3",
        "itemNumber": "th003",
        "quantity": 300,
        "lastUpdated": "2022-01-01T00:00:00Z"
      }
    ]
  }
}
```

## Writing Data with Vendia Transactions

You can _change_ data in our Uni using Vendia Transactions as well. You will decrease the **quantity** of our **Thing 1**, **Thing 2**, and **Thing 3** items as a unit. Either all will succeed or all will fail. A condition will be used in the mutation to make sure there is a sufficient quantity available for each product. You will use the flag`--quantity` to set the desired value. The mutation is defined in the file [`transaction-mutation.cjs`](transaction-mutation.cjs) and will use the `API` and `API_KEY` of our **Warehouse** node.

### Successful Transaction

The following command assumes there are at least 5 units of **Thing 1**, **Thing 2**, and **Thing 3** available.

```bash
API="warehouse_https_url" \
API_KEY="warehouse_api_key" \
node mutation.cjs --quantity 5
```

The output will display what was submitted to the **Warehouse** node.

**NOTE:** The return values for **Thing 1**, **Thing 2**, and **Thing 3** are representative. Your values will differ.

```bash
Submitted shipment request for processing. Ship 1000 unit from Thing1, Thing2, and Thing3.
Thing 1:017f64cc-9587-c0ad-6f07-39644846ee5c Thing 2:017f64cc-9661-66f5-59a4-bf5f64776126 Thing 3:017f64cc-978e-0fc2-fcf6-7d1c01e295db
```

If you run the `transaction-query.cjs` script, you will see your quantity for each item has decreased by 5.

```bash
API="warehouse_https_url" \
API_KEY="warehouse_api_key" \
node transaction-query.cjs
```

## Failed Transaction

Let's update our command. You will reduce the on-hand quantity of by 150 units. If you have not changed the data in the Uni, this command will fail since we don't have that quantity available for **Thing 1**.

```bash
API="warehouse_https_url" \
API_KEY="warehouse_api_key" \
node mutation.cjs --quantity 1000
```

After a period, the address associated with the Dead-Letter notification will receive an email. The body will contain information about the failed mutation. You can see the condition for **Thing 1** was not met. The difference between the requested quantity and on-hand quantity was not greater than or equal to the 99 units available. Even though there was sufficient quantity for **Thing 2** and **Thing 3** _the failure of one operation prevented the entire transaction from completing successfully_.

**NOTE:** Formatting of the **"mutation"** string value has been added to make the payload more legible.

```json
{
  "mutation": "mutation m{
    item1: updateSelf_Inventory(
      id:\"017f64cc-9587-c0ad-6f07-39644846ee5c\",
      input: {
        lastUpdated: \"2022-03-08T07:00:09Z\",
        quantity: -1
      },
      condition: {
        quantity: {
          ge: 100
        }
      }
    ){
      error
    }\n
    item2: updateSelf_Inventory(id:\"017f64cc-9661-66f5-59a4-bf5f64776126\",
      input: {
        lastUpdated: \"2022-03-08T07:00:09Z\",
        quantity: 99
      },
      condition: {
        quantity: {
          ge: 100
        }
      }
    ){
      error
    }\n
    item3: updateSelf_Inventory(id:\"017f64cc-978e-0fc2-fcf6-7d1c01e295db\",
      input: {
        lastUpdated: \"2022-03-08T07:00:09Z\",
        quantity: 299
      },
      condition: {
        quantity: {
          ge: 100
        }
      }
    ){
      error
    }
  }",
  "submission_time": "2022-03-08T12:00:10.516557+00:00",
  "id": "017f6966-ab14-09a8-36c9-1267038b65cf",
  "owner": "Warehouse",
  "transactionId": "017f6966-ab14-09a8-36c9-1267038b65cf",
  "status": "Failed",
  "submissionTime": "2022-03-08T12:00:10.516557+00:00"
}
```

You can run the following GraphQL query to confirm none of the inventory quantities have been updated.

```graphql
query listInventory {
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
```

# Summary

Vendia transactions allow GraphQL developers to get a consistent view of data when querying and bundle related operations together in a logical manner without planning for partial failures when writing data.
