# Vendia Share Demo - Multi-Party Product, Ordering, and Delivery

[Vendia Share](https://www.vendia.net) is the real-time data cloud for rapidly building applications that securely share data across departments, companies, clouds, and regions.  

## Demo Overview

* __Level__
    * Intermediate
* __Highlighted Features__
    * Enhancing Schema with ACLs
    * Fine-Grained Data Access Controls

This demo highlights the purpose and ease of creating data access controls for multi-party data sharing solutions, using the Vendia Share platform, as applied to the Food Services industry. 

## Demo Context
Specifically, this demo explores a Supplier and a Distributor who use Vendia Share to exchange real-time product, purchase order, and delivery information.  Prior to using Vendia Share, the Supplier and Distributor often struggled to maintain a consistent, shared source of truth.   Since adopting Vendia Share, they dramatically decreased the time and resource spent on data reconciliation between their isolated product databases, streamlined their product ordering processes, decreased food waste (e.g. misunderstanding of purchase orders and delivery timelines), and improved their grocer satisfaction scores.

## Demo Pre-Requisites
This demo heavily uses the Share CLI and the GraphQL Explorer so all pre-reqs listed are required.

* [Vendia Share Account](https://share.vendia.net/signup)
* [Git Client](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [Vendia Share CLI](https://vendia.net/docs/share/cli)

In addition, you'll also need to clone this respository.

## Step 1 - Create a Multi-Party Uni
To create a Uni using the [Share CLI]((https://vendia.net/docs/share/cli).

1. Change directories to `uni_configuration`
    1. `cd uni_configuration`
1. Create your own copy of the `registration.json.sample` file, removing the `.sample` suffix
    1. `cp registration.json.sample registration.json`
1. Edit the `registration.json` file changing
    1. `name` - keep the `test-` prefix but make the remainder of the name unique
    1. `userId` - on both nodes should match your Vendia Share `userId` (i.e. your email address)
1. Create the Uni
    1. `share uni create --config registration.json`

Wait about 5 minutes for the Uni to reach a `Running` state.

## Step 2 - Add Products as the Supplier
To make products available to the Distributor, the Supplier must first add them to the Uni.

### Add Products as the Supplier
As the Supplier, add several Product records to the Uni, each with Access Control List (ACL) information that defines the read and write access to the data from other nodes.

1. Open the GraphQL Explorer of the __SupplierNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [products.gql](resources/products.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __SupplierNode__

### Confirm Products as the Supplier
You can confirm the existence of the newly added Products by executing this GraphQL query from the GraphQL Explorer of the __SupplierNode__

```
query ListProducts {
  list_ProductItems {
    _ProductItems {
      ... on Self_Product {
        _id
        _owner
        sku
        name
        description
        price
        margin
        supplier
        category
      }
      ... on Self_Product_Partial_ {
        _id
        _owner
        sku
        name
        description
        price
        margin
        supplier
        category
      }
    }
  }
}
```

Notice that all fields listed are populated in the response.

### Confirm Products as the Distributor
You can also confirm the existence of the newly added Products by executing this GraphQL query from the GraphQL Explorer of the __DistributorNode__

```
query ListProducts {
  list_ProductItems {
    _ProductItems {
      ... on Self_Product {
        _id
        _owner
        sku
        name
        description
        price
        margin
        supplier
        category
      }
      ... on Self_Product_Partial_ {
        _id
        _owner
        sku
        name
        description
        price
        margin
        supplier
        category
      }
    }
  }
}
```

Notice that all fields listed are populated in the response, except for `margin`.  The ACL appended to each product mutation prevents the __DistributorNode__ from viewing the value of `margin`.

### Attempt to Change Product as the Distributor
As the Distributor, attempt to modify a Product.  

1. Open the Entity Explorer view from the __DistributorNode__
1. Select one of the Products by clicking on its `_id` value
1. Click the `Edit` button
1. Modify a value (for example, `price`)
1. Click the `Save` button

You will receive an `Unauthorized` error message, as the ACL appended to each product mutation prevents the __DistributorNode__ from modifying Product fields.

## Step 3 - Make Purchase Orders as the Distributor
The Distributor can now issue Purchase Orders, referencing the Supplier's list of products.

### Add Purchase Orders as the Distributor
As the Distributor, add several Product Orders to the Uni, each with Access Control List (ACL) information that defines the read and write access to the data from other nodes.

1. Open the GraphQL Explorer of the __DistributorNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [purchase_orders.gql](resources/purchase_orders.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __DistributorNode__

### Confirm Purchase Orders as the Distributor
You can confirm the existence of the newly added Purchase Orders by executing this GraphQL query from the GraphQL Explorer of the __DistributorNode__

```graphql
query ListPurchaseOrders {
  list_PurchaseOrderItems {
    _PurchaseOrderItems {
      ... on Self_PurchaseOrder {
         _id
         _owner
         sku
         quantity
         totalPrice
         dateIssued
         status
      }
      ... on Self_PurchaseOrder_Partial_ {
        _id
         _owner
         sku
         quantity
         totalPrice
         dateIssued
         status
      }
    }
  }
}

```

### Confirm Purchase Orders as the Supplier
You can confirm the existence of the newly added Purchase Orders by executing this GraphQL query from the GraphQL Explorer of the __SupplierNode__

```graphql
query ListPurchaseOrders {
  list_PurchaseOrderItems {
    _PurchaseOrderItems {
      ... on Self_PurchaseOrder {
         _id
         _owner
         sku
         quantity
         totalPrice
         dateIssued
         status
      }
      ... on Self_PurchaseOrder_Partial_ {
        _id
         _owner
         sku
         quantity
         totalPrice
         dateIssued
         status
      }
    }
  }
}

```

__NOTE:__ Copy the `_id` values of all Purchase Orders for the next section.

### Attempt to Change Purchase Order as the Supplier
As the Supplier, attempt to modify a Purchase Order.

1. Open the Entity Explorer view from the __SupplierNode__
1. Select one of the Products by clicking on its `_id` value
1. Click the `Edit` button
1. Modify a value (for example, `totalPrice`)
   1. __NOTE:__ Do not modify the `status` field (for now, that's the next step)
1. Click the `Save` button

You will receive an `Unauthorized` error message, as the ACL appended to each product mutation prevents the __SupplierNode__ from modifying Purchase Order fields.

## Step 4 - Confirm Purchase Orders and Scheduled Deliveries as the Supplier
The Supplier can now confirm the Purchase Orders and schedule a Delivery to fulfill the Purchase Order.

### Confirm Purchase Orders as the Supplier
As the Supplier, attempt to modify a Purchase Order.

1. Open the Entity Explorer view from the __SupplierNode__
1. Select a Purchase Order by clicking on its `_id` value
1. Click the `Edit` button
1. Modify the `status`, changing it from `submitted` to `confirmed`
   1. We won't be rejecting any Purchase Orders today
1. Click the `Save` button

You will receive a success message, as the ACL appended to each product mutation allow the __SupplierNode__ to modify a Purchase Order's `status`.

Repeat the changes for all Purchase Orders.

### Add Delivery as the Supplier
As the Supplier, add a Delivery to the Uni, each with Access Control List (ACL) information that defines the read and write access to the data from other nodes.

1. Open the GraphQL Explorer of the __SupplierNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [deliveries.gql](resources/deliveries.gql) into the GraphQL Editor
   1. Modify the `purchaseOrderId` values in the mutation to reflect the `_id` values copied in the previous section
1. Click the `>` button to submit the request to the __SupplierNode__

### Confirm Delivery as the Supplier
You can confirm the existence of the newly added Delivery by executing this GraphQL query from the GraphQL Explorer of the __SupplierNode__

   ```graphql
   query ListDeliveries {
     list_DeliveryItems {
       _DeliveryItems {
         ... on Self_Delivery {
           _id
           _owner
           actualDateTime
           expectedDateTime
           purchaseOrders {
             purchaseOrderId
           }
           status
         }
         ... on Self_Delivery_Partial_ {
           _id
           _owner
           actualDateTime
           expectedDateTime
           purchaseOrders {
             purchaseOrderId
           }
           status
         }
       }
     }
   }
   
   ```

### Confirm Delivery as the Distributor
You can confirm the existence of the newly added Delivery by executing this GraphQL query from the GraphQL Explorer of the __DistributorNode__

  ```graphql
   query ListDeliveries {
     list_DeliveryItems {
       _DeliveryItems {
         ... on Self_Delivery {
           _id
           _owner
           actualDateTime
           expectedDateTime
           purchaseOrders {
             purchaseOrderId
           }
           status
         }
         ... on Self_Delivery_Partial_ {
           _id
           _owner
           actualDateTime
           expectedDateTime
           purchaseOrders {
             purchaseOrderId
           }
           status
         }
       }
     }
   }
   
   ```

### Attempt to Change Delivery as the Distributor
As the Supplier, attempt to modify a Delivery.

1. Open the Entity Explorer view from the __DistributorNode__
1. Select one of the Products by clicking on its `_id` value
1. Click the `Edit` button
1. Modify a value (for example, `expectedDateTime`)
1. Click the `Save` button

You will receive an `Unauthorized` error message, as the ACL appended to each product mutation prevents the __DistributorNode__ from modifying Delivery fields.

## Demo Conclusion
Through these simple steps, you explored Vendia Share's fine-grained data access controls.  

For more features, please explore additional [demos](../../../demos).
