<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# Using Golang to Work with Our Uni

We have used the [machinebox/graphql](https://github.com/machinebox/graphql) module in our example to query our **Warehouse** node.

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

**NOTE:** The results below are representative. If you've made changes using other runtime examples or the GraphQL Explorer then they will be reflected in your query results as well.

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

# Changing Data in Our Uni Node

Just as we can _query_ our inventory data, we can _change_ it as well. We will update the **quantity** of our **Thing 3** item to an arbitrary number. We will use the flags `itemname` and `-quantity` to set our desired values . The mutation is defined in the file `mutation.go` and will use the `API` and `API_KEY` of our **Warehouse** node.

```bash
API="warehouse_https_url" \
API_KEY="warehouse_api_key" \
go run -itemname="Thing 3" -quantity=3000 mutation.go
```

# Summary

What is important to note is that we were able to use native Golang modules and capabilities to interact with our GraphQL API. As far as the client is concerned, there is nothing Vendia-specific at work. These command-line programs are simply interacting with a node's GraphQL API. All of the goodness that Vendia Share offers - real-time, multi-party data sharing with control and lineage - happens behind the API.
