<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# Creating Our Universal Application

## Pre-requisites

* [Vendia Share CLI](https://vendia.net/docs/share/cli)

## Deploying the Uni

This example will create a Uni to store attributes regarding product inventory.

If you are not already logged in to the share service you do so by running [`share login`](https://vendia.net/docs/share/cli/commands/login):

```bash
share login
```

The `share uni create` command can be used to deploy our Uni. You will need to copy the file `registration.json.sample` to `registration.json`. Pick a unique `name` for your uni that begins with `test-` - by default all unis share a common namespace so here is your chance to get creative. Update the `userId` attribute of each node to reflect your Vendia Share email address.

```bash
cd uni_configuration
share uni create --config registration.json
```

The Uni will take several minutes to deploy. We have pre-seeded several inventory items in our Uni. We can check on its status in the Vendia Share web application or with the `share` CLI.

**NOTE:** The name of your uni will be different. Adjust the name accordingly.

```bash
share get --uni test-graphql-example
```

Make note of the **Warehouse** node's graphqlApi `httpsUrl` and `apiKey`. Our code examples will use these values.

Once our Uni is up and running, we can begin experimenting by using different programming languages.

* [golang1.x](./golang1.x/README.md)
