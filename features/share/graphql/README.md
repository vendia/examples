<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# GraphQL in Vendia Share

[Vendia Share](https://share.vendia.net) allows users to interact with their Universal Application (Uni) nodes through the use of managed [GraphQL](https://graphql.org/) APIs.

## What is GraphQL?

> GraphQL is a query language for your API, and a server-side runtime for executing queries using a type system you define for your data. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data.

> --[Introduction to GraphQL](https://graphql.org/learn/)

Simply put, GraphQL is a _specification_ that defines how developers can query data. The specification does not provide _implementation details_, where the GraphQL resolvers must be written in a certain language and persist data to a certain datastore. Indeed, there are examples of GraphQL clients and servers written in a [number of programming languages](https://graphql.org/code/) that interact with any number of datastores.

Universal Applications (Unis) expose managed GraphQL APIs for each participant (_node_).

## What are the Benefits of Using GraphQL?

There are several advantages of using GraphQL to query and change data.

### Get Precise Data

Other API strategies like [REST](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) do not allow developers to precisely retrieve just the data that is needed by an application to satisfy a request for data. This can result in _overfetching_, where a larger payload is returned than needed, or _underfetching_, where the result doesn't return quite enough data and further requests are needed.

### Get Many Resources in a Single Request

GraphQL allows applications to get all the data they need - even if they are different types - by issuing a single request.

### Enforce Data Types

Types ensure application developers understand the data with which they are working.

# Working with GraphQL APIs

GraphQL represents a change from REST APIs. Sample code in this project will demonstrate how to work with a Vendia Share Uni using the built-in GraphQL Explorer as well as several programming languages.

We will explore querying and changing data in a Uni using several programming launguages. While each language will have its own nuances, each example will use standard GraphQL [queries](https://graphql.org/learn/queries/) and [mutations](https://graphql.org/learn/queries/#mutations).

**NOTE:** [GraphQL supports a number of programming languages](https://graphql.org/code/#language-support). The ones used in this example are representative only.

[Let's start by creating our Uni](./creating-our-uni.md).
