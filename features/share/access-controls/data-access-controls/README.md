<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# Data Access Controls
Data Access Controls allow a data writer to dictate access rights to the data they've written to a Uni.  They can be thought of as the "fine-grained" authorization to the data.  These controls take the form of an Access Control List (ACL), and can be applied to either at the object (e.g. a `Product`) or property (e.g. just the `margin` field within a `Product`) level of a data structure.

Unlike centralized architectures, where a single data owner dictates the data access permissions of all data readers, Vendia Share's decentralized architecture empowers every data writer with the ability to control data access (i.e. to act as a data owner).  Data access controls protect the ability to read and the ability to modify.  So while [Node Access Controls](../node-access-controls/README.md) may permit a GraphQL query to be received by a node, Data Access Controls may restrict the data values returned to the caller.  Likewise, while Node Access Controls may permit a GraphQL mutation to be received by a node, Data Access Controls may restrict data modification if the caller is not permitted to do so because of an existing ACL.

<figure>
  <img src="https://user-images.githubusercontent.com/85032783/151488924-bce6055b-9a1b-4fe3-804d-93eb5692e7d3.png" />
  <figcaption><b>Figure 1</b> - <i>Data Access Controls in the Vendia Share Data Plane</i></figcaption>
</figure>

Figure 1 depicts a two-node Uni, each with different [authorization settings](https://www.vendia.net/docs/share/node-access-control#api-access) configured.

## Key Terminology
* **Object** - An entity that can written to Vendia Share, consisting of one or more properties, including an optional `acl` property
* **Path** - An optional path to a specific property within the object being protected by an ACL
* **Principal** - A node in the Uni, against which an ACL will be applied
* **Operation** - An action a Principal can take (e.g. `READ`) on the object or property specified
* **ACL** - The combination of Principal, Operation, and (optionally) Path, with an association to a specific Object

In this example, you will protect data in several ways using Data Access Controls.

## Pre-requisites
See [prerequisites](../README.md#prerequisites) for the `access-controls` examples.

## Creating a Uni using the Vendia Share CLI
In order to protect data, you first must create a Uni that includes a schema with [Access Control List](https://www.vendia.net/docs/share/fine-grained-data-permissions) definitions.

**Note:** Depending on your [Share pricing plan](https://www.vendia.net/pricing) you may need to delete your existing Unis before creating a new Uni to avoid hitting Uni or node limits.

### Update Your registration.json File
First, rename the `registration.json.sample` to `registration.json`.

You'll want to update the `name` for your Uni to be unique, but preserving the `test-` prefix.

You'll also want to update the `userId` of the `SupplierNode` and `DistributorNode` to reflect your personal Vendia Share `userId` (i.e. the email address you used to register) before creating the Uni.

**Note:** the snippet of the `registration.json` file that enables Data Access Controls on the `Product` items stored in the Uni is:

```
"x-vendia-acls": {
    "ProductAcl": {
        "type": "Product"
    }
}
```

That very simple snippet makes the fine-grained authorization that follows possible.

**Note:** there is no `initial-state.json` file in this example. Currently, Share's initial state and ACL functions are incompatible.

### Create a Uni
Next, if not already logged in to the Vendia Share [Command Line Interface (CLI)](https://vendia.net/docs/share/cli), do so by executing the command below and providing your Vendia Share credentials when prompted.

```bash
share login
```

After that, you're ready to creat your Vendia Share Uni.

```
cd uni_configuration
share uni create --config registration.json
```

The Uni will take approximately 5 minutes to launch.  You can check its status in the Vendia Share [web application](https://share.vendia.net) or using the Share CLI.

```bash
share get --uni <your_uni_name>
```

**NOTE:** `<your_uni_name>` should match the value of the `name` in `registration.json`

## Creating Products with ACLs
Working from the GraphQL Explorer of the **SupplierNode**, create your first Product by executing the mutation below.

```
mutation addProductWithACLs {
  add_Product_async(
    input: {
      category: specialty, 
      description: "Organic and delicious", 
      margin: 1.50, 
      name: "Blue Corn Tortilla Chips", 
      promotionalContent: "", 
      sku: "000001", 
      supplier: "Wild Harvest", 
      price: 3.49
    }, 
    aclInput: {
      acl: [
        {principal: {nodes: "DistributorNode"}, path: "category", operations: [READ]},
        {principal: {nodes: "DistributorNode"}, path: "description", operations: [READ]},
        {principal: {nodes: "DistributorNode"}, path: "name", operations: [READ]},
        {principal: {nodes: "DistributorNode"}, path: "promotionalContent", operations: [READ, WRITE]},
        {principal: {nodes: "DistributorNode"}, path: "sku", operations: READ},
        {principal: {nodes: "DistributorNode"}, path: "supplier", operations: READ},
        {principal: {nodes: "DistributorNode"}, path: "price", operations: READ}    
      ]
    }
		) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
  }
}
```

The mutation includes several ACLs that dictate the permissions the **DistributorNode** will have on the product entry created.

* The `promotionalContent` field is the only field whose value the **DistributorNode** will be able to modify (i.e. the ACL prohibits field-level access)
    * Sometimes the Supplier and Distributor collaborate on promotional content, so providing both `WRITE` permissions is desired
* The `margin` field will be hidden from the **DistributorNode** entirely
    * The Supplier does not want the Distributor to know its margins on the products it sells, but may choose to share that information with other parties (like a partner in a new joint venture) in the future
* All other fields are will be visible to the **DisitutorNode** but will be read-only

Add another product, with identical ACLs

```
mutation addProductWithACLs {
  add_Product_async(
    input: {
      category: conventional
      description: "A 20oz. classic", 
      margin: 1.49, 
      name: "Pepsi", 
      promotionalContent: "", 
      sku: "000002", 
      supplier: "Pepsi Co.", 
      price: 1.99
    }, 
    aclInput: {
      acl: [
        {principal: {nodes: "DistributorNode"}, path: "category", operations: [READ]},
        {principal: {nodes: "DistributorNode"}, path: "description", operations: [READ]},
        {principal: {nodes: "DistributorNode"}, path: "name", operations: [READ]},
        {principal: {nodes: "DistributorNode"}, path: "promotionalContent", operations: [READ, WRITE]},
        {principal: {nodes: "DistributorNode"}, path: "sku", operations: READ},
        {principal: {nodes: "DistributorNode"}, path: "supplier", operations: READ},
        {principal: {nodes: "DistributorNode"}, path: "price", operations: READ}    
      ]
    }
		) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
  }
}

```

Now add one final product, a top-secret new flavor of chips that no one (not even the Distributor) should know about (i.e. the ACL prohibits record-level access). 

```
mutation addProductWithACLs {
  add_Product_async(
    input: {
      category: conventional
      description: "Top secret", 
      margin: 1.79, 
      name: "Super Spicy Cheetos", 
      promotionalContent: "",
      sku: "000003", 
      supplier: "Pepsi Co.", 
      price: 1.99
    }, 
    aclInput: {
      acl: [
        {principal: {nodes: "DistributorNode"}, path: "*", operations: []},
      ]
    }
		) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
  }
}

```

## Reading Products with ACLs
Now that the Uni contains several Products, you can examine the impact ACLs have on the ability to read Products from either node in the Uni.

### From the SupplierNode
The Supplier should be able to all Products and all fields.

Executing this query from the **SupplierNode**
```
query listProducts {
  list_ProductItems {
    _ProductItems {
      ... on Self_Product {
        _id
        category
        description
        margin
        name
        promotionalContent
        sku
        supplier
        price
      }
    }
  }
}
```

will produce these results
```
{
  "data": {
    "list_ProductItems": {
      "_ProductItems": [
        {
          "_id": "017eb396-e83c-83f1-9ae7-3e040b78de0f",
          "category": "specialty",
          "description": "Organic and delicious",
          "margin": 1.5,
          "name": "Blue Corn Tortilla Chips",
          "promotionalContent": "",
          "sku": "000001",
          "supplier": "Wild Harvest",
          "price": 3.49
        },
        {
          "_id": "017eb398-e1a2-b3c6-308f-dde124fa53dc",
          "category": "conventional",
          "description": "A 20oz. classic",
          "margin": 1.49,
          "name": "Pepsi",
          "promotionalContent": "",
          "sku": "000002",
          "supplier": "Pepsi Co.",
          "price": 1.99
        },
        {
          "_id": "017eb39b-522c-35ca-b4f7-0d3449803aa9",
          "category": "conventional",
          "description": "Top secret",
          "margin": 1.79,
          "name": "Super Spicy Cheetos",
          "promotionalContent": "",
          "sku": "000003",
          "supplier": "Pepsi Co.",
          "price": 1.99
        }
      ]
    }
  }
}
```

**Note:** the use of `Self_Product_` for the **SupplierNode** is possible because the Supplier has full access to all Products.

### From the DistributorNode
Conversely, the Distributor should not be able to see the `margin` field in any Product and should not be able to see the top-secret chips Product either.

Executing this query from the **DistributorNode**
```
query listProducts {
  list_ProductItems {
    _ProductItems {
      ... on Self_Product_Partial_ {
        category
        description
        margin
        name
        price
        promotionalContent
        sku
        supplier
      }
    }
  }
}
```

will produce these results
```
{
  "data": {
    "list_ProductItems": {
      "_ProductItems": [
        {
          "_id": "017eb396-e83c-83f1-9ae7-3e040b78de0f",
          "category": "specialty",
          "description": "Organic and delicious",
          "margin": null,
          "name": "Blue Corn Tortilla Chips",
          "price": 3.49,
          "promotionalContent": "",
          "sku": "000001",
          "supplier": "Wild Harvest"
        },
        {
          "_id": "017eb398-e1a2-b3c6-308f-dde124fa53dc",
          "category": "conventional",
          "description": "A 20oz. classic",
          "margin": null,
          "name": "Pepsi",
          "price": 1.99,
          "promotionalContent": "",
          "sku": "000002",
          "supplier": "Pepsi Co."
        },
        {
          "_id": "017eb39b-522c-35ca-b4f7-0d3449803aa9",
          "category": null,
          "description": null,
          "margin": null,
          "name": null,
          "price": null,
          "promotionalContent": null,
          "sku": null,
          "supplier": null
        }
      ]
    }
  }
}
```

**Note:** the use of `Self_Product_Partial_` for the **DistributorNode** is necessary because the Distributor only has partial access to all Products.

## Editing Products with ACLs
You can also examine the impact ACLs have on the ability to modify Products from either node in the Uni.

### From the SupplierNode
The Supplier should be able to modify any field of any Product.

**Note:** You'll need to adjust the `id` value specified in these mutations to match the `Blue Corn Tortilla Chips` in your product catalog.

Executing this mutation from the **SupplierNode** will succeed.  
```
mutation updateCornTortillaPromoContent {
  update_Product_async(id: "017eb396-e83c-83f1-9ae7-3e040b78de0f", input: {promotionalContent: "https://www.shaws.com/shop/product-details.109900162.html"}) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
    error
  }
}
```

As will executing this mutation from the **SupplierNode**.
```
mutation updateCornTortillaPrice {
  update_Product_async(id: "017eb396-e83c-83f1-9ae7-3e040b78de0f", input: {price: 3.99}) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
    error
  }
}
```

### From the DistributorNode
The same is not true of the Distributor. The Distributor can only modify the `promotionalContent` field of the Products it can view.

**Note:** You'll need to adjust the `id` value specified in these mutations to match the `Blue Corn Tortilla Chips` in your product catalog.

Executing this mutation from the **DistributorNode** will succeed.
```
mutation updateCornTortillaPromoContent {
  update_Product_async(id: "017eb396-e83c-83f1-9ae7-3e040b78de0f", input: {promotionalContent: "https://www.shaws.com/shop/product-details.109900162.html"}) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
    error
  }
}
```

But executing this mutation from the **DistributorNode** will fail, as expected, because of the ACLs protecting the `price` field.
```
mutation updateCornTortillaPrice {
  update_Product_async(id: "017eb396-e83c-83f1-9ae7-3e040b78de0f", input: {price: 3.99}) {
    result {
      _id
      _owner
      submissionTime
      transactionId
      version
    }
    error
  }
}
```

The error returned captures the unauthorized access to modify the `price` field of a Product.
```
{
  "data": {
    "update_Product_async": null
  },
  "errors": [
    {
      "message": "unauthorized",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "update_Product_async"
      ]
    }
  ]
}
```

## Summary
In this example you:

* Learned more about Vendia Share Data Access Controls
* Used the Share CLI to create a Uni with two nodes, allowing ACLs to distinguish access rights between the two nodes 
* Used a Node.js GraphQL client to create, read, and edit data, as allowed by the ACLs in place
