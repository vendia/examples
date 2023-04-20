# Milestone 7b - Validation Business Logic in Lambda

## Answer to Questions

* Can ACL be changed based on our business logic in lambda function?

  * Yes. In our sample code, we can see that the ACL value being returned depends on the state it is on. So we can control data access based on our business logic. The different ACLs appeared were these:

```
[
    { principal: {nodes: "LenderNode"}, operations: ["ALL", "UPDATE_ACL"] },
    { principal: {nodes: "ServicerNode"}, operations: ["READ"] }
]
```

and 

```
[
    { principal: {nodes: "LenderNode"}, operations: ["ALL", "UPDATE_ACL"] }
]
```