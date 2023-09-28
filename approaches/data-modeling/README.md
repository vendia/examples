<p align="center">
  <a href="https://vendia.net/">
    <img src="https://share.vendia.net/logo.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Data Modeling
One of Vendia Share's most powerful features is automatically converting a [data model](https://www.vendia.net/docs/share/data-modeling) into a production-grade, distributed application (called a [Universal Application](https://www.vendia.net/docs/share/dev-and-use-unis), or "Uni" for short), composed of serverless public cloud resources.  The data model input that Vendia Share accepts must follow the [JSON Schema specification](https://json-schema.org/draft/2020-12/json-schema-core.html).  The Uni creation process takes that input and automatically generates a number of artifacts, including a GraphQL schema and its full implementation.  In other words, the JSON Schema data model provided as an input during Uni creation directly relates to the GraphQL interface you and your partners will leverage when integrating with the Uni.

This example demonstrates a number of data modeling approaches that can be applied, either individually or together, when constructing a data model.  The example uses a simple Universal Application to highlight a number of JSON Schema features that Share supports, as well as a handful of modeling approaches that can be helpful when connecting "related" entities.

## Terminology
* **Entity** - A top-level property in the data model.  Vendia Share's JSON Schema-to-GraphQL compiler automatically creates a set of GraphQL operations (i.e. queries, mutations, subscriptions) for each Entity defined.
* **Field** - A property defined within an Entity.  A Field, like any JSON Schema property, will have a number of attributes, most importantly a name and a type.

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
    1. `name` - keep the `test-` prefix but make the remainder of the name unique. And for enterprise customers, make sure to add the applicable namespace `unis.<yourdomain>.<yoursuffix>`.
    1. `userId` - on both nodes should match your Vendia Share `userId` (i.e. your email address)
1. Create the Uni
    1. `share uni create --config registration.json`

Wait about 5 minutes for the Uni to reach a `Running` state.

## Step 2 - Explore Data Model Approaches
With the Uni created, we now have access to the input - the [JSON Schema data model](uni_configuration/schema.json) - and the output - the Uni and its GraphQL schema - to analyze together.  This Uni comes with a few sample records - a few `Employee` records and a few `Office` records.  This will allow you to explore the end result of the Uni creation process with a small but representative set of entities.

### Approach 1 - Define Common Types
Toward the top of the [data model](uni_configuration/schema.json), you'll notice a top-level element called `definitions`.  The definitions section defines four pre-defined, reusable types - `Person`, `Address`, `EmployeeId`, and `OfficeId`.

<details>
<summary>Definitions</summary>

```json
"definitions": {
 "Name": {
   "type": "object",
   "properties": {
     "firstName": {
       "description": "Person's first name",
       "type": "string"
     },
     "lastName": {
       "description": "Person's first name",
       "type": "string"
     }
   },
   "required": [
     "firstName",
     "lastName"
   ]
 },
 "Address": {
   "type": "object",
   "properties": {
     "street": {
       "description": "Street address",
       "type": "string"
     },
     "city": {
       "description": "The city",
       "type": "string"
     },
     "state": {
       "description": "The state",
       "type": "string",
       "pattern": "((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))"
     },
     "zipcode": {
       "description": "The zipcode",
       "type": "string",
       "pattern": "\\d{5}"
     }
   },
   "required": [
     "street",
     "city",
     "state"
   ]
 },
 "EmployeeId": {
   "type": "string",
   "pattern": "\\d{5}"
 },
 "OfficeId": {
   "type": "string",
   "pattern": "\\d{3}"
 }
}
```
</details>

