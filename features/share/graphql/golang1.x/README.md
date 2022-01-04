<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# Using Go to Query Our Uni

We will use the [machinebox/graphql](https://github.com/machinebox/graphql) module in our example to query our **Warehouse** node.

## Installation

Make sure you have a working Golang enironment. Run the following command to install the `machinebox/graphql` module:

```bash
go get github.com/machinebox/graphql
```

# Querying our Uni Node

[In our previous step](../creating-our-uni.md) we created a new Uni and recorded the `httpsUrl` and our `apiKey` of the **Warehouse** node. We will use this information to list out the items in our inventory. The query is defined in the file `query.go`.

```bash
API="warehouse_https_url" \
API_KEY="warehouse_api_key" \
go run query.go
```

The command will return each of the items stored in the Uni.
