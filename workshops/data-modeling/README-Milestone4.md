# Milestone 4 - Define Indexes

## Goal
In this milestone, we will test out indexes in Vendia Share. If you have already created unis previously using our previous schemas, you might or might not notice that you were not able to order your output based on certain fields. We can now add indexes and ordering based on certain fields becomes possible.

## Vendia Indexes
The purpose of indexes is for efficient queries on arbitrary attributes. Indexes can also be used to sort the results of list queries via the GraphQL order argument. It's rather straight forward to define indexes in Vendia Share. You need a special field called `x-vendia-indexes` at the root level. Below is a sample of index to be able to order Tickets based on `ticketNumber` in our previous schema:

```
  "x-vendia-indexes": {
    "TicketPaymentIndex": [
      {
        "type": "Ticket",
        "property": "ticketNumber"
      }
    ]
  }
```

With above index added, we can now query `Ticket` and order it by `ticketNumber`.

## Do it on your own
Based on our sample, add an index so that we can order our output based on `price`. Once done, compare it with our [Schema](./uni_configuration/milestone4-schema.json).


## Key Takeaways

Congratulations. You've successfully reached Milestone 4!

* To add indexes in our data model, we must add `x-vendia-indexes` at root level of our schema.
* We can use index to order our output based on certain properties.

For complete documentation of Vendia Indexes, read our [developer documentation](https://www.vendia.com/docs/share/data-modeling#indexes).

Next up, [Milestone 5](README-Milestone5.md).