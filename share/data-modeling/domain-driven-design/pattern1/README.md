# Pattern 1: Single Domain, Single Bounded Context, and a Single Uni


# Scenario

The Customer Relationship Management(CRM) Team wants to create a single source of truth for customer account data, which includes first name, last name, customerId, personal details, contact details, and address. The CRM Team will frequently query customer data using customerId. 


# Modeling

Since CRM is an independent business unit we will assume it is a domain on its own. Inside CRM, we will have multiple sub-domains; customer account is one such sub-domain. You can model a customer account as a Bounded Context.  Since CRM will perform frequent lookup, search, and filter on customer records by customerId, you will index customer accounts on customerId property. 


# Create a Uni

1. Login to Vendia Share [here](https://share.vendia.net/login). 

Don’t have a login, you can sign up for one [here](https://share.vendia.net/). 

2. Create Uni

Click the 'Create Universal Application' button on the top-right. Next, use the `Create your own` option. 

3. Fill out details in the Uni Creation Wizard. 

1. **Step 1:** Give your Uni a name. Since this Uni will be owned and operated by the CRM team. I will give it the name ‘CRM Uni’. Click ‘Next’
2. **Step 2:** Fill out the following information to create a Uni node. 

```
Node Name: "CRM Node". // you can change the name.
Node Description: "Node dedicated to the CRM Domain". // You can change the description.
Cloud Server Provider: "AWS".
Node Region:"us-east-1". //you can change it to other regions.
Auth Option: "Vendia User". // Let's use Vendia User
```


3. **Step 3:** provide the Uni Schema. copy and paste the Uni schema from the schema.json file in the schema folder. I have already designed a the schema based on model we described above. But, this is the step in which you will spend most time while constructing Uni for your business. 

   Let’s review few important things in the schema that you will reuse in most of your Unis.

Indexes on the “CustomerAccount”.

```
"x-vendia-indexes": {
       "CustomerAccountIdIndex": [
           {
               "type": "CustomerAccount",
               "property": "customerId"
           }
       ]
   }

```
The Singleton Value Object ‘Schema Owner’. You can store schema and Uni metadata in it.

```
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

The ‘CustomerAccount’ entity and its structure.

```
"CustomerAccount": {
           "description": "Customer Account",
           "type": "array",
           "items": {
               "type": "object",
               "properties": {
		…
```


The nested complex type objects in the ‘CustomerAccount’ such as ‘ContactDetails’.


```
"contactDetails": {
                       "description": "customer contact details",
                       "type": "object",
                       "properties": {
                           "email": {
                               "description": "email Id of a customer",
                               "type": "string"
                           },
                           "phone": {
                               "description": "phone number of a customer",
                               "type": "string"
                           }
                       }
                   }
```

The required constraint on the customerId, firstname, lastName, and on the next complex type address, and property of address i.e zipcode.


```
"required": [
                    "customerId",
                    "firstName",
                    "lastName",
                    "address"
                ]
```

4. Press “Create”. Wait for 5 minutes for Share to finish Uni provisioning.

After Uni Provisioning is complete. You will see that the Uni with the name you chose will appear in the running status on the home page. 

# Explore the Uni

Click the Uni you just created. Click on the ‘Entity Explorer’. You will notice ‘Schema Owner’ and CustomerAccount’ Entity’ on the left. 

Schema Owner is a Value Object; it’s a singleton value object with no unique identifier. You will use it to keep track of who is the Uni `owner` and `emailId` of the group owning it. It is good to have this information in the Uni itself. Click Edit and fill the `group` and `emailId` properties.

Let’s create a customer record. Click ‘CustomerAccount’ entity. Click ‘Create Customer Account’. Enter customer account details. For CustomerId, pick a number. I use the [10001,10002…] series for testing. In the real world, either you will have your own sequence generator for customerId, or you will use the customerId from enterprise source of truth systems elsewhere, or you can use the id property value automatically created by Uni for a customer record. 

You can see all the customer account records you created under the ‘CustomerAccount’ entity. You can edit a specific record, change address, and in the version history, you will see both the current and previous state of the customer account you just edited. This is the ledger aspect of the Uni. It keeps both the current and previous versions of the record. 

What you did do using Entity Explorer. You can do the same through GraphQL Explorer. You don’t have to type every single command and attribute to write a GraphQL query. You can build GraphQL by selecting the commands and attributes in the ‘Schema Explorer’.

Let’s create a new customer record and see whether our required constraint on customerId,firstname,lastname, address{zipcode} is working or not?

Navigate to GraphQL explorer, it has three sections, the left section is GraphQL commands for your Uni, you can use it to build a new query or mutation. In the middle section you will write your query and press the green button on the top to run it. And, you will see the results(success/error) of the query on the right-hand section. 

Try following queries in the GraphQL explorer and note the difference between results. 

Mutation with required ‘zipcode’ property. 


```
mutation m{
  add_CustomerAccount_async(input: {customerId: "10001", firstName: "Jay", lastName: "Pipes"}) {
    error
  }
}
```


**Result:** It will throw an exception. 

Mutation with required properties. 


```
mutation m {
  add_CustomerAccount_async(input: {customerId: "10001", firstName: "Jay", lastName: "Pipes", contactDetails: {}, address: {zipcode: 94568}}) {
    error
  }
}
```


**Result:** It will execute successfully. 

Take a moment now, and compare, the effort it took for you to create a Uni, and run queries. You see ease of use relative to other data platform that you use. The effort to deploy the same schema won’t be much different either. You can pump more data into your Uni and you don’t have to worry about scaling. Vendia will manage it for you. 


# What did we learn?

1. How to create a Uni?
2. How to create a Singleton Value Object?
3. How to enforce a required constraint on a property?
4. How to model a data aggregate in Uni for a given Bounded Context?
5. How to define indexes in the schema?
6. How to create an Aggregate and an Entity in the schema?
7. How to use GraphQL to create entity records?
8. How to use Entity Explorer to create entity records?
9. How easy it is to deploy a Uni schema to create a Uni?

Let’s move on to Patern 2 now. 
