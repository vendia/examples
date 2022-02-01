<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# Node Access Controls
Node Access Controls authorize requests to a specific node's GraphQL API.  They can be thought of as the "coarse-grained" authorization to the GraphQL API.  They act as an enforcement point, permitting or denying every request.  Whether that authorization mechanism is direct (i.e. performed by Vendia Share) or indirect (i.e. delegated to another authorization service), the Node Access Controls are responsible for protecting unauthorized API access.

The GraphQL API that provides access to the serverless distributed ledger available on a node is protected by the Node Access Control configured when a node is created.  Each participant in a Uni can select a different authorization scheme, depending on their authorization preferences.

<figure>
  <img src="https://user-images.githubusercontent.com/85032783/151488925-b368c853-1064-4a69-861e-565bed98acc8.png" />
  <figcaption><b>Figure 1</b> - <i>Node Access Controls in the Vendia Share Data Plane</i></figcaption>
</figure>

Figure 1 depicts a two-node Uni, each with different [authorization settings](https://www.vendia.net/docs/share/node-access-control#api-access) configured.

In this example, you will interact with nodes protected by several available authorizer types.

## Pre-requisites
See [prerequisites](../README.md#prerequisites) for the `access-controls` examples.

## Install Dependencies
Install the dependencies for this module using `npm`.

```
npm install
```

## Creating a Uni using the Vendia Share CLI
In order to interact with nodes with differing `authorizerType` configurations, you must first create a multi-node Uni.

**Note:** Depending on your [Share pricing plan](https://www.vendia.net/pricing) you may need to delete your existing Unis before creating a new Uni to avoid hitting Uni or node limits.

### Update Your registration.json File
First, rename the `registration.json.sample` to `registration.json`.

You'll want to update the `name` for your Uni to be unique, but preserving the `test-` prefix.

You'll also want to update the `userId` of the `SupplierNode` and `DistributorNode` to reflect your personal Vendia Share `userId` (i.e. the email address you used to register) before creating the Uni.

### Create a Uni
Next, if not already logged in to the Vendia Share [Command Line Interface (CLI)](https://vendia.net/docs/share/cli), do so by executing the command below and providing your Vendia Share credentials when prompted.

```bash
share login
```

After that, you're ready to creat your Vendia Share Uni.

```bash
cd uni_configuration
share uni create --config registration.json
```

The Uni will take approximately 5 minutes to launch.  You can check its status in the Vendia Share [web application](https://share.vendia.net) or using the Share CLI.

```bash
share get --uni <your_uni_name>
```

**NOTE:** `<your_uni_name>` should match the value of the `name` in `registration.json`

## Interacting with the SupplierNode
The **SupplierNode** is configured with an `authorizerType` of `API_KEY`.  This means the Node Access Controls in place will confirm every inbound request to the node's GraphQL API contains a valid api key. Specifically, the api key must be contained in the `x-api-key` request header.

### Setting System Variables
To identify the values for the GraphQL API endpoint and corresponding api key, use this command:

```bash
share get --uni <your_uni_name>
```

Set the `API_URL` system property to the value contained in `DistributorNode.resources.graphqlApi.httpsUrl`

**On Mac or Linux**
```
export API_URL=<your_nodes_https_url>
```

**On Windows**
```
set API_URL=<your_nodes_https_url>
```

Set the `API_KEY` system property to the value contained in `DistributorNode.resources.graphqlApi.apiKey`

**On Mac or Linux**
```
export API_KEY=<your_nodes_api_key>
```

**On Windows**
```
set API_KEY=<your_nodes_api_key>
```

### Executing a GraphQL Client
Once the appropriate system variables are set, you can use the `listProducts.js` file to interact with the GraphQL API of the **SupplierNode**.  The `API_URL` and `API_KEY` values supplied as system variables will be sent to the **SupplierNode**.  The request will only be successful if the `x-api-key` request header matches the value expected.

```
npm run listProductsUsingApiKey
```

A successful call will produce output similar to the following.

<details>
<summary>Output</summary>

```
$ npm run listProductsUsingApiKey

> uni-access-controls@1.0.0 listProductsUsingApiKey
> node listProducts.js --authtype apikey

Calling listProducts with authtype apikey

Successfully called Share
Product
        ID:  00001
        Name:  Blue Corn Tortillas Chips
        Description:  Organic and delicious
        Price:  1.99
        Category:  natural
        Supplier:  Wild Harvest
Product
        ID:  00002
        Name:  Sheep's Milk Feta
        Description:  Imported from Greece
        Price:  2.19
        Category:  specialty
        Supplier:  MT Vikos
Product
        ID:  00003
        Name:  Raisin Bran Cereal
        Description:  Simple and healthful
        Price:  1.45
        Category:  conventional
        Supplier:  Essential Everyday
Product
        ID:  00004
        Name:  Sour Cream and Onion Chips
        Description:  So good!
        Price:  0.77
        Category:  conventional
        Supplier:  Essential Everyday
Product
        ID:  00005
        Name:  Organic Baby Spinach
        Description:  Pre-washed and ready to eat
        Price:  2.99
        Category:  natural
        Supplier:  Wild Harvest
Product
        ID:  00006
        Name:  Olive Spread
        Description:  Imported from Greece
        Price:  2.39
        Category:  specialty
        Supplier:  MT Vikos

```
</details>

To confirm the `API_KEY` authorizer works as expected, now unset the API_KEY system variable.

**On Mac or Linux**
```
export API_KEY=
```

**On Windows**
```
set API_KEY=
```

And retry the previous `npm` command

```
npm run listProductsUsingApiKey
```

The call will fail, as expected, because the request does not contain a valid api key.  The failure message will be similar to:

```
$ npm run listProductsUsingApiKey

> uni-access-controls@1.0.0 listProductsUsingApiKey
> node listProducts.js --authtype apikey

Calling listProducts with authtype apikey
Failed to call Share { message: 'Forbidden' }
```

## Interacting with the DistributorNode

The **DistributorNode** is configured with an `authorizerType` of `VENDIA_USER`.  This means the Node Access Controls in place will confirm every inbound request to the node's GraphQL API contains a valid [JSON Web Token](https://jwt.io/). Specifically, a JWT issued by Vendia Share must be contained in the `Authorization` request header.

### Setting System Variables
To identify the values for the GraphQL API endpoint, use this command:

```bash
share get --uni <your_uni_name>
```

Set the `API_URL` system property to the value contained in the `DistributorNode.resources.graphqlApi.httpsUrl`

**On Mac or Linux**
```
export API_URL=<your_nodes_https_url>
```

**On Windows**
```
set API_URL=<your_nodes_https_url>
```

**Note:** The `.share.env` in the `share-auth` directory already contains a valid Share JWT, which was created and stored during your prior authentication to Vendia Share.

### Executing a GraphQL Client
Once the appropriate system variable is set, you can use the `listProducts.js` file to interact with the GraphQL API of the **DistributorNode**.  The Share JWT will be sent to the **DistributorNode**.  The request will only be successful if the `Authorization` header contains a valid JWT issued by Vendia Share.

```
npm run listProductsUsingShareJwt
```

A successful call will produce output similar to the following.

<details>
<summary>Output</summary>

```

```
</details>

To confirm the `VENDIA_USER` authorizer works as expected, now delete the `.share.env` file.

```
rm ../share-auth/.share.env
```

And retry the client

```
npm run listProductsUsingShareJwt
```

The call will fail, as expected, because the request does not contain a valid JWT.  The failure message will be similar to:

```
$ npm run listProductsUsingShareJwt

> uni-access-controls@1.0.0 listProductsUsingApiKey
> node listProducts.js --authtype sharejwt

Calling listProducts with authtype sharejwt
Failed to call Share { message: 'Forbidden' }
```

## Summary

In this example you:

* Learned more about Vendia Share Node Access Controls
* Used the Share CLI to create a Uni with two nodes, each of which is protected by different Node Access Controls
* Used a Node.js GraphQL client to interact with each node in the Uni, providing different authorization tokens depending on the node's authorizer type configuration

