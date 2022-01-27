# Milestone 4 - Collaborate using a Shared Source of Truth
In this section, you will act as both the Supplier and the Distributor as you collaborate on the shared Uni created in Milestone 3.

## Collaborate Using the GraphQL Explorer
Each node in a Vendia Share Uni has its own GraphQL endpoint.  The GraphQL Explorer of each node is configured to talk to its respective node's custom GraphQL endpoint, which we'll target in this section.

### Issue Purchase Orders from the DistributorNode
The Distributor is now ready and able to submit purchase orders and schedule deliveries.

You will now create a purchase order using the GraphQL Explorer.

* Open the `GraphQL Explorer` of the **DistributorNode**. Remove any existing content from the middle pane.
* Copy and paste the mutation below and then execute the mutation to create a new purchase order

```
mutation createPurchaseOrder {
  add_PurchaseOrder_async(input: {dateIssued: "2022-01-26", quantity: "100", sku: "00001", totalPrice: 199}) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
    error
  }
}
```

* For good measure, create one more purchase order

```
mutation createPurchaseOrder {
  add_PurchaseOrder_async(input: {dateIssued: "2022-01-26", quantity: "40", sku: "00004", totalPrice: 30.8}) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
    error
  }
}

```

### Schedule a Delivery from the SupplierNode
After the Distributor submits purchase orders, the Supplier must respond with delivery information.

You will now create a delivery that references the recently submitted purchase orders

* Open the `GraphQL Explorer` of the **SupplierNode**. Remove any existing content from the middle pane.

* Copy and paste the query below and then execute it to see all purchase orders

```
query listPurchaseOrders {
  list_PurchaseOrderItems {
    _PurchaseOrderItems {
      _id
      _owner
      dateIssued
      quantity
      sku
      totalPrice
    }
  }
}
```

**Note:** Copy the `_id` of each purchase order, as you'll reference those values in the next step

* Copy and paste the mutation below and then execute the mutation to create a delivery that will fulfill the purchase orders
    * Replace the `purchaseOrderId` placeholder values below with the `_id` values of the purchase orders listed in the previous step.  This associates the purchase orders and the scheduled delivery.

```
mutation scheduleDelivery {
  add_Delivery_async(input: {status: scheduled, expectedDateTime: "2022-01-28T12:00:00Z", purchaseOrders: [{purchaseOrderId: "017e9989-52dd-eaa0-7c58-43a39bfc8b9d"}, {purchaseOrderId: "017e994e-c2a3-0bac-cd67-d23d6af22680"}]}) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
    error
  }
}
```

## Collaborate Using the Entity Explorer
The Supplier may need to change the expected date of an upcoming delivery.

### Changing an Expected Delivery
* Open the `Entity Explorer` of the **SupplierNode**
* Select `Delivery` in the left navigation pane
    * The sole delivery shown should be identical to the one you submitted in the previous section
* Select the delivery by clicking on its `_id` value
* Click on the `Edit` button
* Modify the `expectedDateTime` to be later today
* Save the changes

## Key Takeaways
Congratulations.  You've successfully reached Milestone 4!

In this section you:

* Created purchase orders, as a Distributor would, using the **DistributorNode**'s GraphQL Explorer
* Created a delivery to fulfill the purchase orders, as a Supplier would, using the **SupplierNode**'s GraphQL Explorer
* Updated the expected delivery date, as a Supplier would, using the **SupplierNode**'s Entity Explorer

The Distributor is waiting for a notification that the Supplier shipped the order. Onward to [Milestone 5](README-Milestone5.md).
