<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Bulk Data Loading
In cases where a Vendia Share [Universal Application](https://www.vendia.net/product#universal-apps) (Uni) integrates with or replaces an existing operational system, it's often necessary to load the Uni with a substantial amount of historical data.  Historical data often takes many forms, but one common form is a single, very large Comma Separated Value (CSV) file.

This example demonstrates how to load a large data set into Vendia Share, using several techniques:

* **Extracting Records from a Large CSV File** - Working with a small subset of a very large CSV file 
* **Batching GQL Mutations** - Creating a [GraphQL mutation](https://graphql.org/learn/queries/#mutations) for every record in the CSV file, and combining multiple GQL mutations into a single HTTP request
* **Concurrently Executing GQL Requests** - Invoking Vendia Share's GQL API concurrently, resulting in multiple HTTP requests each containing multiple GQL mutations

These techniques can be applied individually or combined to address the challenge of loading a large data set into Vendia Share.  

## Step 0 - Prerequisites
This example requires a minimal set of dependencies.  Before getting started with this example, you'll first need to:

* Create a [Vendia Share account](https://share.vendia.net/)
* Install the Vendia Share [Command Line Interface (CLI)](https://www.vendia.net/docs/share/cli)
* Install [Git Client](https://git-scm.com/downloads)
* Install [Node.js](https://nodejs.org/en/download/)

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

## Step 1 - Create a Universal Application
You'll first want to create a Uni to which data can be loaded. 

This example makes use of a Uni that models an Inventory.  Imagine a large Retailer whose Inventory management system is being migrated to Vendia Share.  Before this system is ready for production, you'll want to load the Uni with _all_ current and historical Inventory data.

To create a Uni using the Share CLI:

1. Change directories to `uni_configuration`
    1. `cd uni_configuration`
1. Create your own copy of the `registration.json.sample` file, removing the `.sample` suffix
    1. `cp registration.json.sample registration.json`
1. Edit the `registration.json` file changing
    1. `name` - keep the `test-` prefix but make the remainder of the name unique. And for enterprise customers, make sure to add the applicable namespace `unis.<yourdomain>.<yoursuffix>`.
    1. `userId` - on both nodes should match your Vendia Share `userId` (i.e. your email address)
1. Create the Uni
    1. `share uni create --config registration.json`

Wait about 5 minutes for the Uni to reach a `Running` state.

## Step 2 - Create an API Key


## Step 3 - Examine the Data Loader Source Code


## Step 4 - Execute the Data Loader
