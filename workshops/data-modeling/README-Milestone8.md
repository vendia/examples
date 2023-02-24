# Milestone 8 - Schema Evolution

So far, we've gone through multiple schema changes. But in real world, it will not change our schema like we did in milestones as the changes we made are not all evolvable in a uni in the orders we made them. 
Here are the limitations to schema evolution:
* New types and their associated properties can be added
* New properties of an existing type can be added
* New enum values of an existing property can be added

Vendia currently do not support destructive or breaking changes of schema:
* Existing types cannot be removed
* Existing properties cannot be removed
* Type changes to existing properties cannot be changed
* Required flag for an existing property cannot be changed

Knowing these is very important so we can better plan ahead on how we might evolve our schemas.

## Try it out

<details> 
<summary> Share UI </summary>

1. Go to your Uni.

2. Go to Schema tab.

3. Click Evolve Schema on top right

4. Remove a property in your schema

5. Click Next

6. Click Evolve

You will see that such action is not allowed.

</details>

<details> 
<summary> Share CLI </summary>

Ensure you are logged in on your share CLI.

1. Modify your original schema.json file
2. Run
```
share uni evolve --uni <your-uni> --schema <your-schema-file>
```
3. You should get failure response from CLI

</details>


## Key Takeaways

* Leave rooms for additive changes rather than removal
* You can evolve your schema on both web UI and share CLI

## Extra Note
* Vendia is working on property erasure related to schema evolution