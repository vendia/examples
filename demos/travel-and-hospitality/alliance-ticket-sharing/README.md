# Vendia Share Demo - A Real-Time Alliance Ticket Share

[Vendia Share](https://www.vendia.net) is the real-time data cloud for rapidly building applications that securely share data across departments, companies, clouds, and regions.  

## Demo Overview

* __Level__
    * Intermediate
* __Highlighted Features__
    * Fine-grained data access controls
    * Participant invite flow
    * GraphQL

This demo highlights the purpose and ease of creating data access controls for multi-party data sharing solutions, using the Vendia Share platform, as applied to the Travel and Hospitality industry. 

## Demo Context
Specifically, this demo explores an [alliance partnership](https://www.aa.com/i18n/travel-info/partner-airlines/iberia.jsp) where two airlines (American Airlines and Iberia Airlines) use Vendia Share to exchange ticket information in real-time.  Prior to using Vendia Share, the airlines often struggled to maintain a consistent, shared source of truth for tickets.   Since adopting Vendia Share, they dramatically decreased the time and resource spent on data reconciliation between their isolated ticket databases, increased visibility into each other's ticket activities, and improved their collective AI/ML algorithms using a larger, more accurate ticket data set.

## Demo Pre-Requisites
This demo heavily uses the Share CLI and the GraphQL Explorer so all pre-reqs listed are required.

* [Vendia Share Account](https://share.vendia.net/signup)
* [Git Client](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [Vendia Share CLI](https://vendia.net/docs/share/cli)

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

## Step 1 - Create a Multi-Party Uni
To create a Uni using the [Share CLI]((https://vendia.net/docs/share/cli).

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

## Step 2 - Add Tickets as American Airlines
To make tickets available to Iberia Airlines, American Airlines must first add tickets to the Uni.

### Add Tickets as American Airlines
As American Airlines, add several Tickets to the Uni using a set of GraphQL mutations, each with Access Control List (ACL) information that defines the read and write access to the tickets from all other nodes in the Uni.

1. Open the GraphQL Explorer of the __AmericanNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [products.gql](resources/american-tickets.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __AmericanNode__

### Confirm Tickets as American Airlines
You can confirm the existence of the newly added Tickets by executing this GraphQL query from the GraphQL Explorer of the __AmericanNode__

```graphql

```

Notice that all fields listed are populated in the response.

### Confirm Products as American Airlines
You can also confirm the existence of the newly added Tickets by executing this GraphQL query from the GraphQL Explorer of the __IberiaNode__

```graphql

```

Notice that most fields listed are populated in the response, except for:

* `fareBasis`
* `fareCalcArea`

The ACL appended to each ticket mutation prevents the __IberiaNode__ from viewing the value the fields above.

### Attempt to Change an American Airlines ticket as Iberia Airlines
As Iberia Airlines, attempt to modify an American Airlines Ticket.  

1. Open the Entity Explorer view from the __IberiaNode__
1. Select one of the American Tickets by clicking on its `_id` value
1. Click the `Edit` button
1. Modify a value (for example, `price`)
1. Click the `Save` button

You will receive an `Unauthorized` error message, as the ACL appended to each product mutation prevents the __IberiaNode__ from modifying Ticket fields.

## Step 3 - Add Tickets as Iberia Airlines
Likewise, to make tickets available to American Airlines, Iberia Airlines must first add tickets to the Uni.

### Add Tickets as American Airlines
As Iberia Airlines, add several Tickets to the Uni using a set of GraphQL mutations, each with Access Control List (ACL) information that defines the read and write access to the tickets from all other nodes in the Uni.

1. Open the GraphQL Explorer of the __IberiaNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [products.gql](resources/iberia-tickets.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __IberiaNode__

### Confirm Tickets as Iberia Airlines
You can confirm the existence of the newly added Tickets by executing this GraphQL query from the GraphQL Explorer of the __IberiaNode__

```graphql

```

Notice that all fields listed are populated in the response.

### Confirm Products as American Airlines
You can also confirm the existence of the newly added Tickets by executing this GraphQL query from the GraphQL Explorer of the __AmericanNode__

```graphql

```

Notice that most fields listed are populated in the response, except for:

* `fareBasis`
* `fareCalcArea`

The ACL appended to each ticket mutation prevents the __AmericanNode__ from viewing the value the fields above.

### Attempt to Change an Iberia Airlines ticket as American Airlines
As American Airlines, attempt to modify an Iberia Airlines Ticket.

1. Open the Entity Explorer view from the __AmericanNode__
1. Select one of the Iberia Tickets by clicking on its `_id` value
1. Click the `Edit` button
1. Modify a value (for example, `price`)
1. Click the `Save` button

You will receive an `Unauthorized` error message, as the ACL appended to each product mutation prevents the __IberiaNode__ from modifying Ticket fields.

## Step 4 - Add Alaska Airlines to the Uni

### Invite Alaska Airlines to the Uni

### Accept the Invite as Alaska Airlines

### Confirm Tickets as Alaska Airlines
You can confirm the existence of all partner (American and Iberia) Tickets by executing this GraphQL query from the GraphQL Explorer of the __AlaskaNode__

```graphql

```

Notice that most fields listed are populated in the response, except for:

* `fareBasis`
* `fareCalcArea`

The ACL appended to each ticket mutation prevents the __AlaskaNode__ from viewing the value the fields above, even though the node was just added to the Uni.

## Demo Conclusion
Through these simple steps, you explored Vendia Share's GraphQL interface, fine-grained data access controls, and Uni invite flow.  

To explore more Share capabilities, please explore additional [demos](../../../demos).
