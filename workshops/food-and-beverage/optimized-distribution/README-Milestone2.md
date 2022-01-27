# Milestone 2 - Add and Update the Product Inventory
The GraphQL API you explored in Milestone 1 makes web and mobile app development on top of Vendia Share extremely simple.  Your second milestone in this workshop is to use the [Vendia Share web application](https://share.vendia.net) to build up the Supplier's product inventory.

## Using Entity Explorer
The Entity Explorer view of the Vendia Share web application is one of several views we'll use in this section of the workshop.  It is used to directly manage the data stored in Vendia Share.

### Add a Product
The Uni created in Milestone 1 included some initial products.  Let's add another using the Entity Explorer.

* Open the `Entity Explorer` of the **SupplierNode**
* Select `Product` in the left navigation pane
  * The products displayed should be identical to those you saw in Milestone 1 using the GraphQL Explorer and should also be identical to the data you reviewed in `initial-state.json`
* Select `+ Create Product` in the upper right corner of the product listing
* Create a new product by completing this form
  * **sku** - Enter `00007` to maintain our previous product sku sequence
    * In a real-world situation, the sku values would likely come from another source and be referenced by the product
  * **name** - Enter `Apple Juice`, or something clever
  * **description** - Enter `100% Juice`, or something clever
  * **price** - Enter `0.99`, or another numeric value
  * **supplier** - Enter `Essential Everyday` for consistency with other products
  * **category** - Select `conventional`
    * The drop-down provided is thanks to the `enum` we defined in our `schema.json` file
* Click `Save`
  * You'll see a status message indicating the product was successfully saved

**Note:** While we're using the Vendia Share web app in this section, we could just as easily have used a custom web application.  Building a new web application is quick and easy thanks to Vendia Share's auto-generated API Gateway, GraphQL API, and storage layer.

### Update a Product
One of the benefits of Vendia Share's decentralized ledger capability is the ability to see history for an item, in this case a product, over time.  Share not only allows updates to a product, but it provides a complete history of _all_ updates to a product for its lifetime.

* From the `Entity Explorer` view of the **SupplierNode**
* Select the `Sheep's Milk Feta` product by clicking on its `_id` value
* Click the `Edit` button to view the product's current values
* Modify the price to another value (let's say there's been a run on feta and the price just spiked)
* Click `Save` to confirm the price adjustment
* Wait for the confirmation that the update has been applied
* Now click on `View history` for the item
* You'll see the `Sheep's Milk Feta` history includes two versions - the original and our just-updated version
  * There's a much richer set of data available through the Share GraphQL API, which allows you to see the blocks and transactions of the ledger.  The Entity Explorer interface exposes just a small subset of what's available.

## Add Promotional Content
The File Explorer view of the Vendia Share web application is a view tailored to file management.  There are times when a Uni participant, say the Supplier in our scenario, wants to manage both data and files in a single Uni.

### Upload Files
So far you haven't populated the `promotionalContent` field of a product.  The intent of that field is to capture a reference to some form of promotional product material.

You will now upload some promotional material using the File Explorer.

* From the `File Explorer` of the **SupplierNode**
* Click on the `+ Upload file` button in the upper-right of the `All Files` view
* Select the `chips.pdf` from the `product_material` folder
  * **Copy strategy** - Select `Always`
  * **Read Access** - Select `All`
  * **Write Strategy** - Select `SupplierNode` only
    * This prevents a Distributor from inadvertently updating the file
* Click on the `Create` button to upload the file
* Now repeat the steps above for the `feta.pdf` file from the `product_material` folder

Just like transactional data, a file is versioned and its full history is preserved on the Share ledger.

### Associate Files with Products
You can now reference the file path in the `promotionalContent` field of each product.

* From the `Entity Explorer` view of the **SupplierNode**
* Update the `Sheep's Milk Feta` product, setting `promotionalContent` to `feta.pdf`
* Update the `Blue Corn Tortillas Chips` product, setting `promotionalContent` to `chips.pdf`

The association made allows, for example, an application capable of displaying file content to retrieve both the product data and promotional file from the same Vendia Share GraphQL interface.

### Review Purchase Orders and Deliveries
From the `Enity Explorer` you can also click on the `PurchaseOrder` and `Delivery` items in the left pane.  These lists will be sparse for now - you haven't connected a Distributor to create those items yet.

## Key Takeaways
Congratulations.  You've successfully reached Milestone 2!

In this section you:

* Used the Entity Explorer to add a product and update a product
* Viewed complete product history for an updated product 
* Uploaded files using the File Explorer, limiting write access to only the **SupplierNode**

Next up, [Milestone 3](README-Milestone3.md).
