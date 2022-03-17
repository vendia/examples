# Vendia Share Demo - Easily Create a Multi-Party Product Catalog

[Vendia Share](https://www.vendia.net) is the real-time data cloud for rapidly building applications that securely share data across departments, companies, clouds, and regions.  

## Demo Overview

* __Level__
    * Basic
* __Highlighted Features__
    * Uni Creation
    * GraphQL Explorer
    * Entity Explorer

This demo highlights the ease of creating a multi-party data sharing solution, using the Vendia Share platform, as applied to the Food Services industry. 

## Demo Context
Specifically, this demo explores a food Supplier who uses Vendia Share to share product changes with Distributors in real-time.  Prior to using Vendia Share, the Supplier and Distributor often struggled to maintain a consistent, shared source of truth.   Since adopting Vendia Share, they dramatically decreased the time and resource spent on data reconciliation between their isolated product databases, streamlined their product ordering processes, decreased food waste (e.g. misunderstanding of purchase orders and delivery timelines), and improved their grocer satisfaction scores.

## Demo Pre-Requisites

* [Vendia Share Account](https://share.vendia.net/signup)

__NOTE:__ The remaining pre-reqs are optional and only required if you want to use the Programmatic steps of this demo.  If you prefer to use the Share web app exclusively, you can move on to the next section.

To complete the Programmatic steps of this demo, you'll need the following:

* [Git Client](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [Vendia Share CLI](https://vendia.net/docs/share/cli)

In addition, you'll also need to clone this repository.

<details>
<summary>Instructions for cloning the repository</summary>

### Clone with SSH

```bash
git clone git@github.com:vendia/examples.git
```

### Clone with HTTPS

```bash
git clone https://github.com/vendia/examples.git
```

</details>

## Step 1 - Create a Multi-Party Uni
To create a Uni, you can use either the [Share Web Application](https://share.vendia.net) or the [Share CLI]((https://vendia.net/docs/share/cli).

### Create a Uni using the Share Web Application
To create a Uni using the Share Web Application:

1. Click the `+ Create Universal Application` button
1. Select the `Create your own` option
1. Enter a unique name, prefixed with `test-`, and then click `Next`
1. Define an `SupplierNode` and a `DistributorNode`
    1. Feel free to vary the `Node region` but leave the other defaults the same
1. Click the checkbox on each node definition and then click `Next`
1. Copy the contents of [schema.json](uni_configuration/schema.json) into the `Uni Schema` text area
    1. Be sure to remove all existing content prior to copying in the new content
1. Scroll to the bottom of the page an expand the `Initial State` section
1. Copy the contents of [initial-state.json](uni_configuration/initial-state.json) into the `Inital State` text area
1. Click `Create`

Wait about 5 minutes for the Uni to reach a `Running` state.

### Create a Uni Programmatically
To create a Uni using the Share CLI:

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

## Step 2 - Explore the Uni
Using the Share Web App, explore the Uni and its nodes in more detail.

### Uni Views
Select a Uni by name from the Uni listing to view Uni details.  These views are accessible directly under the Uni's name from the Uni details view.

* __Partner Nodes__ - A list of all partner nodes.  In this demo, there are none as you're acting on behalf of both participants.
* __Schema__ - The schema for the Uni, which is identical to [schema.json](uni_configuration/schema.json)
* __Transactions__ - All transactions of the Uni, and their corresponding block in the distributed ledger
* __Uni Settings__ - Participant listing and Uni management functions

### Node Configuration Views
Click the `Manage node` button to view node details.  These views are accessible using the left menu of the Node details view.

* __Resources__ - All underlying cloud resources for the node
* __Success Notifications__ - Integrations used to notify when a successful transaction occurs in the Uni
* __Error Notifications__ - Integrations used to notify when a failed transaction occurs on the Node
* __Ingress__ - Management of inbound, asynchronous processing channels

### Node Views
* __Entity Explorer__ - A visual tool for exploring and changing the scalar contents of the node
* __GraphQL Explorer__ - A GraphQL-centric tool for exploring and changing the contents of the node
* __File Explorer__ - A visual tool for exploring and changing the file contents of the node
* __Smart Contracts__ -  A tool for managing the Smart Contracts of the node

## Step 3 - Explore the Pre-Loaded Data of the Uni
The `initial-state.json` file referenced in Step 1 was used to seed the Uni with data.  Creating a Uni based on an initial, known set of data can simplify development and testing.

You can now explore that data using several of the Node Views mentioned in the last step.

### Explore Data using Entity Explorer
You can view data using the Entity Explorer view from either node in the Uni.

1. Click `Entity Explorer` on either node
1. View all `Product` items
    1. Columns allow sorting
    1. Clicking on an `_id` value shows a detailed view of the `Product`
    1. Clicking on `View history` from the detailed view shows all version of the `Product` over time
    
### Explore Data using GraphQL Explorer
You can view data using the GraphQL Explorer view from either node in the Uni.

1. Click `GraphQL Explorer` on either node
1. List all `Product` items
    ```graphql
   query listProducts {
      list_ProductItems {
         _ProductItems {
            _id
            _owner
            category
            description
            name
            price
            sku
            supplier
            promotionalContent
         }
      }
   }
    ```

1. Filter `Product` items by `supplier`
    ```graphql
    query listProducts {
      list_ProductItems(filter: {supplier: {eq: "Wild Harvest"}}) {
         _ProductItems {
            name
            description
            price
         }
      }
   }
    ```

## Step 4 - Add a Product
You can also add new data to the Uni using either the Entity Explorer or GraphQL Explorer.

### Add Data using Entity Explorer
You can add data using the Entity Explorer view from either node in the Uni.

1. Click `Entity Explorer` on either node
1. Click `Product` on the left-most pane
1. Click `+ Create Product`
1. Create a new product by completing this form
   1. `sku` - `00007` 
   1. `name` - `Apple Juice`
   1. `description` - `100% Juice`
   1. `price` - `0.99`
   1. `supplier` - `Essential Everyday`
   1. `category` - `conventional`
1. Click `Save`
1. Wait for the indicator in the bottom-right to provide confirmation
1. View the new `Product` in the table

### Add Data using GraphQL Explorer
You can add data using the GraphQL Explorer view from either node in the Uni.

1. Click `GraphQL Explorer` on either node
1. Add a `Product` item using the mutation below
   ```graphql
   mutation AddProduct {
     add_Product(
      input: {category: natural, description: "Organic", name: "Orange Juice", price: 3.99, sku: "00008", supplier: "Wild Harvest"}, syncMode: ASYNC) {
        transaction {
            transactionId
         }
      }
   }   
   ```
1. Confirm the `Product` item is included in the list of all items
    ```graphql
    query listProducts {
      list_ProductItems {
         _ProductItems {
            _id
            _owner
            category
            description
            name
            price
            sku
            supplier
            promotionalContent
         }
      }
   }
    ```

## Step 5 - Update a Product Record
You can update existing data using either the Entity Explorer or GraphQL Explorer.

### Update Data using Entity Explorer
You can update data using the Entity Explorer view from either node in the Uni.

1. Click `Entity Explorer` on either node
1. Click `Product` on the left-most pane
1. Select one of the records by clicking its `_id` value
1. Modify the `price` value and click `Save`
1. Once the indicator in the bottom-right confirms the save, click the `View history` button
1. Review the changes between the two versions of this record

### Update Data using GraphQL Explorer
You can update data using the GraphQL Explorer view from either node in the Uni.

1. Click `GraphQL Explorer` on either node
1. List all `Product` records
    ```graphql
    query listProducts {
      list_ProductItems {
         _ProductItems {
            _id
            _owner
            category
            description
            name
            price
            sku
            supplier
            promotionalContent
         }
      }
   }
    ```
1. Copy the `_id` value of one of the records - this is the record your will modify in the next step
1. Execute this mutation to modify the `price` of the `Product` record identified in the previous step.
    1. __NOTE__: The `id` value in the mutation below should be modified to reflect the `id` value you copied in the previous step.
    
   ```graphql
   mutation UpdateProduct {
     update_Product(
      id: "017f273f-6f69-4adb-e73a-a140b3ccc28f"
      input: {price: 3.49}, syncMode: ASYNC) {
         transaction {
            transactionId
         }
      }
   }
   ```
   
1. Confirm the update `Product` record is reflected in the list of all items
     ```graphql
     query listProducts {
      list_ProductItems {
         _ProductItems {
            _id
            _owner
            category
            description
            name
            price
            sku
            supplier
            promotionalContent
         }
      }
   }
     ```
## Demo Conclusion
Through these simple steps, you explored the basics of Vendia Share.  

For more advanced features, please explore additional [demos](../../../demos).
