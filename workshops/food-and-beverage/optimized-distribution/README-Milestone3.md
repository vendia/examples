# Milestone 3 - Invite a Distributor to the Uni
The Uni you launched in Milestone 1 provides an easy for way the Supplier to add new products.  But what about the Distributor, who will issue purchase orders and coordinate deliveries? Your next milestone in this workshop is to add a new node to the Uni, allowing a new participant (the Distributor) to interface with the existing participant (the Supplier).

## Expand the Uni
Now that you have an initial listing of products, it's time to expand our Uni to include a Distributor.  The Distributor will then be able to issue purchase orders for the Supplier's products and schedule deliveries of those products.

### Invite a Participant
Starting from the Vendia Share [web application](https://share.vendia.net/):

* Select your Uni by name
* Click the `Invite participant` button in the upper-right section of the Uni details view
* Enter the email address you used to register with Vendia and click `Send uni invite`
  * **Note:** Using the same Vendia user account for both nodes in the Uni allows each workshop attendee to work independently.  Stay tuned for a more real-world scenario in Milestone 5.

### Accept the Invitation
Monitor your email for a Uni invitation.  Once received, click on the provided link to add a new node to your Uni.

* Complete the `Add a Node` form
  * **Node name** - Enter `DistributorNode`
  * **Cloud Service Provider** - Enter `AWS`.  For now, let's keep things simple.
  * **Node region** - Free choice.  Something that **isn't** `us-east-1` gives you a multi-region Uni that may help with resilience goals
* Click `Register Node` to add this new node to your existing Uni

Once you're back to the Uni detail view, you'll notice the status of the Uni has changed to `Adding node`.  This will last about 5 minutes, after which your multi-node, multi-region will be ready for use.

## Explore the New DistributorNode
Once the Uni is back to a `Running` status, you can use the new **DistributorNode**.

### Using the GraphQL Explorer

Open the `GraphQL Explorer` of the **DistributorNode**. Remove any existing content from the middle pane.  Copy and paste the query below and then execute the query.

```
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

You will see all available products, which should match what you saw earlier from the **SupplierNode**.  The one addition will be the product you added in Milestone 2.

### Using the Entity Explorer

Just like in the previous section, the `Entity Explorer` should look identical on the **DistributorNode** as it did on the **SupplierNode**.

* Open the `Entity Explorer` of the **DistributorNode**
* Select `Product` in the left navigation pane
  * The products displayed should be identical to those you saw in Milestones 1 and 2, and using the GraphQL Explorer in the previous section.
* Select the `Sheep's Milk Feta` product by clicking on its `_id` value
* Now click on `View history` for the item
  * The history should show multiple versions, based on the update you made in Milestone 2

### Using the File Explorer
Just like in the previous section, the `File Explorer` should look identical on the **DistributorNode** as it did on the **SupplierNode**.

* Open the `File Explorer` of the **DistributorNode**
* Confirm that both files `feta.pdf` and `chips.pdf` exist

Now attempt to update one of the files.  You should not be able to upload a new version because the `Write Strategy` specified on file upload stated that only the **SupplierNode** could make modifications to the files.

* From the `File Explorer` of the **DistributorNode**
* Click on the `...` link under the `Action` column of the `All Files` table
* You should not see the `Edit file` option, which is only available to the **SupplierNode**
  * **Note:** The inability to edit the files from teh **DistributorNode** is not just a user interface protection.  The GraphQL API of the **DistributorNode** will also reject any requests to modify the files.

## Key Takeaways
Congratulations.  You've successfully reached Milestone 3!

In this section you:

* Invited a new participant to your Uni 
* Accepted the invitation and created a second node on your Uni 
* Confirmed by way of the GraphQL Explorer, Entity Explorer, and File Explorer that the new **DistributorNode** contains the same data as the **SupplierNode**

Now that you have a Distributor that can transact in real-time with a Supplier, it's time to move on to [Milestone 4](README-Milestone4.md).
