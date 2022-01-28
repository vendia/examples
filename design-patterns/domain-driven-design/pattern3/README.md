# Pattern 3: Two Domains, Multiple Bounded Contexts, and a Single Uni

**Prerequisite:** Please familiarize yourself with the [Pattern 1](../pattern1/README.md) and the [Pattern 2](../pattern2/README.md) before you practice the Pattern 3. 


## Scenario

In the Pattern 3 we will remodel what we implemented in the Pattern 2. The  Marketing Team now wants to take full control of customer profile data and wants to further enrich it by bringing in more data from the customer social media feeds. But, still, wants to use the same Uni. 


## Modeling

Just like you noticed in the Pattern 2, again, in this scenario you will see two separate domains trying to leverage a single Uni. The CRM domain, and the Marketing domain. However, Marketing now wants full control of ‘CustomerProfile’. Marketing needs a write access to `CustomerProfile` and read access to the `CustomerAccount`. CRM will offload `CustomerProfile` to the Marketing team and will retain ownership of ‘CustomerAccount’ but will do it using the same Uni owned by the CRM team. Now we see Bounded Context2(`CustomerProfile`) governed by the Marketing Team instead of the CRM team. This difference doesn’t change the implementation you noticed in the Pattern 2. There is no difference in the Uni implementation. The only difference is that Marketing instead of using Read-Only node for the `CustomerAccount` and the `CustomerProfile` will now need write node for `CustomerProfile`.  The CRM Team will need read-only node for `CustomerProfile` and write node for the `CustomerAccount`. 

If you are confused between Bounded Context, Entity, and the Aggregate. These terms correlate 1:1 for the purpose of this exercise. I will use the term Entity here to mean Root Entity which is an Aggregate in DDD. And, Bounded Context can have one or more than one Entity.


## Create a Uni

1. Login to [Vendia Share](https://share.vendia.net/login). 

Don’t have a login, you can [Sign Up](https://share.vendia.net/). 

2. Create a Uni

Click the `Create Universal Application` button on the top-right. Next, use the `Create your own` option. 

3. Fill out details in the Uni Creation Wizard. 

**Step 1:** Give your Uni a name. You can name it ‘test-CRMandMarketing-append-unique-suffix`. Time to get creative and choose a unique suffix that you will need for your Uni name. Reaplace it with the `append-unique-suffix` in the proposed Uni name. Click `Next`. 
  
**Step 2:** Fill out the following information to create nodes: Node 1 and Node 2. 

*Node 1* [ READ/WRITE on the `CustomerAccount`] and [READ Only on `CustomerProfile`]
  
```
Node Name: "CRM". // you can change the name.
Node Description: "Node dedicated Marketing". // You can change the description.
Cloud Server Provider: "AWS"
Node Region:"us-east-1"// you can change it
Auth Option: "Vendia User". // Let's use Vendia User
```

*Node 2* [ READ Only on the `CustomerAccount`] and [READ/WRITE on the `CustomerProfile`]

```
Node Name: "Marketing". // you can change the name.
Node Description: "Node dedicated to Marketing". // You can change the description.
Cloud Server Provider: "AWS"
Node Region:"us-east-1". //you can change it
Auth Option: "Vendia User". // Let's use Vendia User
```

**Step 3:** Provide the Uni schema. Copy and paste the Uni schema from the schema.json file in the schema folder. The schema is the same as the one you used in Pattern 2. The difference is in the ‘aclnput’ you used in the GraphQL query that you used to add new records. 
  
4. Press `Create`. Wait for 5 minutes for Share to finish Uni provisioning. 

You will see that your Uni will appear in the `RUNNING` status after Uni Provisioning is complete. In ‘My Nodes’ you will see two nodes: **CRM** and **Marketing**. 

## Explore the Uni

Let’s test how permission boundaries will work between the `CRM` and `Marketing` node. 

Using the `CRM` Node. Add the following mutation using `GraphQL Explorer`. 

```graphql
mutation m {

  put_CustomerAccount_async(id: "", input: {address: {zipcode: 95678}, customerId: "1001", firstName: "Jay", lastName: "Pipes"}, 
aclInput: {acl: {principal: {nodes: "*"}, operations: READ}})


}
```

Use `Marketing` node `Entity Explorer` to `Edit` the above `CustomerAccount` record and try to change the last name from `Pipes` to `Jaeger`. You will see an error. 

Using the `Marketing` node. Add the following mutation using GraphQL explorer. 

```graphql
mutation m {

  add_CustomerProfile_async(input: {DMAbyZip: "95678", Psychographic: {goals: "quit smoking", habits: "smoking", pains: "back pain"}, customerId: "1001"}, 
aclInput: {acl: {principal: {nodes: "*"}, operations: READ}})

}
```

Use `CRM` node `Entity Explorer` to `Edit` the above `CustomerProfile` record and try to change the goal from `quit smoking` to `learn tennis`. You will see an error. 

If you want a more clean boundary between CRM and Marketing Teams. Let's say `CustomerAccounts` should not be visible to the Marketing Team and `CustomerProfile` should not be visible to CRM Team.

Replace ‘aclInput’ in add queries above with the following.

`CRM` node will add `CustomerAccount` with the following `aclInput`

```graphql
aclInput: {acl: {principal: {nodes: "CRM"}, operations: ALL}}
```


`Marketing` node will add `CustomerProfile` with following `aclInput`


```graphql
aclInput: {acl: {principal: {nodes: "Marketing"}, operations: ALL}}
```


Test out whether the records added with the above `aclInput` are visible to the other parties. 
  
## Clean Up
If you are operating in a Standard tier and plan to continue with Pattern 4, delete your Uni. Standard tier allows you to create only one Uni. You can do it from the `Uni Settings`. Navigate to your Uni>`Uni Settings`>Scroll down to the `Danger Zone` and you will find the `Delete Uni` command.


## What did we learn

1. How to model two domains on a single Uni with different access levels for each Domain on different Bounded Contexts
  
## What's next?
  Time to practice the [Pattern 4](../pattern4/README.md) now. 
