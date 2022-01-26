# Pattern 4: Multiple Domain, Multiple Bounded Contexts, and Multiple Unis

**Prerequisite:** Please familiarize yourself with Patterns 1, 2, 3 before you practice Pattern 4. 


## Scenario

CRM business unit continue to evolve and now collect more data on customers. In parallel, Marketing is getting more specialized in its analytics needs. Marketing wants more control and wants to bring in more data from other business units such as order history, loyalty, etc. Not all data is relevant for the CRM Domain. Therefore, CRM Team is not on board to continue to steward data for Marketing.  


## Modeling

The business needs of both domains CRM and Marketing have a common Bounded Context of the customer. But, both domains have divergent business needs. It's time to split the Uni into two. Now, you will need two Unis instead of one. This is the pattern we expect to see in large enterprise organizations with fully developed and scaled domain functions. 

Consideration for Multiple Uni

1. The Standard free tier doesn’t allow you to create more than one Uni. You will need an Individual tier or an Enterprise tier. 
2. There is a cost implication(license cost) in creating a second dedicated Uni for Marketing Team.

Pattern 4 will function like Pattern 1. However, in this blog, I will provide a different schema(with new Bounded Context) for you to try. You can try out the new Marketing Uni schema with one Uni. You can do it in the Standard tier. 

## Create a Uni

1. Login to [Vendia Share](https://share.vendia.net/login). 

Don’t have a login, you can [Sign Up](https://share.vendia.net/). 

2. Create Uni

Click the `Create Universal Application` button on the top-right. Next, use the `Create your own` option. 

3. Fill out details in the Uni Creation Wizard. 

1. **Step 1:** Give your Uni a name. Since this Uni will be owned and operated by the Marketing team, give it a Name ‘test-Marketing-<your-unique-indentifier>’.
2. **Step 2:** Fill out the following information to create a Uni node. 

```
Node Name: "Marketing". // you can change the name.
Node Description: "Node dedicated to Marketing". // You can change the description.
Cloud Server Provider: "AWS"
Node Region:"us-east-1". //you can change it
Auth Option: "Vendia User". // Let's use Vendia User
```

3. **Step 3:** provide the Uni schema. Copy and paste the Uni schema from the schema.json file in the schema folder.

Make a note of the new ‘CustomerLoyality’ aggregate(a.k.a Root Entity) added to the schema.

```json
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


You will also notice that ACLs are not present because each domain has its own dedicated Uni now. 


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


Press `Create`. Wait for 5 minutes for Share to finish Uni provisioning.

After Uni Provisioning is complete. You will see that your Uni shows in '`RUNNING` status in the home page. 


## Explore the Uni

You can try the same activities that you tried in the Pattern 1 on the Marketing Uni for more practice. But, the pattern will function exactly the same way. 
            
## Clean Up
If you are operating in a Standard tier and plan to continue with your own Uni for your on business problem, delete your Uni. Standard tier allows you to create only one Uni. You can do it from the `Uni Settings`. Navigate to your Uni>`Uni Settings`>Scroll down to the `Danger Zone` and you will find the `Delete Uni` command.

## What did did we learn?

1. The considerations for one Uni versus two Unis for two different Domains?
            
## What's next?
First, I want to congraluate you for coming this far. Since you have worked so hard and showing dedication. It's time to build a Uni for your business problem now and show your skills on real problems. You don't need a big team to do it. You can do it as a side-hustle. You need help with your Uni, enegage with us at [Vendia Discorse](https://community.vendia.net/c/resources/8) or if you have a story to tell tag us on Twitter[@VendiaHQ]( https://twitter.com/VendiaHQ).
