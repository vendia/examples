<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Conditional Updates

In this example we will use Golang to update data in our Uni, but only if an item has sufficient reserve.

We have used the [machinebox/graphql](https://github.com/machinebox/graphql) module in our example to query the **Warehouse** node. You can experiment with or use other GraphQL modules for Golang as well.

## Installation

Make sure you have a working Golang enironment. Run the following command to install the `machinebox/graphql` module:

```bash
go get github.com/machinebox/graphql
```

## Configure the Warehouse Node Error Notification

Error notifications are emitted when asynchronous transactions cannot be committed within the retry policy. These notifications are the only way for operators to know when such a failure occurs. For the purpose of this example, you should configure an [email subscriber](https://www.vendia.net/docs/share/integrations#configuring-an-email-subscriber). Know that other cloud specific integration options are available. Please consult the Vendia [integrations documentation](https://www.vendia.net/docs/share/integrations) for more information.


# Changing Data with a Conditional Update

[In our previous step](../README.md) you created a new Uni and recorded the `httpsUrl` and our `apiKey` of the **Warehouse** node. You will use this information to ship items in our inventory, but only if there are sufficient items in stock. The mutation is defined in the file [`conditional-update.go`](conditional-update.go).

## Successful Update

The following command will reduce the on-hand quantity of our specified item (**Thing 3**) by 3 units, but only if there are 3 or more items available. If you have not changed the data in the Uni, this command will work since there are 300 **Thing 3** items in the warehouse. After the command runs, there will be 297 items.

```bash
API="warehouse_https_url" \
API_KEY="warehouse_api_key" \
go run conditional-update.go -itemname "Thing 3" -ship 3
```

You can run the following GraphQL query to confirm the updated quantity of **Thing 3**.

```graphql
query listThing3 {
  list_InventoryItems(filter: {itemName: {eq: "Thing 3"}}) {
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

The _quantity_ should be 297.

## Failed Update

Let's update our command. You will reduce the on-hand quantity of our specified item (**Thing 3**) by 1000 units. If you have not changed the data in the Uni, this command will fail since we only have 297 units available.

```bash
API="warehouse_https_url" \
API_KEY="warehouse_api_key" \
go run conditional-update.go -itemname="Thing 3" -ship 1000
```

After a period, the address associated with the error notification will receive a notification. The body will contain information about the failed mutation. You can see the condition was not met. The difference between the requested quantity and on-hand was not greater than or equal to the 297 units available.

```json
{"mutation": "updateSelf_Inventory(id:\"017f64cc-9587-c0ad-6f07-39644846ee5c\",input: {lastUpdated: \"2022-03-07T12:13:56Z\", quantity: -703},condition: {quantity: {ge: 297}}){error}", "submission_time": "2022-03-07T17:13:56.815992+00:00", "id": "017f655f-9350-6de2-ffae-98dcba22cb0f", "owner": "Warehouse", "transactionId": "017f655f-9350-6de2-ffae-98dcba22cb0f", "status": "Failed", "submissionTime": "2022-03-07T17:13:56.815992+00:00"}
```

# Summary

Conditionals are a powerful way of ensuring only those operations that meet specified constraints can proceed.
