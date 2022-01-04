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

```json
{
  "_id": "017e215e-3b07-45d1-07c7-1b9117c72935",
  "itemName": "Thing 1",
  "itemNumber": "th001",
  "quantity": 100,
  "lastUpdated": "2022-01-01T00:00:00Z"
}
{
  "_id": "017e215e-3c60-94a7-c62c-a0cb1393f5d5",
  "itemName": "Thing 2",
  "itemNumber": "th002",
  "quantity": 200,
  "lastUpdated": "2022-01-01T00:00:00Z"
}
{
  "_id": "017e215e-3d82-ff72-c516-6c609f145bbf",
  "itemName": "Thing 3",
  "itemNumber": "th003",
  "quantity": 300,
  "lastUpdated": "2022-01-01T00:00:00Z"
}
```

What is important to note is that we were able to use native Golang modules and capabilities to interact with our GraphQL API. As far as the client is concerned, there is nothing Vendia-specific at work. This command-line program is simply querying a GraphQL API. All of the goodness that Vendia Share offers - real-time, multi-party data sharing with control and lineage - happens behind the API.
