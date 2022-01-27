# Pattern 2: Single Domain, Multiple Bounded Contexts, and a Single Uni

**Prerequisite:** Please familiarize yourself with the [Pattern 1](examples/design-patterns/domain-driven-design/pattern1/README.md) before you review the [Pattern 2](examples/design-patterns/domain-driven-design/pattern2/README.md).


## Scenario

In the Pattern 1 CRM Team created a Uni for the `CustomerAccount` entity. Let’s say requirements were different. We will remodel Uni with the Pattern 2. The CRM Team now wants to create another entity to track customer profiles(likes, habits etc.). The Marketing Team is interested in the customer profile dataset but doesn't want to build a separate Uni. Marketing will use customer profile data for customer research but expect the CRM Team to continue to manage and own the customer profile dataset.

## Modeling

In this scenario you will notice two separate domains. CRM domain and the Marketing domain. Since, Marketing Team doesn’t want to own any data and expects the CRM domain to build and own the `CustomerProfile` along with the `CustomerAccount`, you will model all datasets in the same Uni. You will notice two Bounded Contexts:`CustomerAccount` and `CustomerProfile`. However, Marketing Team will only do Read-Only activities on the `CustomerAccount` and `CustomerProfile` Bounded Contexts in the Uni so the CRM Team decided to provide a Read-Only copy to the Marketing Team for customer research and analytics. 

If you are confused between `Bounded Context`, `Entity`, and the `Aggregate`. These terms correlate 1:1 for the purpose of this exercise. I will use the term `Entity` here to mean `Root Entity` which is an `Aggregate` in DDD. And, `Bounded Context` can have one or more than one `Entity`. 


## Create a Uni

