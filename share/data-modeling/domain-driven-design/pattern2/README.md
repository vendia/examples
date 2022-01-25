# Pattern 2: Single Domain, Multiple Bounded Contexts, and a Single Uni

**Prerequisite:**Please familiarize yourself with pattern 1 before you practice pattern 2.


# Scenario

In Pattern 1 CRM team created a Uni for ‘CustomerAccount’. Let’s say requirements were different. We will remodel uni with pattern 2. The CRM team created another entity to track customer profiles(likes, habits etc.). The Marketing team is interested in the customer profile dataset but doesn't want to build a separate Uni. Marketing will use customer profile data data for customer research but expect the CRM domain to continue to manage it.


# Modeling

In this scenario we see two separate domains trying to leverage a single Uni. CRM domain and the Marketing domain. Marketing doesn’t want to own any data and expects the CRM domain to build and own ‘CustomerProfile’ along with the ‘CustomerAccount’. Therefore, the CRM team will have to model two ‘Bounded Context’ in the same Uni. ‘CustomerAccount’ and ‘CustomerProfile’. However, Marketing will only do Read-Only activities on Uni so the CRM team decided to provide a Read-Only copy to Marketing for customer research and analytics. 


# Create a Uni

1.Login to Vendia Share [here](https://share.vendia.net/login). 

a. Don’t have a login, you can sign up for one [here](https://share.vendia.net/). 

2.Create Uni

b.Click the 'Create Universal Application' button on the top-right. Next, use the ‘Create your own’ option. 

3.Fill out details in the Uni Creation Wizard. 

**Step 1:** Give your Uni a name. Since this Uni will be owned and operated by the CRM team. I will give it the name ‘CRM Uni’. Remember, A Uni can hold more data models for more than one bounded context such as a customer account. 

**Step 2:** Fill out the following information to create a Uni node. You will create two nodes - Node1 and Node2. 

**Node 1**
```
Node Name: "CRMReadWriteNode". // you can change the name.
Node Description: "Node dedicated to CRMActivities". // You can change the description.
Cloud Server Provider: "AWS"
Node Region:"us-east-1". //you can change it
Auth Option: "Vendia User". // Let's use Vendia User
```

**Node 2**
```
Node Name: "MarketingReadOnlyNode". // you can change the name.
Node Description: "Node dedicated to Marketing Activities". // You can change the description.
Cloud Server Provider: "AWS"
Node Region:"us-east-1". //you can change it
Auth Option: "Vendia User". // Let's use Vendia User
```

**Step 3:** provide the Uni Schema. Copy and paste the Uni schema from the schema.json file in the schema folder._

Let’s review new things we added to the schema that is different from pattern 1. 

Check out the new ‘CustomerProfile’ aggregate.


```
CustomerProfile": {
           "description": "Customer Profile",
           "type": "array",
           "items": {
               "type": "object",
               "properties":...
```


Notice the ACLs we added on the top of the schema that we will use to enforce READ/WRITE visibility at the record level. The type should match the aggregate names you used in the schema. _


```
"x-vendia-acls": {
       "CustomerAccountAcl": {
           "type": "CustomerAccount"
       },
       "CustomerProfileAcl": {
           "type": "CustomerProfile"
       }
   }

```

You will specify the ACL when you insert a new record.  We will use the below script in the GraphQL add command later. _

```
aclInput: {
      acl: [
        {
          principal: {
            nodes: [ "*" ]
          },
          operations: [ READ ]
        }
      ]
    }

```

Notice the ‘CustomerId’ property  and how it links ‘CustomerAccount’ and ‘CustomerProfile’. You can use this pattern to avoid the eager loading of two separate aggregates. You don’t have to load both ‘CustomerProfile’ and 'CustomerAccount’ at the same time. _


```
CustomerProfile": {
           "description": "Customer Profile",
           "type": "array",
           "items": {
               "type": "object",
               "properties": {
                   "customerId": {
                       "description": "The unique identifier for a customer and used as Forgien Key between CustomerAccout and CustomerProfile",
                       "type": "string"
                   }

```

Notice ‘zipcode’ in CustomerAccount Address and ‘DMAbyZip’ in ‘CustomerProfile’. Designated Marketing Area(DMA) is marketing geo that is identified by zipcode of the location. When a customer moves, the CRM team will update the address in the ‘CustomerAccount’ Address[zipcode] property. You can use vendia_transaction tag in GraphQL command to update zipcode both on ‘CustomerAccount’ and ‘CustomerProfile’ in the same transaction. You will try it later.

**Step 4:** Press “Create”. Wait for 5 minutes for Share to finish Uni provisioning. 

 After Uni Provisioning is complete. You will see that the Uni with the name you choose will appear in the running status on the home page. You will notice two different Nodes under ‘My Nodes’. ‘CRMReadWriteNode’ and MarketingReadOnlyNode’. 

# Explore the Uni

I hope you already know how to use Entity Explorer and GraphQL explorer to create new records. 

In the ‘MyNodes’ click the ‘CRMReadWriteNode’ and navigate to GraphQL explorer. Let’s insert a new ‘CustomerAccount’ using GraphQL Explorer. Notice the ‘aclInput’ highlighted in bold. ‘CRMReadWriteNode’ will have read and write permission on this record and ‘MarketingReadOnlyNode’ will have read-only access to it. 


```
mutation m {

  add_CustomerAccount_async(id: "", input: {address: {zipcode: 95678}, customerId: "1001", firstName: "Vikrant", lastName: "Kahir"}, 
aclInput: {acl: {principal: {nodes: "*"}, operations: READ}})

  add_CustomerProfile_async(input: {DMAbyZip: "95678", Psychographic: {goals: "quit smoking", habits: "smoking", pains: "back pain"}, customerId: "1001"}, 
aclInput: {acl: {principal: {nodes: "*"}, operations: READ}})


}
```


Let’s test whether permission really works. Switch to ‘MarketingReadOnlyNode’, 


* navigate to Entity Explorer>CustomerAccount>[click record you just added]>Edit
* Update ‘zipcode’ with a different value and Save

You will notice an unauthorized error message. 

Now navigate back to ‘CRMReadWriteNode’ You will update the zipcode on both ‘CustomerAccount’ and ‘CustomerProfile’ in a single transaction using GraphQL vendia_trasaction tag. 

Before you update the zipcode you will need the ‘_id’ property of the ‘CustomerAccount’ and ‘CustomerProfile’ you added. You can find it easily in Entity Explorer for each Entity. Note it down, you will use it to prepare a GraphQL command. 

_id: &lt;?CustomerAccount>

_id:&lt;?CustomerProfile>


```
mutation m @vendia_transaction {
  update_CustomerAccount_async(id: "<?insert _CustomerAccount_id here>", input: {address: {zipcode: 88888}})
  update_CustomerProfile_async(id: "<?insert _CustomerProfile_id here>", input: {DMAbyZip: "88888"})
}

```

Let’s verify whether the above transactions were executed in the same block. Execute the following query and in the results scroll down to the last block and you will notice both mutations executed with the same block id. 


```
query listBlocks {
  listVendia_BlockItems {
    Vendia_BlockItems {
      blockId
      transactions {
        mutations
      }
    }
  }
}
```


**Query Results**


```
          "blockId": "00000000000000X",
          "transactions": [
            {
              "mutations": [
                "mutation m{update_CustomerAccount_async: updateSelf_CustomerAccount(id:\"xxxxxxxxxxxxxxxx\",input: {address: {zipcode: 88888}}){error}\nupdate_CustomerProfile_async: updateSelf_CustomerProfile(id:\"xxxxxxxxxxxxxxxx\",input: {DMAbyZip: \"88888\"}){error}}"

```

# What did we learn?

1. How to model two Bounded Contexts as two data aggregates in the same Uni?
2. How to create a Read-Only Node using a single Uni?
3. How to link two entities together using a single customer identity?
4. How to execute two entities together in a single transaction?

Let's try pattern 3 next. 
