# Milestone 5 - Define Access Control List

## Goal
In this milestone, we will briefly go through the requirements to set up ACLs in Vendia Share. As ACLs are not part of `Data Model`, we will not go deeper than what we need. For more comprehensive Vendia ACL documentations, check our official [documentation](https://www.vendia.com/docs/share/fine-grained-data-permissions) and [ACL repo](../../features/share/access-controls/data-access-controls/README.md).

## Vendia's Fine Grained Access Control
Vendia Share's ACL is not defined in the very beginning. They are defined when `mutation` is being made. So there are 2 things needed:

1. `x-vendia-acls` at top level of your schema
2. `mutation` being made with acl definitions in them

For this workshop, we will only do 1. For 2., refer to above links shared under "Goal" section.

Based on our previous json schema, assuming that all parties will have different access to our ticket object, then at top level we must have below included in our schema:

```
"x-vendia-acls": {
  "TicketAcl": {
    "type": "Ticket"
  }
}
```

**IMPORTANT*** ACL must be defined in the initial schema setup. It's not possible to update schema with `x-vendia-acls` in the future. So we must know which data will require access control in the future before we create the uni.

## Do it on your own
We don't yet have other high level items. But if we do, say `Booking` inside the schema other than Ticket what do you have to add inside your schema? Give it a try. And check out the answer below.

<details><summary>Answer</summary>

```
"x-vendia-acls": {
  "TicketAcl": {
    "type": "Ticket"
  },
  "BookingAcl": {
    "type": "Booking"
  }
}
```

</details>

## Key Takeaways

Congratulations. You've successfully reached Milestone 5!

* Vendia has acl available
* 2 things must be done to enable it:
    1. `x-vendia-acls` at root level of your schema
    2. `mutation` being made with acl definitions

Next up, [Milestone 6](README-Milestone6.md).