1. Login to [Vendia Share](https://share.vendia.net/login). 

  Don’t have a login, you can [Sign Up](https://share.vendia.net/) now. 

2. Create a Uni

  Click the `Create Universal Application` button on the top-right. Next, use the `Create your own` option. 

3. Fill out details in the Uni Creation Wizard. 

**Step 1:** Give your Uni a name. Since this Uni will be owned and operated by the CRM team. I will give it the name ‘test-CRM-<append-unique-identifier>’. Remember, A Uni can hold more data models for more than one Bounded Context such as a `CustomerAccount`. 

**Step 2:** Fill out the following information to create a Uni node. You will create two nodes: Node1 and Node2. 

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

**Step 3:** Provide the Uni schema. Copy and paste the Uni schema from the schema.json file in the schema folder.

Let’s review new things we added to the schema that is different from the Pattern 1. 

Check out the new `CustomerProfile` entity.


```json
"CustomerProfile": {
           "description": "Customer Profile",
           "type": "array",
           "items": {
               "type": "object",
               "properties":...
```


Notice the `x-vendia-acls` we added at the top of the schema. You will use it to enforce READ/WRITE visibility at the record level by allowing the consumer to add/update a record with 'aclInput` property. You will notice the structure of the 'aclInput` property in the next section. The `x-vendia-acls` `type` property should match the entity names - `CustomerAccount` and `CustomerProfile` - you used in the schema.


```json
"x-vendia-acls": {
       "CustomerAccountAcl": {
           "type": "CustomerAccount"
       },
       "CustomerProfileAcl": {
           "type": "CustomerProfile"
       }
   }

```

You will specify the `aclInput` when you insert a new record.  We will use the below script in the GraphQL add command later.

```graphql
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

Notice the `customerId` property  and how it links `CustomerAccount` and `CustomerProfile`. You can use this pattern to avoid the eager loading of two separate aggregates. You don’t have to load both `CustomerProfile` and `CustomerAccount` at the same time.


```json
"CustomerProfile": {
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

Notice `zipcode` in `CustomerAccount{address{zipcode}` and `DMAbyZip` in the `CustomerProfile`. Designated Marketing Area(DMA) is marketing geo that is identified by the zipcode of the location. When a customer moves, the CRM Team updates the customer address in the ‘CustomerAccount{address{zipcode}} property. You can use `vendia_transaction` tag in the GraphQL command to update both the `zipcode` and `DMAbyZip` in the same transaction. You will try it later.

4. Press `Create`. Wait for 5 minutes for Share to finish Uni provisioning. 

 After Uni Provisioning is complete. You will see that the Uni with the name you choose will appear in the `RUNNING` status on the home page. You will notice two different nodes under ‘My Nodes’. `CRMReadWriteNode` and `MarketingReadOnlyNode`. 

# Explore the Uni

I hope you already know how to use `Entity Explorer` and `GraphQL Explorer` from Pattern 1 to create new records. 

In the `MyNodes` click the `CRMReadWriteNode` and navigate to `GraphQL Explorer`. Let’s insert a new `CustomerAccount` using `GraphQL Explorer`. Notice the `aclInput` highlighted in bold. `CRMReadWriteNode` will have read and write permission on this record and `MarketingReadOnlyNode` will have read-only access to it. 


```graphql
mutation m {

  add_CustomerAccount_async(id: "", input: {address: {zipcode: 95678}, customerId: "1001", firstName: "Vikrant", lastName: "Kahir"}, 
aclInput: {acl: {principal: {nodes: "*"}, operations: READ}})

  add_CustomerProfile_async(input: {DMAbyZip: "95678", Psychographic: {goals: "quit smoking", habits: "smoking", pains: "back pain"}, customerId: "1001"}, 
aclInput: {acl: {principal: {nodes: "*"}, operations: READ}})


}
```
Let’s test whether permission really works. 
* Switch to `MarketingReadOnlyNode`
* Navigate to `Entity Explorer`>`CustomerAccount`>`[click record you just added`]>`Edit`
* Update `zipcode` with a different value and press `Save`.

You will notice an unauthorized error message. 

Now navigate back to `CRMReadWriteNode` You will update both  `zipcode` and `DMAbyZip` in a single transaction using GraphQL `vendia_trasaction` tag. 

Before you update the `zipcode` you will need the `_id` property of the `CustomerAccount` and `CustomerProfile` that you added. You can find it easily in `Entity Explorer` for each entity. Note it down, you will use it to prepare a GraphQL command. 

  ```
_id: &lt;?CustomerAccount>

_id:&lt;?CustomerProfile>
```

```graphql
mutation m @vendia_transaction {
  update_CustomerAccount_async(id: "<?insert_id(CustomerAccount) here>", input: {address: {zipcode: 88888}})
  update_CustomerProfile_async(id: "<?insert _id(CustomerProfile) here>", input: {DMAbyZip: "88888"})
}

```

Let’s verify whether the above transactions were executed in the same block. Execute the following query and in the results scroll down to the last block and you will notice both mutations executed with the same block id. 


```graphql
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


```json
          "blockId": "00000000000000X",
          "transactions": [
            {
              "mutations": [
                "mutation m{update_CustomerAccount_async: updateSelf_CustomerAccount(id:\"xxxxxxxxxxxxxxxx\",input: {address: {zipcode: 88888}}){error}\nupdate_CustomerProfile_async: updateSelf_CustomerProfile(id:\"xxxxxxxxxxxxxxxx\",input: {DMAbyZip: \"88888\"}){error}}"

```
## Clean Up
If you are operating in a Standard tier and plan to continue with Pattern 3, delete your Uni. Standard tier allows you to create only one Uni. You can do it from the `Uni Settings`. Navigate to your Uni>`Uni Settings`>Scroll down to the `Danger Zone` and you will find the `Delete Uni` command.

## What did you learn?

1. How to model two Bounded Contexts in the same Uni?
2. How to create a read-only node using a single Uni for the second party?
3. How to link two entities together using a single customer identity?
4. How to transact on two co-related properties in two different two entities together in a single transaction?

## What's next?
Time to review [Pattern 3](examples/design-patterns/domain-driven-design/pattern3/README.md) now. 
