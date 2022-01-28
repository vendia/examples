# Pattern 1: Single Domain, Single Bounded Context, and a Single Uni


## Scenario

The Customer Relationship Management (CRM) Team wants to create a single source of truth for customer account data, which includes firstname, lastname, customerId, personal details, contact details, and address. The CRM Team will frequently query customer data using customerId. 


## Modeling

Since CRM is an independent business unit we will assume it is a domain on its own. Inside CRM, we will have multiple sub-domains; customer account is one such sub-domain. You will model customer account as a Bounded Context.  Since CRM will perform frequent lookup, search, and filter on customer records by customerId, you will index customer accounts on the customerId property. 

If you are confused between Bounded Context, Entity, and the Aggregate you should keep in mind these terms correlate 1:1 for the purpose of this exercise. I will use the term Entity here to mean Root Entity which is an Aggregate in DDD. Bounded Context can have one or more than one Entity.




## Create a Uni

1. Login to [Vendia Share](https://share.vendia.net/login). 

You can [sign up](https://share.vendia.net/) if you don't have a login. 

2. Create a Uni

Click the `Create Universal Application` button on the top-right. Next, use the `Create your own` option. 

3. Fill out details in the Uni creation wizard. 

**Step 1:** Give your Uni a name. 
Prefix your Uni name with prefix `test-` so its name can be reused. Pick a unique Uni name since all Starter and Individual Tier users will share the vendia.net namespace, which will cause naming collisions.
Since this Uni will be owned and operated by the CRM Team. I will give it the name `test-CRM-append-unique-suffix`. Time to get creative, replace `append-unique-suffix` with your unique suffix in the Uni name. In this blog, I will simply refer to new Uni as the `CRM`. Click `Next`. 

**Step 2:** Fill out the following information to create a Uni node. 

```
Node Name: "CRM". // you can change the name.
Node Description: "Node dedicated to the CRM Domain". // You can change the description.
Cloud Server Provider: "AWS".
Node Region:"us-east-1". //you can change it to other regions.
Auth Option: "Vendia User". // Let's use Vendia User
```


**Step 3:** Provide the Uni schema. Copy and paste the Uni schema from the schema.json file in the schema folder. I have already designed the schema based on model we described above. But, this is the step in which you will spend most time while constructing Uni for your business problem.

   Let’s review few important things in the schema that you will reuse in most of your Unis.

Indexes on the `CustomerAccount`.

```json
"x-vendia-indexes": {
       "CustomerAccountIdIndex": [
           {
               "type": "CustomerAccount",
               "property": "customerId"
           }
       ]
   }

```
The Singleton Value Object `Schema Owner`. You can store schema and Uni metadata in it.

```json
"SchemaOwner": {
           "type": "object",
           "description": "Schema Owner Details Singleton Value Object",
           "properties": {
               "group": {
                   "type": "string"
               },
               "email": {
                   "type": "string"
               }
           }
       }

```

The `CustomerAccount` entity and its structure.

```
"CustomerAccount": {
           "description": "Customer Account",
           "type": "array",
           "items": {
               "type": "object",
               "properties": {
```


The nested complex type objects in the `CustomerAccount` such as `ContactDetails`.


```json
"contactDetails": {
                       "description": "customer contact details",
                       "type": "object",
                       "properties": {
                           "email": {
                               "description": "email address of a customer",
                               "type": "string"
                           },
                           "phone": {
                               "description": "phone number of a customer",
                               "type": "string"
                           }
                       }
                   }
```

The required constraint on the `customerId`, `firstname`, `lastName`, and on the next complex type `address`, and property of the `address` i.e `zipcode`.


```json
"required": [
                    "customerId",
                    "firstName",
                    "lastName",
                    "address"
                ]
```

4. Press `Create`. Wait for 5 minutes for Share to finish Uni provisioning.

After Uni provisioning is complete, you will notice that your Uni will appear in the `RUNNING` status on the home page. 
	
## Explore the Uni

Click the Uni you just created. Click on the `Entity Explorer`. You will notice the `SchemaOwner` and the `CustomerAccount` entity on the left. 
	
`SchemaOwner` is a Value Object; it’s a singleton value object with no unique identifier. You will use it to keep track of who is the Uni `owner` along with the `emailId` of Uni owner. It is good to have this information in the Uni itself. Click `Edit` and fill the `group` and the `emailId` properties.

Let’s create a customer record. Click `CustomerAccount` entity. Click `Create Customer Account`. Enter customer account details. For `CustomerId`, pick a number. I use the [10001,10002…] series for testing. In the real world, either you will have your own sequence generator for `customerId`, or you will use the `customerId` from different enterprise source of truth system.

You will see all the customer account records you created under the `CustomerAccount` entity. You can edit a specific record, change address, and view the version history of the customer account you just edited. The ledger keeps a record of all changes made to data in the Uni.

What you did using the Entity Explorer can be done using the GraphQL Explorer. You don’t have to type every single command and attribute to write a GraphQL query. You can build a GraphQL query or mutation by selecting the commands and the attributes in the `Schema Explorer`.

Let’s create a new customer record and see whether our required constraint on `customerId`,`firstname`,`lastname`, `address{zipcode}` is working or not?

Navigate to `GraphQL Explorer`, it has three sections, the left section is GraphQL commands for your Uni, you can use it to build a new query or mutation. In the middle section you will write your query and press the green button on the top to run it. And, you will see the results(success/error) of the query on the right-hand section. 

Try following queries in the `GraphQL Explorer` and note the difference between results. 

Mutation with required `zipcode` property. 


```graphql
mutation m{
  add_CustomerAccount_async(input: {customerId: "10001", firstName: "Jay", lastName: "Pipes"}) {
    error
  }
}
```


**Result:** It will throw an exception. 

Mutation with required properties. 


```graphql
mutation m {
  add_CustomerAccount_async(input: {customerId: "10001", firstName: "Jay", lastName: "Pipes", contactDetails: {}, address: {zipcode: 94568}}) {
    error
  }
}
```


**Result:** It will execute successfully. 

Take a moment now, and compare, the effort it took for you to create a Uni, and run queries. Compare the ease of use with Vendia Share relative to other data platform that you have used in the past. You can continue to pump more data into your Uni and you don’t have to worry about scaling. Vendia will shard your data.

## Clean Up
If you are operating in a Standard tier and plan to continue with Pattern 2, delete your Uni. Standard tier allows you to create only one Uni. You can do it from the `Uni Settings`. Navigate to your Uni>`Uni Settings`>Scroll down to the `Danger Zone` and you will find the `Delete Uni` command. 


## What did you learn

1. How to create a Uni
2. How to create a Singleton Value Object
3. How to enforce a required constraint on a property
4. How to model a data Aggregate(a.k.a)Root Entity in a Uni for a given Bounded Context
5. How to define indexes in the schema
6. How to create an Aggregate(a.k.a Root Entity) and an Entity in the schema
7. How to use GraphQL to create entity records
8. How to use Entity Explorer to create entity records
9. How easy it is to deploy a Uni schema to create a Uni

## What's next
Time to review the [Pattern 2](../pattern2/README.md)
