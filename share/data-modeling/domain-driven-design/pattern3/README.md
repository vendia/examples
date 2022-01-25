# Pattern 3: Two Domains, Multiple Bounded Contexts, and a Single Uni

**Prerequisite:**Please familiarize yourself with pattern 1 and pattern 2 before you practice pattern 3. 


# Scenario

In pattern 3 we will remodel what we implemented in pattern 2. The  Marketing team now wants to take full control of customer profile data and wants to further enrich it by bringing in more data from customer social media feeds. But, still, wants to use the same Uni. 


# Modeling

In this scenario we see two separate domains trying to leverage a single Uni. The CRM domain, and the Marketing domain. However, Marketing now wants full control of ‘CustomerProfile’. Marketing needs a Write Access to ‘CustomerProfile’ and Read Access to ‘CustomerAccount’. CRM will offload ‘CustomerProfile’ to Marketing and will retain ownership of ‘CustomerAccount’. Now we see Bounded Context2(‘CustomerProfile’) governed by the Marketing domain instead of CRM. This difference doesn’t change the implementation. There is no difference in Uni implementation. The only difference is that Marketing instead of using Read-Only Node for ‘CustomerAccount’ and ‘CustomerProfile’  will now need Write Node for ‘CustomerProfile’.  CRM will need  Read-Only Node for ‘CustomerProfile’ and Write Node for ‘CustomerAccount’. 


# Create a Uni

1. Login to Vendia Share [here](https://share.vendia.net/login). 

	a. Don’t have a login, you can sign up for one [here](https://share.vendia.net/). 

2. Create Uni

	a. Click the 'Create Universal Application' button on the top-right. Next, use the ‘Create your own option. 

3. Fill out details in the Uni Creation Wizard. 



1. Step 1: Give your Uni a name. You can name it ‘CRMandMarketing’. Click Next. 
2. Step 2: Fill out the following information to create Nodes. Node 1 and Node 2. 

    *Node 1 [ READ/WRITE on Customer Account] and [READ Only on CustomerProfile]*


    ```
Node Name: "CRM". // you can change the name.
Node Description: "Node dedicated Marketing". // You can change the description.
Cloud Server Provider: "AWS"
Node Region:"us-east-1"// you can change it
Auth Option: "Vendia User". // Let's use Vendia User
```



    *Node 2 [ READ Only on Customer Account] and [READ/WRITE on CustomerProfile]*


    ```
Node Name: "Marketing". // you can change the name.
Node Description: "Node dedicated to Marketing". // You can change the description.
Cloud Server Provider: "AWS"
Node Region:"us-east-1". //you can change it
Auth Option: "Vendia User". // Let's use Vendia User
```


3. Step 3: provide the Uni Schema. Copy and paste the Uni schema from the schema.json file in the schema folder. The schema is the same as the one you used in pattern 2. The difference is in the ‘aclnput’ you will use in the query to show and hide records, convert records into write or read-only. 
4. Press “Create”. Wait for 5 minutes for Share to finish Uni provisioning. 

After Uni Provisioning is complete. You will see that the Uni with the name you choose will appear in the running status on the home page. In ‘My Nodes’ you will see two Nodes: CRM and Marketing. 


# Explore the Uni

Let’s test how permission boundaries will work between CRM and Marketing node. 

Using the CRM Node. Add the following mutation using GraphQL explorer. 


```
mutation m {

  put_CustomerAccount_async(id: "", input: {address: {zipcode: 95678}, customerId: "1001", firstName: "Jay", lastName: "Pipes"}, 
aclInput: {acl: {principal: {nodes: "*"}, operations: READ}})


}
```


Use Marketing Node Entity Explorer to edit the above CustomerAccount record and try to change the last name from ‘Pipes’ to ‘Jaeger’. You will see an error. 

Using the Marketing Node. Add the following mutation using GraphQL explorer. 


```
mutation m {

  add_CustomerProfile_async(input: {DMAbyZip: "95678", Psychographic: {goals: "quit smoking", habits: "smoking", pains: "back pain"}, customerId: "1001"}, 
aclInput: {acl: {principal: {nodes: "*"}, operations: READ}})

}
```


Use CRM Node Entity Explorer to edit the above ‘CustomerProfile’ record and try to change the goal from ‘quit smoking’ to ‘learn tennis’. You will see an error. 

If you want a more clean boundary between CRM and Marketing. ‘CustomerAccounts’ should not be visible to Marketing and ‘CustomerProfile’ should not be visible to CRM.

Replace ‘aclInput’ in add queries above with the following.

CRM Node will add ‘CustomerAccount’ with following ‘aclInput’


```
aclInput: {acl: {principal: {nodes: "CRM"}, operations: ALL}}
```


Marketing Node will add ‘CustomerProfile’ with following ‘aclInput’


```
aclInput: {acl: {principal: {nodes: "Marketing"}, operations: ALL}}
```


Test out whether the records added with the above ‘aclInput’ are visible to other parties. 


# What did we learn?



1. How to model two domains on a single Uni with different access levels for each domain on different bounded contexts?