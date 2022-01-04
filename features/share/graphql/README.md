<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# GraphQL in Vendia Share

[Vendia Share](https://share.vendia.net) allows users to interact with their Universal Application (Uni) through the use of [GraphQL](https://graphql.org/) APIs.

There are several advantages of using GraphQL to query and change data.

* Get exactly what you asked for

Other API strategies like REST do not allow developers to precisely retrieve just the data this is needed by an application. This can result in _overfetching_, where a larger payload is returned than needed, or _underfetching_, where the result didn't return quite enough data and further requests are needed.

* Get many resources in a single request

GraphQL allows applications to get all the data they need - even if they are different types - by issuing a single request.

* Enforce data types

Types ensure application developers understand the data with which they are working.

GraphQL APIs represent a change from REST APIs. This example will demonstrate how to work with a Vendia Share Uni using the built-in GraphQL Explorer as well as several programming languages. 

**NOTE:** [GraphQL supports a number of programming languages](https://graphql.org/code/#language-support). The ones used in this example are representative only.

[Let's start by creating our Uni](./creating-our-uni.md).
