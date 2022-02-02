<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# User Access Controls
User access controls protect the user account management operations provided by Vendia Share.  This prevents unauthorized access to user management functions and enables features like self-service user management within an organization.

Authorization to specific user account management operations that act on user accounts is granted through a [Role Based Access Control (RBAC) mechanism](https://www.vendia.net/docs/share/rbac).  Before going further, it's important to define a few key RBAC terms, as they relate to user access controls.

## Key Terminology
* **Action** - the right to call one or more of Share's user account management operations
* **Resource** - the user account against which an Action can be performed
* **Capability** - a mapping of Action to Resource, linking the "right to call" (an operation) with the "right to manage" (a user account)
* **Role** - a named collection of Capabilities and used to determine if a user management operation is authorized

<figure>
  <img src="https://user-images.githubusercontent.com/85032783/151488927-8625e14b-4912-4fff-af82-d8e133790f61.png" />
  <figcaption><b>Figure 1</b> - <i>User Access Controls in the Vendia Share Control Plane</i></figcaption>
</figure>

With that additional context on Vendia Share user access controls, you will now examine the RBAC configuration for your Vendia Share user.

## Pre-requisites
See [prerequisites](../README.md#prerequisites) for the `access-controls` examples.

## Install Dependencies
Install the dependencies for this module using `npm`.

```
npm install
```

## Managing User Access Controls using the Vendia Share CLI

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

You'll see is that the `default` role includes just one user Action (`USER_INVITE `) mapped to a Resource (`NameResource(*@*.*.*)`).  This means that, by default, the only user management operation your user is permitted to invoke is the `invite` operation, which allows this user to invite any other Vendia Share user to join a Uni.

Note: This does not imply the other Vendia Share user will be permitted to join your Uni without some additional Uni permissions being granted.

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

### Attempt an Operation You Are Not Authorized to Perform
You can also use the Share CLI to attempt to modify the capabilities included in your Vendia Share user's `default` role.

First, login to Share using the CLI and provide your Vendia Share credentials when prompted
```
share login
```

Next, get information about the `default` role as you did in the prior step, but this time add a `--json`` argument and redirect the output to produce an RBAC policy file
```
share auth role get default --json > default.policy.json
```

<details>
<summary>
Examine the contents of the newly created `default.policy.json` file
</summary>

```
    {
      "name": "default",
      "capabilities": [
        {
          "action": "UNI_INVITE",
          "resources": [
            "NameResource(you@*.domain.com)"
          ]
        },
        {
          "action": "UNI_QUERY",
          "resources": [
            "NameResource(you@*.domain.com)"
          ]
        },
        {
          "action": "UNI_RESET",
          "resources": [
            "NameResource(you@*.domain.com)"
          ]
        },
        {
          "action": "UNI_DELETE",
          "resources": [
            "NameResource(you@*.domain.com)"
          ]
        },
        {
          "action": "UNI_GET",
          "resources": [
            "NameResource(you@*.domain.com)"
          ]
        },
        {
          "action": "UNI_JOIN",
          "resources": [
            "UniResource(*.unis.vendia.net#*)"
          ]
        },
        {
          "action": "UNI_CREATE",
          "resources": [
            "UniResource(*.unis.vendia.net#*)"
          ]
        },
        {
          "action": "UNI_EVOLVE_SCHEMA",
          "resources": [
            "NameResource(you@*.domain.com)"
          ]
        },
        {
          "action": "UNI_MUTATE",
          "resources": [
            "NameResource(you@*.domain.com)"
          ]
        },
        {
          "action": "UNI_DELETE_NODE",
          "resources": [
            "NameResource(you@*.domain.com)"
          ]
        },
        {
          "action": "USER_INVITE",
          "resources": [
            "NameResource(*@*.*.*)"
          ]
        }
      ]
    }
```

</details>

Now modify the contents of the `default.policy.json` file to attempt to grant yourself additional RBAC actions.  For example, adding the following snippet of JSON to the `default.policy.json` will allow your Vendia Share user to delete _any other Vendia Share user_.

```
{
  "action": "USER_DELETE",
  "resources": [
    "NameResource(*@*.*.*)"
  ]
}
```

After saving the updated version of `default.policy.json`, attempt to update your `default` policy.

```
share auth role set ./default.policy.json
```

The output of the command above will be lengthy, but will end with this message.

```
API error
unauthorized access
```

As expected, Share's User Access Controls prevented the expanded capabilities. Why? Because your `default` policy does not include the `USER_SET_ROLE` action, even on your own user account.

## Managing User Access Controls using Your Own GraphQL Client
The Vendia Share CLI is a great utility that makes User, Uni, and Node management simple.  However, the Vendia Share control plane provides a GraphQL API with a rich set of operations, including for user management.  It's the same API the Share CLI uses, meaning anything you can do with the Share CLI you can do with any GraphQL client.

You'll now repeat a subset of the activities from the CLI section, this time using a custom GraphQL client that runs on [Node.js](https://nodejs.org/).  While you'll only interact with a few Vendia Share control plane API operations, [the full set](https://www.vendia.net/docs/share/share-graphql-schema) is accessible using an identical approach.

### Get Your Default Role

This command will get information about your user's Vendia Share `default` role.
```
npm run getRole
```

You will see an output that looks similar to what you saw using the Share CLI.

<details>
<summary>Output</summary>

```
Successfully called Share

UserId:  aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
Has role: default

        Permitting: UNI_INVITE
        On: NameResource(you@*.domain.com)

        Permitting: UNI_QUERY
        On: NameResource(you@*.domain.com)

        Permitting: UNI_RESET
        On: NameResource(you@*.domain.com)

        Permitting: UNI_DELETE
        On: NameResource(you@*.domain.com)

        Permitting: UNI_GET
        On: NameResource(you@*.domain.com)

        Permitting: UNI_JOIN
        On: UniResource(*.unis.vendia.net#*)

        Permitting: UNI_CREATE
        On: UniResource(*.unis.vendia.net#*)

        Permitting: UNI_EVOLVE_SCHEMA
        On: NameResource(you@*.domain.com)

        Permitting: UNI_MUTATE
        On: NameResource(you@*.domain.com)

        Permitting: UNI_DELETE_NODE
        On: NameResource(you@*.domain.com)

        Permitting: USER_INVITE
        On: NameResource(*@*.*.*)

```
</details>

You can inspect the `getRole.js` files behind the `npm` command above to see the code examples in detail, including the use of a Vendia-authored library called [aws-signed-fetch](https://www.npmjs.com/package/@vendia/aws-signed-fetch/v/0.0.5).

## Summary

In this example you:

* Learned more about Vendia Share User Access Controls, including their composition, function, and purpose
* Used the Share CLI to interact with some of Vendia Share's user management operations, which are protected by User Access Controls 
* Used a Node.js GraphQL client to interact with those same user management operations, demonstrating the ability to fully automate user management with any GraphQL-capable tool you choose