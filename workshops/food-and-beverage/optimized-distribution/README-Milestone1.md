# Milestone 1 - Create a Supplier-Only Uni
Your first milestone in this workshop is to create a new [Universal Application](https://www.vendia.net/docs/share/dev-and-use-unis).

## Explore the /uni_configuration directory
The `/uni_configuration` directory contains several pre-created files that will help you quickly create a new Uni.  Review the contents of each of these files to get a better understanding of their contents.

* __schema.json__ - Specifies the data model for this Uni
* __initial-state.json__ - Seeds the Uni with some initial data
* __sample.registration.json__ - Contains cloud, region, and account information for this Uni

## Create Your First Uni
Now it's time to create a Uni using the files from the previous section.

### Update Your registration.json File
First, rename the `sample.registration.json` to `registration.json`.  

You'll want to update the `name` for your Uni to be unique, but preserving the `test-` prefix.  By default, all Unis share a common namespace (`vendia.net`) so try your best to avoid naming collisions - here is your chance to get creative!

You'll also want to update the `userId` of the `SupplierNode` to reflect your personal Vendia Share `userId` (i.e. the email address you used to register) before creating the Uni.

### Create the Uni
Next, if not already logged in to the Vendia Share [Command Line Interface (CLI)](https://vendia.net/docs/share/cli), do so by executing the command below and providing your Vendia Share credentials when prompted.

```bash
share login
```

After that, you're ready to creat your first Vendia Share Uni.

```bash
cd uni_configuration
share uni create --config registration.json
```

The Uni will take approximately 5 minutes to launch.  You can check its status in the Vendia Share [web application](https://share.vendia.net) or using the Share CLI.

```bash
share get --uni <your_uni_name>
```

**NOTE:** `<your_uni_name>` should match the value of the `name` in `registration.json`

### Explore the Uni and Its Initial Data
Once the Uni is ready, explore its content using the Vendia Share [web application](https://share.vendia.net/).  The Uni has a single node, the **SupplierNode**.  The Share web app provides a number views to explore the node in more detail.

#### GraphQL Explorer
The GraphQL Explorer can be used to interact with the data stored by Vendia Share.  It can serve as a helpful tool if you're newer to GraphQL and want to experiment with forming queries, mutations, and subscriptions as you develop an application powered by Vendia Share.

Here are a few examples to help you get started.  Feel free to build your own queries but please refrain from updating the data for now (i.e. no mutations just yet).

Open the `GraphQL Explorer` of the **SupplierNode**. Remove any existing content from the middle pane.  Copy and paste the query below and then execute the query.

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

You will see all available products, which were returned by the GraphQL interface of the **SupplierNode**.

A GraphQL interface provides [many benefits](https://www.vendia.net/blog/why-we-combined-graphql-and-a-serverless-distributed-ledger) to those interacting with a Vendia Share node.  By allowing a caller to dictate the fields to be returned, along with optional filters and limits, you're able to get to exactly the data you want.  This can be especially helpful as you create a new web or mobile application powered by Vendia Share, as you can tailor the data retrieved to exactly match the data needed for a component or view.

Here's a refined query that only returns the `name`, `description`, and `price` of all products supplied by `Wild Harvest`.

```
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

## Key Takeaways
Congratulations.  You've successfully reached Milestone 1!

In this section you:

* Learned more about Vendia Share's schema-first approach and the necessary files it comprises
* Saw the ease of creating a Universal Application, all in about 5 minutes
* Used Vendia Share's Entity Explorer to visual initial seed data for the Uni
* Interacted with a powerful and auto-generated GraphQL API, with the help of Share's GraphQL Explorer

Now on to [Milestone 2](README-Milestone2.md).