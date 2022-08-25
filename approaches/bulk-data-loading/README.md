<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Bulk Data Loading
In cases where a Vendia Share [Universal Application](https://www.vendia.net/product#universal-apps) (Uni) integrates with or replaces an existing operational system, it's often necessary to load the Uni with a substantial amount of historical data.  Historical data often takes many forms, but one common form is a single, large Comma Separated Value (CSV) file.

This example assumes a Retailer wants an existing Inventory loaded as quickly and simply as possible.  It demonstrates how to generate and load a large data file into Vendia Share, using several techniques:

* **Generating Inventory Records into a Large CSV File** - Not Vendia Share specific, but it's helpful to start from a known CSV file format 
* **Extracting Inventory Records from a Large CSV File** - Taking the large CSV file and batching its contents
* **Forming Batched GQL Mutations** - Creating a [GraphQL mutation](https://graphql.org/learn/queries/#mutations) for every record in the CSV file, and combining multiple operations into a single GQL mutation
* **Concurrently Executing HTTP Requests** - Invoking Vendia Share's GQL API concurrently, resulting in multiple HTTP requests, each containing multiple GQL mutations per request

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
You'll next want to create an API Key to use to access the **Retailer** node of your Uni.

This Share CLI command can be used to create an API Key (replace the `<your_uni_name>` value, and feel free to modify the other parameter values as well).

```bash
share node add-api-key --uni <your_uni_name> --node "Retailer" --name "bulk-load-key" --expiry "2030-01-01"
```

Make sure to save the API Key value returned, as you'll need it in the next step.

## Step 3 - Create a `.share.env` file
You'll then want to store the API Key from the previous step and the GraphQL URL for the **Retailer** node in a configuration file, which is used in subsequent steps.

1. Change directories to `src`
    1. `cd ../src`
1. Create a `.share.env` file
    1. `echo -e "GQL_URL=\nGQL_APIKEY=\n" >> .share.env`
1. Copy the API Key value from the previous step into `.share.env`'s `GQL_APIKEY=` property
1. Copy the GraphQL URL for the **Retailer** node into `.share.env`'s `GQL_URL=` property
    1. `share get --uni <your_uni_name>`

## Step 4 - Generate Data to Load
With your Uni running, an API Key provisioned, and a `.share.env` file in place, you're ready to create a data set to load into Vendia Share.

The [package.json](src/package.json) file contains a script that can be used to generate data that matches the Uni's schema.  The end result will be an Inventory, in CSV form, stored in a file under the `data` directory of this project.

```bash
npm run generateData
```

The values in [Constants.js](src/Constants.js) can be tuned to tune, for example, the `inventoryRecordSize` that will be generated using the command above.

## Step 4 - Execute the Data Loader
With generated data in place, you're ready to load that data set into Vendia Share.

The [package.json](src/package.json) file also contains a script that can be used to load data that matches the Uni's schema.  The end result will be a Uni populated with the Inventory generated in the previous step.

```bash
npm run loadData
```

The values in [Constants.js](src/Constants.js) can be tuned to tune, for example, the `batchSize` and `clientConcurrency` that will be used when loading the data.

## Conclusion
This example demonstrates how a large CSV file can be used as a starting point for bulk data loading a Vendia Share Uni.  The techniques applied - parsing large files, batching records, combining multiple mutations into a single GQL operation, and executing multiple HTTP requests concurrently - can be used together to replicate this same approach with a Uni and data model of your choosing.
