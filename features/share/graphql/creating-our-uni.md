<p align="center">
  <a href="https://vendia.net/">
    <img src="https://share.vendia.net/logo.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Creating Our Universal Application

## Pre-requisites

* [Vendia Share CLI](https://vendia.net/docs/share/cli)

## Deploying the Uni

This example will create a Uni to store attributes regarding product inventory.

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
share get --uni test-graphql-example
```

Make note of the **Warehouse** node's graphqlApi `httpsUrl` and `apiKey`. Our code examples will use these values.

Once our Uni is up and running, we can begin experimenting by using different programming languages.

* [golang1.x](./golang1.x/README.md)

* [node](./node/README.md)

* [python3](./python3/README.md)

Once you've gone through these foundation examples, feel free to dive deeper into Vendia Share [GraphQL enhancements](../graphql-enhancements/README.md) and examples of using [GraphQL filters](../graphql-filters/README.md) to effectively query Vendia Share.
