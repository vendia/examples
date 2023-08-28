# Milestone 6a - Enrichment Input Query & Ouput Mutation

## Answer to Questions

* With above query and mutation, how can we test to see they actually work and syntax-error free?

  * We can test out our sample query and mutations through Vendia GraphQL explorer. Simply past the whole thing in the editor. Then provide the variables under the `variable` tab as they would come from inocation and/or lambda response. Sample variable for the mutation looks like this:
```
{
  "id": "0000000000000100",
  "additionalResources": {}
}
```