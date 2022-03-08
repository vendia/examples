<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# GraphQL Goodies

[Vendia Share](https://share.vendia.net/) has features that improve the GraphQL developer experience and addresses known limitations to what the core GraphQL specification allows. Each of the features has been illustrated using code examples.

# Creating Our Universal Application

## Pre-requisites

* [Vendia Share CLI](https://vendia.net/docs/share/cli)

## Deploying the Uni

This example will create a Uni to store attributes regarding product inventory. This Uni will add a constraint to the `quantity` property.

If you are not already logged in to the Share CLI, do so by running [`share login`](https://vendia.net/docs/share/cli/commands/login):

```bash
share login
```

The `share uni create` command can be used to deploy your Uni. You will need to copy the file `registration.json.sample` to `registration.json`. Pick a unique `name` for your Uni that begins with `test-`. Unis that start with `test-` prefix can be destroyed and reused much faster than those without the `test-` prefix. By default all Unis share a common namespace so here is your chance to get creative. Update the `userId` attribute of each node to reflect your Vendia Share email address.

```bash
cd uni_configuration
share uni create --config registration.json
```

The Uni will take several minutes to deploy. We have seeded several inventory items in our Uni. We can check on its status in the Vendia Share web application or with the `share` CLI. The Uni is ready for use when it enters a `RUNNING` state.

**NOTE:** The name of your Uni will be different. Adjust the name accordingly.

```bash
share get --uni test-graphql-goodies
```

Make note of the `httpsUrl` and our `apiKey` of the **Warehouse** node. We will use it in the examples below.

# Examining Vendia GraphQL Enhancements

We have three separate code examples that highlight capabilities Vendia has to improve the GraphQL developer experience.

* [Vendia Transactions](./node/README.md)

* [Conditional Updates](./golang1.x/README.md)

* [Examining Changes to Data](./python3/README.md)
