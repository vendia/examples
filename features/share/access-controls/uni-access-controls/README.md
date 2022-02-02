<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# Uni Access Controls
Uni access controls protect the Uni management operations provided by Vendia Share.  This prevents unauthorized access to user management functions and enables features like self-service user management within an organization.

Authorization to specific Uni management operations is granted through a [Role Based Access Control (RBAC) mechanism](https://www.vendia.net/docs/share/rbac) mechanism, very similar to the RBAC mechanism that protects [user controls](../user-access-controls/README.md).

## Key Terminology
* **Action** - the right to call one or more of Share's Uni management operations
* **Resource** - the Uni or node against which an Action can be performed
* **Capability** - a mapping of Action to Resource, linking the "right to call" (an operation) with the "right to manage" (a Uni or node)
* **Role** - a named collection of Capabilities and used to determine if a Uni management operation is authorized

<figure>
  <img src="https://user-images.githubusercontent.com/85032783/151488926-9a5e17fc-0ae0-4687-816c-3c70724c6bf3.png" />
  <figcaption><b>Figure 1</b> - <i>Uni Controls in the Vendia Share Control Plane
</i></figcaption>
</figure>

With that additional context on Vendia Share Uni access controls, you will now examine the RBAC configuration for your Vendia Share user and the Unis you can manage.

## Pre-requisites
See [prerequisites](../README.md#prerequisites) for the `access-controls` examples.

## Install Dependencies
Install the dependencies for this module using `npm`.

```
npm install
```

## Managing Uni Access Controls using the Vendia Share CLI

### Examine the Default Role of Your Vendia Share User
You can use the Vendia Share CLI to inspect the capabilities included in your Vendia Share user's `default` role.

First, login to Share using the CLI and provide your Vendia Share credentials when prompted
```
share login
```

Next, get information about the `default` role
```
share auth role get default
```

**Note:** a `default` role is created and associated with every new Vendia Share account

You'll see is that the `default` role includes many Uni Actions mapped to a Resource (`NameResource(*@*.*.*)` or `UniResource(*.*.*#)`).  This means that, by default, the your user is permitted to create and join Unis in the default (`*.unis.vendia.net#`) Vendia Share Uni namespace.  It also means that your user is permitted a wider range of Uni functions on any Uni on which your user owns a node (`NameResource(you@*.domain.com)`).

```
Found 1 Role
- "default"
.----------------------------------------------------------.
|                  Role "default" details                  |
|----------------------------------------------------------|
|      Action       |              Resources               |
|-------------------|--------------------------------------|
| UNI_INVITE        | NameResource(you@*.domain.com)       |
| UNI_QUERY         | NameResource(you@*.domain.com)       |
| UNI_RESET         | NameResource(you@*.domain.com)       |
| UNI_DELETE        | NameResource(you@*.domain.com)       |
| UNI_GET           | NameResource(you@*.domain.com)       |
| UNI_JOIN          | UniResource(*.unis.vendia.net#*)     |
| UNI_CREATE        | UniResource(*.unis.vendia.net#*)     |
| UNI_EVOLVE_SCHEMA | NameResource(you@*.domain.com)       |
| UNI_MUTATE        | NameResource(you@*.domain.com)       |
| UNI_DELETE_NODE   | NameResource(you@*.domain.com)       |
| USER_INVITE       | NameResource(*@*.*.*)                |
'----------------------------------------------------------'
```

### Creating a Uni in the default `unis.vendia.net` Namespace

#### Update Your registration.json File
First, rename the `registration.json.sample` to `registration.json`.

You'll want to update the `name` for your Uni to be unique, but preserving the `test-` prefix.  By default, all Unis share a common namespace (`vendia.net`) so try your best to avoid naming collisions - here is your chance to get creative!

You'll also want to update the `userId` of the `SupplierNode` to reflect your personal Vendia Share `userId` (i.e. the email address you used to register) before creating the Uni.

#### Create a Uni
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

When using the `get` command above, you'll notice the full Uni name includes the `unis.vendia.net` suffix.  Vendia Share permitted your user to create a Uni in the default namespace, thanks to the `UNI_CREATE | UniResource(*.unis.vendia.net#*)` capability within your `default` role. 

### Target an Unauthorized Uni Namespace
Now try to create another Uni, but this time in a custom namespace to which you **are not** authorized.  

Update the `name` of your Uni in the `registration.json` file to still be unique and still preserve the `test-` prefix, but specifying a full namespace.  For example, `test-yourinitials.unis.bmw.com`.  Your user does not have permission to use the `unis.bmw.com` namespace so this command will fail.

```bash
share uni create --config registration.json
```
 
The command above will produce an error, as expected, because the `name` in the updated `registraion.json` file references an unauthorized Uni namespace (`unis.bmw.com`).

```
$ share uni create --config registration.json
Create Error:
unauthorized request - <your_username> is not authorized to create uni test-<your_uniname>.unis.bmw.com
```

## Managing Unis using Your Own GraphQL Client
The Vendia Share CLI is a great utility that makes User, Uni, and Node management simple.  However, the Vendia Share control plane provides a GraphQL API with a rich set of operations, including for user management.  It's the same API the Share CLI uses, meaning anything you can do with the Share CLI you can do with any GraphQL client.

You'll now repeat a subset of the activities from the CLI section, this time using a custom GraphQL client that runs on [Node.js](https://nodejs.org/).  While you'll only interact with a few Vendia Share control plane API operations, [the full set](https://www.vendia.net/docs/share/share-graphql-schema) is accessible using an identical approach.

### Get Info About Your Uni

This command will get information about the Uni you created in the previous section, using the Share CLI.  Replace `<name_of_your_uni>` in the command below with the value of the `name` field in your `registration.json` file.
```
npm run getUni -- --uniname <name_of_your_uni>
```

You will see an output that looks similar to what you might see from the Share CLI or Share web application.

<details>
<summary>Output</summary>

```
$ npm run getUni -- --uniname <name_of_your_uni>

> uni-access-controls@1.0.0 getUni
> node getUni.js "--uniname" "<name_of_your_uni>"

Calling getUni for <name_of_your_uni>
Successfully called Share

Uni:  <name_of_your_uni>.unis.vendia.net
SKU:  SHARE
Status:  RUNNING
Created:  2022-01-31T22:19:35.058851+00:00

Node: SupplierNode
        Owner: you@domain.com
        Description: null
        Status: RUNNING
        Region: us-east-1

        CSP: AWS
        CSP Account Id: 123456789012
        CSP Org: 123456789012

        GraphQL API: https://api-id.execute-api.region.amazonaws.com/graphql/
        WSS API: wss://api-id.execute-api.region.amazonaws.com/graphql/
        GraphQL API Key: ******************************************************
```
</details>

You can inspect the `getUni.js` file behind the `npm` command above to see the code example in detail, including the use of a Vendia-authored library called [aws-signed-fetch](https://www.npmjs.com/package/@vendia/aws-signed-fetch/v/0.0.5).

## Summary

In this example you:

* Learned more about Vendia Share Uni Access Controls, including their composition, function, and purpose
* Used the Share CLI to interact with some of Vendia Share's Uni management operations, which are protected by Uni Access Controls
* Used a Node.js GraphQL client to interact with those same Uni management operations, demonstrating the ability to fully automate user management with any GraphQL-capable tool you choose
