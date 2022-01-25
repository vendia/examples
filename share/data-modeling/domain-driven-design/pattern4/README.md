# Pattern 4: Multiple Domain, Multiple Bounded Context, and Multiple Unis

**Prerequisite:**Please familiarize yourself with patterns 1, 2, 3 before you practice pattern 4. 


# Scenario

CRM functions continue to evolve and now collect more data on customers. In parallel, Marketing is getting more specialized in its analytics needs. Marketing wants more control and wants to bring in more data from other sources such as order history, loyalty, etc. Not all data is relevant for the CRM domain. Therefore, CRM is not on board to continue to steward data for Marketing.  


# Modeling

The business needs of both domains CRM and Marketing have a common bounded context of the customer. But, both domains have divergent business needs too. It's time to split the Uni into two. Now, you will need two Unis instead of one. This is the pattern we expect to see in large enterprise organizations with fully developed and scaled domain functions. 

Consideration for Multiple Uni



1. The free tier doesn’t allow you to create more than one Uni. You will need an Individual tier or an enterprise tier. 
2. There is a cost implication(license cost) in constructing a second dedicated Uni. 

Pattern 4 will function like pattern 1. However, I will still provide a different schema for you to try. You can try out the new Marketing Uni schema with one Uni. 


# Create a Uni

1. Login to Vendia Share [here](https://share.vendia.net/login). 

	a. Don’t have a login, you can sign up for one [here](https://share.vendia.net/). 

2. Create Uni

	a. Click the 'Create Universal Application' button on the top-right. Next, use the ‘Create your own option. 

3. Fill out details in the Uni Creation Wizard. 



1. Step 1: Give your Uni a name. Since this Uni will be owned and operated by the Marketing team, give it a Name ‘Marketing’.
2. Step 2: Fill out the following information to create a Uni node. 

    ```
Node Name: "Marketing". // you can change the name.
Node Description: "Node dedicated to Marketing". // You can change the description.
Cloud Server Provider: "AWS"
Node Region:"us-east-1". //you can change it
Auth Option: "Vendia User". // Let's use Vendia User
```


3. Step 3: provide the Uni Schema. Copy and paste the Uni schema from the schema.json file in the schema folder.

Make a note of the new ‘CustomerLoyality’ aggregate added to the schema.


```
"CustomerLoyalty": {
            "description": "Customer Loyalty",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "customerId": {
                        "description": "The unique identifier for a customer",
                        "type": "string"
                    },
                    "Loyalty": {
                        "description": "customer loyalty attributes",
                        "type": "object",
                        "properties": {
                            "nps": {
                                "description": "Net Promoter Score",
                                "type": "string"
                            },
                            "clv": {
                                "description": "Customer Lifetime Value",
                                "type": "string"
                            },
                            "cli": {
                                "description": "Customer Loyalty Index",
                                "type": "string"
                            },
                            "ces": {
                                "description": "Customer Engagement Score",
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
```


You will also notice that ACLs are not present because each domain has its own dedicated Uni.


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



   Press “Create”. Wait for 5 minutes for Share to finish Uni provisioning.

After Uni Provisioning is complete. You will see that the Uni with one Marketing Node is ready for business transactions. 


# Explore the Uni

You can try the same activities that you tried in pattern 1 on Marketing Uni for more practice. But, the pattern will function exactly the same way. 


# What did did we learn?



1. The considerations for one Uni versus two Unis for two different domains?