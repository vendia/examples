# Milestone 1 - GraphQL Introduction
This first milestone is dedicated to introducing GraphQL, understanding why Vendia uses GraphQL, and how GraphQL fits into using Vendia Share.

## What is GraphQL?

> GraphQL is a query language for your API, and a server-side runtime for executing queries using a type system you define for your data. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data.

> --[Introduction to GraphQL](https://graphql.org/learn/)

GraphQL is a _specification_ that defines how developers can query data. The specification does not provide _implementation details_, requiring [GraphQL resolvers](https://www.apollographql.com/docs/tutorial/resolvers/) to be written in a certain language or persist data to a certain datastore. Indeed, there are examples of GraphQL clients and servers written in a [number of programming languages](https://graphql.org/code/) that interact with any number of datastores.

Universal Applications (Unis) expose managed GraphQL APIs for each participant (_node_).

## What are the Benefits of Using GraphQL?

There are several advantages of using GraphQL. Lets take a look at some of these advantages firsthand by running some queries ourselves - Lets open up Vendia 'GraphQL Explorer' for our **SupplierNode** to do some quick experimenting. 

To do this from the Share UI, select the meatball button on the right in the row pertaining to the node you want to access. An image is included below. Keep this explorer open in a window while we continue along with our workshop.

![GraphQL Share View](img/GraphQL_Share_UI.png)

### __Get Precise Data__

Other API strategies like [REST](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) do not allow developers to precisely retrieve the data that is needed by an application to satisfy a request for data. This can result in _overfetching_, where a larger payload is returned than needed, or _underfetching_, where the result doesn't return enough data and further requests are needed.

Try executing the following query from our **SupplierNode**: 

```
query listProducts {
  list_ProductItems {
    _ProductItems {
      _id
      _owner
      category
      description
      name
      price
      sku
      supplier
      promotionalContent
    }
  }
}
```

In some situations, we'd want all this information. Often with a REST API, however, we'd have to pull all these fields and then post-process the data to extract the one or two fields we actually need - _overfetching_. With GraphQL, we can pull exactly what we need every time.

Lets say we only need to pull every **_id**. Instead of running the above query and having to extract the field, we can run the following modified query.

```
query listProducts {
  list_ProductItems {
    _ProductItems {
      _id
    }
  }
}
```

This gives us exactly the info we need - no more, no less. 



### __Enforce Data Types__

The GraphQL specification defines a [type system](https://spec.graphql.org/October2021/#sec-Type-System). Types ensure application data complies with the required data formats. Per the specification, the type system is used to determine if a requested operation is valid, guarantee the type of response results, and describes the input types of variables to determine if values provided at request time are valid.

We set these types in our schema; for example, a Product's `name` is a string, while `price` is a number. 

Lets try a query for these data types, again from our **SupplierNode**.

```
mutation AddBadProduct {
  add_Product(input: {
    name: "All Organic Plastic"
    price: "8"
  }) {
    result {
      ... on Self_Product {
        name
        description
        sku
      }
    }
  }
}
```

Notice that when we execute this query, we get the following error.

```
{
  "data": null,
  "errors": [
    {
      "message": "Float cannot represent non numeric value: \"8\"",
      "locations": [
        {
          "line": 2,
          "column": 59
        }
      ]
    }
  ]
}
```
There are other ways to verify data (for example, utilizing [Vendia Smart Contracts](https://www.vendia.com/docs/share/smart-contracts)), but type enforcement provides a solid 'first line of defense' against mislabeled data.

**NOTE:** Errors returned by Vendia are HTTP code 200 responses. In order to handle errors, you will need to read the response body to determine if the operation was successful.


# Working with GraphQL APIs

GraphQL represents a change from REST APIs. Sample code in this project will demonstrate how to work with a Vendia Share Uni using the built-in GraphQL Explorer as well as several programming languages.

We will explore querying and changing data in a Uni using several programming languages. While each language will have its own nuances, each example will use standard GraphQL [queries](https://graphql.org/learn/queries/) and [mutations](https://graphql.org/learn/queries/#mutations).

**NOTE:** [GraphQL supports a number of programming languages](https://graphql.org/code/#language-support). The ones used in this example are representative only.

[Now let's see how Vendia Share looks at GraphQL](README-Milestone2.md).