The `definitions` above are referenced by Entity definitions in subsequent sections of the schema, where a property can reference a reusable type.  The `$refs` keyword is used to reference the `definitions` by name.  See [this explanation](https://json-schema.org/understanding-json-schema/structuring.html#ref) from more information on using `definitions` and `$refs` together.

<details>
<summary>Referencing Definitions</summary>

```json
"properties": {
 "employeeId": {
   "description": "Unique identifier of the employee",
   "$ref": "#/definitions/EmployeeId"
 },
 "employeeName": {
   "description": "Name of the employee",
   "$ref": "#/definitions/Name"
 },
 "employeeAddress": {
   "description": "Address of the employee",
   "$ref": "#/definitions/Address"
 },
 "managerId": {
   "description": "Unique identifier of the employee's manager",
   "$ref": "#/definitions/EmployeeId"
 },
 "employeeIds": {
   "description": "Unique identifier of the employees this person manages",
   "type": "array",
   "items": {
     "$ref": "#/definitions/EmployeeId"
   }
 }
}
```
</details>

**NOTE:** While `definitions` was [officially replaced](https://github.com/json-schema-org/json-schema-spec/issues/512) by `$defs`, it's currently the **only keyword** to define reusable types supported by Vendia Share at this time.  Support for `$defs` is on our near-term product roadmap.

### Approach 2 - Define Access Control Lists
Below the `definitions` section of the data model is the `x-vendia-acls` section.  More information about Vendia Share's fine-grained data access controls, expressed as Access Control List (ACL) format, can be found [here](https://www.vendia.net/docs/share/fine-grained-data-permissions) and a detailed example of using them is [here](../../features/share/access-controls/data-access-controls).

The `x-vendia-acls` section defines two ACLs, one per entity that requres fine-grained access control protections - `Employee` and `Office`.

<details>
<summary>ACLs</summary>

```json
"x-vendia-acls": {
   "EmployeeAcl": {
     "type": "Employee"
   },
   "OfficeAcl": {
     "type": "Office"
  }
}
```
</details>

**NOTE:** There's nothing else to do 🙌. Vendia Share's JSON Schema-to-GraphQL compiler will generate an appropriate GraphQL type for the defined ACL and append it to the model of each entity (e.g. `Employee` and `Office`) so it is available alongside all other (explicitly defined) fields.  

You can view the resulting ACL fields on the entities for yourself, using the Vendia Share web app's GraphQL Explorer view.

### Approach 3 - Define Indexes
After `x-vendia-acls`, you'll notice a section for `x-vendia-indexes`.  This section allows you to add indexes to fields that you believe will be frequently used when filtering entities.  Using an index does require an understanding of a.) the query patterns expected by GraphQL clients (what to index?) b.) the expected size (i.e. number of) of the entities (will an index meaningfully improve retrieval performance?).

The `x-vendia-indexes` places an index on the `employeeId` field of the `Employee` entity and the `officeId` of the `Office` entity.

<details>
<summary>Indexes</summary>

```json
"x-vendia-indexes": {
  "EmployeeIdIndex": {
    "type": "Employee",
    "property": "employeeId"
  },
  "OfficeIdIndex": {
    "type": "Office",
    "property": "officeId"
  }
}
```
</details>

Because these two fields are the unique identifier of each entity, it's highly likely they'll be used to "fetch" the entity when apply a filter to a query.  As such, index these fields makes sense in cases where the total number of entities will be large.

**NOTE:** There currently is not a way to "visualize" that an index is applied to a field.  There's a bit of trust involved that Share has applied the index you requested. However, if an index is improperly formed or applied to a non-existent field by mistake, an exception will be raised during Uni creation.  

### Approach 4 - Leverage Types
For the entities defined in the schema - `Employee` and `Office` - note the use of appropriate types for each field.  Selecting the most appropriate type is an important part of [data modeling](https://www.vendia.net/docs/share/data-modeling), as is understanding the JSON Schema type input » GraphQL type output conversions that Vendia Share performs on Uni creation.

The `type` fields included below show [a subset](https://json-schema.org/understanding-json-schema/reference/type.html) of types available - `string`, `number`, `integer`, `boolean` - to demonstrate the range that's possible with a JSON Schema data model.

<details>
<summary>Types</summary>

```json
"properties": {
  "officeId": {
    "description": "Unique identifier of the office",
    "type": {
      "$ref" : "#/definitions/OfficeId"
    }
  },
  "officeAddress": {
    "description": "Address of the office",
    "type": {
      "$ref" : "#/definitions/Address"
    }
  },
  "maxOccupancy": {
    "description": "Maximum number of employees allowed",
    "type": "integer"
  },
  "costType" : {
    "description": "Cost type for the office",
    "type": "string",
    "enum": ["LEASE", "MORTGAGE", "OWN", "OTHER"]
  },
  "monthlyCost": {
    "description": "Cost type for the office per month, if applicable",
    "type": "number"
  },
  "dateOpened": {
    "description": "Date the office opened",
    "type": "string",
    "format": "date"
  },
  "isFull": {
    "description": "Whether the office is at its max capacity",
    "type": "boolean"
  }
}
```
</details>

The types selected for each field cannot be modified after a Uni is created so they are especially important to get right from the start.

You can use the GraphQL Explorer or Entity Explorer views of the Vendia Share web app to review which JSON Schema types from the [data model](uni_configuration/schema.json) resulting in which GraphQL Schema types.

### Approach 5 - Leverage Formats
When using the `string` type, you may also want to apply one of the pre-defined `format` values [supported by JSON Schema](https://json-schema.org/understanding-json-schema/reference/string.html#built-in-formats).  This not only makes the schema more understandable by your partners (who may be sharing data with you) but also adds another layer of syntax validation for all GraphQL mutations.

For example, the `Office` entity's `dateOpened` field has a `format` set to `date`.  Any mutation on the `Office` entity that includes a `dateOpened` field will have its value for `dateOpened`  validated against the JSON Schema `date` format of `yyyy-mm-dd`.  Any value that fails that validation check will immediately result in a failed mutation operation for a GraphQL client. 

<details>
<summary>Formats</summary>

```json
"dateOpened": {
  "description": "Date the office opened",
  "type": "string",
  "format": "date"
}
```
</details>

The formats available to further restrict `string` fields are certainly helpful, but sometimes a custom format is needed.

### Approach 6 - Leverage Patterns
For cases where a custom format is needed to restrict valid `string` field formats, a `pattern` [can be defined](https://json-schema.org/understanding-json-schema/reference/string.html#regular-expressions).  The `pattern` value must be a valid JavaScript ([EMCA 262](https://www.ecma-international.org/publications/standards/Ecma-262.htm)) regular expression.  Like `format` above, any mutation that includes a field that has a `pattern` applied must match that pattern or the mutation will be deemed invalid and the mutation will be rejected.

The `Address` type include several fields - `state` and `zipcode` - that constrain a `string` type with a specific `pattern`.

<details>
<summary>Patterns</summary>

```json
"state": {
  "description": "The state",
  "type": "string",
  "pattern": "((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))"
},
"zipcode": {
  "description": "The zipcode",
  "type": "string",
  "pattern": "\\d{5}"
}
```
</details>

You can experiment with sending in valid and invalid fields for the types above using the GraphQL Explorer or Entity Explorer views of your deployed Uni. 

### Approach 7 - Define Required Fields
Another mechanism to validate input to Share (synchronously) when data is submitted to a Uni (i.e. when a mutation is sent to a node's GraphQL API) is to specify the `required` fields for a given `object` definition.  Often an `object` will be composed of many `properties` - some required, some optional.  Using the `required` definition makes those expectations clear (through the schema) and enforced (when new mutations are submitted).

The `Employee` entity includes a `required` section to ensure all Employee records include at least a minimum set of fields.

<details>
<summary>Required</summary>

```json
"required": [
  "employeeId",
  "employeeName",
  "employeeAddress",
  "managerId",
  "officeId"
]
```
</details>

Required fields are exactly that, and with a `required` definition in place both you and your partners will improve your overall data quality at the point of data creation. 

### Approach 8 - Model Parent => Child and Child => Parent Relationships
One common data structure is an entity that "contains" other entities, often called a parent-child relationship.  Because of the non-relational nature of JSON Schema, parent-child relationships cannot be explicitly captured, unlike in relational schemas (e.g. SQL's DDL).  However, the data model can still contain these relationships and, with the right application code, those relationships can be captured in the model as well.

The `Employee` entity can be either a parent or a child or both.  An `Employee` can manage one or more other employees, and that relationship is captured by the `employeeIds` field of the `Employee`.

<details>
<summary>Parent => Child</summary>

```json
"employeeIds": {
  "description": "Unique identifier of the employees this person manages",
  "type": "array",
  "items": {
  "type": {
    "$ref" : "#/definitions/EmployeeId"
  }
}
```
</details>

This means that anytime a new `Employee` is added to a Uni, its parent (another `Employee`) must be updated as well to include its new child.  Since these two updates should happen as a group - either both are successful or neither should be - you should consider executing these modifications using a [Vendia Transaction](https://www.vendia.net/docs/share/vendia-transaction).

The opposite is also true - it's common for a child-parent relationship to be modeled as well.  In some cases parent-child is most appropriate, in some cases child-parent is most appropriate, and in some cases maintaining both is appropriate.  It's often helpful to consider the queries that you anticipate and model the parent-child / child-parent relationships to optimize for those queries.

In the case of `Employee`, both the parent-child (as described above) and child-parent (as described below) relationships are maintained.  Specifically, for the child-parent relationship, every `Employee` includes a `managedId` field.  Any time a new `Employee` is added, it must (by schema definition) have a `managerId` value (thanks to the `required` section of `Employee`).

<details>
<summary>Child => Parent</summary>

```json
"managerId": {
  "description": "Unique identifier of the employee's manager",
  "type": {
    "$ref" : "#/definitions/EmployeeId"
  }
}
```
</details>

With the parent-child and child-parent relationships in place for `Employee`, you now have several new application-level responsibilities:

* Every `Employee` must be assigned a manager (as captured by `managerId`) and every `managerId` provided must be valid (must be a valid `employeeId`)
* Every `Employee` may be assigned one or more direct reports (as captured by `employeeIds`) and the `employeeIds` values must be valid (must be a valid `employeeId`)

In return for that additional complexity when adding or updating `Employee` entities, you in turn unlock a range of new queries and filters (some through GraphQL query filtering, some through client-side filtering depending on the specific filter conditions):

* Find all employees who report to a specific manager - this can be either the list of `employeeId` (thanks to the parent-child relationship) or the full list `Employee` entities (thanks to the child-parent relationship)
* Find all managers / non-managers
* Find the managers with the most / least direct reports
* And many more combinations using the above with the other fields `Employee` provides for querying/filtering

### Approach 9 - Model Aggregates
One limitation of GraphQL is its inherent lack of aggregation functions (e.g. count, sum, average, etc.).  While those functions don't come out-of-the-box from GraphQL, with a bit of additional application code you can model and maintain those values at the application layer.  This allows aggregates to be implemented in a single place and their results to be queryable by _all_ GraphQL clients  

The `Office` entity includes one aggregate - `currentOccupancy` - and one helpful boolean value - `isFull`.  The expectation is that any time a new `Employee` is added, its assigned `Office` will be updated as well (by application code) to reflect an increase in `currentOccupancy` and, optionally, an update to the `isFull` value.

<details>
<summary>Aggregates</summary>

```json
"currentOccupancy": {
  "description": "Current number of employees reporting to this office",
  "type": "integer"
},
"isFull": {
  "description": "Whether the office is at its max capacity",
  "type": "boolean"
}
```
</details>

While both values could be computed client-side by listing all `Employee` records assigned to a given `Office`, the aggregates make querying for that information simpler.  You can now much more easily determine:

* How many offices are at capacity
* How many available seats are available per office
* How many total seats are available across all offices

### Approach 10 - Leave Room to Evolve
One final technique is here to help with a common data modeling challenge - that data models often evolve over time.  Vendia Share supports [schema evolution](https://www.vendia.net/docs/share/cli/commands/uni#uni-evolve) for all _backwards compatible_ schema changes.

For example, adding a new field to `Employee` called `trainingsCompleted` is a backwards compatible change.  That new field can easily be added to the existing `Employee` entity using schema evolution.  Conversely, removing the `EmployeeName` field from the `Employee` entity is a backwards _incompatible_ change (i.e. a "breaking" change) and would not be permitted.

Balancing constraints - `type`, `format`, `pattern`, `required` - with future expansion flexibility - `share uni evolve` - can be a challenge.  This is often more art than science. Collaborating and reviewing your data model with a [Vendia SA](https://www.vendia.net/poc) as you get started with Vendia Share is often a great way to validate you've achieved that balance.
