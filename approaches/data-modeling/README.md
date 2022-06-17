<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Data Modeling
Vendia Share automatically converts a [data model](https://www.vendia.net/docs/share/data-modeling) into a production-grade, distributed application (called a [Universal Application](https://www.vendia.net/docs/share/dev-and-use-unis), or "Uni" for short) composed of serverless public cloud resources.  The data model input that Vendia Share accepts must follow the [JSON Schema specification](https://json-schema.org/draft/2020-12/json-schema-core.html).  The Uni creation process takes that input and automatically generates a number of artifacts, including a GraphQL interface.  In other words, the JSON Schema data model provided as an input during Uni creation directly influences the GraphQL interface you and your partners will integrate with when using the Uni.

This example demonstrates a number of data modeling approaches that can be applied, either individually or together, when constructing a data model.  It uses a simple Universal Application to highlight a number of JSON Schema features that Share supports as well as a handful of approaches that can be helpful when modeling "related" entities.

## Terminology
* **Entity** - A top-level property in the data model.  Vendia Share's JSON Schema-to-GraphQL compiler automatically creates a set of GraphQL operations (i.e. CRUDL) for each Entity defined.
* **Field** - A property defined within an Entity.  A Field, like any JSON Schema property, will have a number of attributes, most importantly a `type`.

## Step 0 - Prerequisites
This example requires a minimal set of dependencies.  Before getting started with this example, you'll first need to:

* Create a [Vendia Share account](https://share.vendia.net/)
* Install the Vendia Share [Command Line Interface (CLI)](https://www.vendia.net/docs/share/cli)
* Install [Git Client](https://git-scm.com/downloads)

In addition, you'll also need to clone this repository.

<details>
<summary>Instructions for cloning the repository</summary>

### Clone with SSH

```bash
git clone git@github.com:vendia/examples.git
```

### Clone with HTTPS

```bash
git clone https://github.com/vendia/examples.git
```

</details>

## Step 1 - Create a Universal Application
The best way to explore data model approaches for Vendia Share is to examine the end result - a Universal Application.  Before proceeding further, you'll first want to create a Uni.

To create a Uni using the Share CLI:

1. Change directories to `uni_configuration`
    1. `cd uni_configuration`
1. Create your own copy of the `registration.json.sample` file, removing the `.sample` suffix
    1. `cp registration.json.sample registration.json`
1. Edit the `registration.json` file changing
    1. `name` - keep the `test-` prefix but make the remainder of the name unique
    1. `userId` - on both nodes should match your Vendia Share `userId` (i.e. your email address)
1. Create the Uni
    1. `share uni create --config registration.json`

Wait about 5 minutes for the Uni to reach a `Running` state.

## Step 2 - Explore Data Model Approaches
With the Uni created, we now have access to the input - the [JSON Schema data model](uni_configuration/schema.json) - and the output - the Uni and its GraphQL schema - to analyze together.

### Approach 1 - Define Common Types
Toward the top of the [data model](uni_configuration/schema.json), you'll notice a top-level field called `definitions`.  The definitions section defines two reusable types - `Person` and `Address`.

<details>
<summary>Definitions</summary>

```json
"definitions": {
    "Name" : {
      "type": "object",
      "properties": {
        "firstName" : {
          "description": "Person's first name",
          "type": "string"
        },
        "lastName" : {
          "description": "Person's first name",
          "type": "string"
        }
      },
      "required": [
        "firstName",
        "lastName"
      ]
    },
    "Address" : {
      "type": "object",
      "properties": {
        "street" : {
          "description": "Street address",
          "type": "string"
        },
        "city" : {
          "description": "The city",
          "type": "string"
        },
        "state" : {
          "description": "The state",
          "type": "string"
        },
        "zipcode" : {
          "description": "The zipcode",
          "type": "string"
        }
      },
      "required": [
        "street",
        "city",
        "state"
      ]
    }
  }
```
</details>

The `definitions` above are referenced by Entity definitions in subsequent sections of the schema, where a property can reference a reusable type.  The `$refs` keyword is used to reference the `definitions` by name.

<details>
<summary>Referencing Definitions</summary>

```json
"properties": {
  "employeeName": {
    "description": "Name of the employee",
    "type": {
      "$ref" : "#/definitions/Name"
    }
  }
}
```
</details>

**NOTE:** While `definitions` was [officially replaced](https://github.com/json-schema-org/json-schema-spec/issues/512) by `$defs`, it's currently the **only keyword** to define reusable types supported by Vendia Share at this time.  Support for `$defs` is on our near-term product roadmap.

### Approach 2 - Define Access Control Lists


### Approach 3 - Define Indexes

### Approach 4 - Leverage Types

### Approach 5 - Leverage Formats

### Approach 6 - Leverage Patterns

### Approach 7 - Define Required Fields

### Approach 8 - Model Parent => Child Relationships

### Approach 9 - Model Child => Parent Relationships

### Approach 10 - Model Aggregates

### Approach 11 - Evolve the Model
