# Milestone 5 - Advanced Examples


In the previous sections, we covered some of the basics of GraphQL inside of Vendia. We took a look at the GraphQL Explorer in Vendia, covered the basics of queries and mutations, and covered some Vendia-specific additions such as files and data freshness. 

In this final section, we'll provide some examples of more advanced GraphQL use-cases that you will come across in future work.

## Tracability

One of the major benefits of a private ledger is that tracibility is built into platform as a core feature. In this example, we'll take a look at pulling the version history of an item and exaimining the block information of the item.

Lets go to the Entity Explorer in the DistributorNode and pick out our `Rocky Road Ice Cream`. Lets then change the margin to `3` instead of `2`. Finally, before we leave this view, copy the ID - we'll need it for our next query.

Open up the GraphQL Explorer for the DistributorNode, and run the following:

```
query RockyRoadHistory {
  list_ProductVersions(id: [YOUR ID GOES HERE], limit: 5) {
    versions {
      block
      transactions{
        _id
        _owner
        submissionTime
      }
    }
  }
}
```

A couple of things are going on here in this query.

* We set our `limit` to 5, so we'll only see 5 transactions on the chain here. 
    * Crawling through the transaction results on a single object with a lot of mutations, especially from different Node owners, can get complicated fast. We will cover paginating through results later on in this section. 

* We are pulling 5 *versions* of the `Rocky Road Ice Cream` object. For each version, we are pulling the *block* and the *transaction*.

* For each *transaction*, we are pulling the ID of that specific transaction, as well as who initiated the transaction.
    * Filtering on *_owner* or *submissionTime* are two easy ways to narrow down tracability depending on the situation. 

Lets try querying by block ID instead of object ID. Take a look at your results returned and pick a block to use in your query. 

Run the following query, substituing in your block number.

```
query BlockyRoadHistory {
  getVendia_Block(id: [BLOCK ID GOES HERE]) {
    blockId
    commitTime
    status
  }
}
```

Taking a look at the result, we have our blockID returned back at us for posterity. We also see when the block was commited, and we see the status of the block as discussed in the previous milestone.

Tracability is a core feature of Vendia, and the ability to work backwards through your data's history to uncover key insights in a few keystrokes is a remarkably powerful tool.

## Pagination

The final topic we are going to cover today is Pagination. So far in these milestones, we've been executing queries while limiting our results in order to be able to parse our results object-by-object. 

While this is convenient for the purpose of learning and becoming familiar with GraphQL, it is somewhat unrealistic. In a production environment, all of the API requests we've made over the course of our milestones would be executed within a fraction of a second on one Node out of multiple that are piping data in 24/7/365.

The Uni we've been working in does not have the data volume to require pagination. The basics are easy to grasp, regardless:

All **list_X** functions, defined at the time of Uni deployment, can return a `nextToken`. They also *can* take a `nextToken`. If your query has to pull a large number of objects, the `nextToken` returned will define the spot where the next run of the same query will pick up (if it is applied to the query). If all results can be returned in the initial query, then `nextToken` will be set to null.

Best practice is to always incluce `nextToken` in your **list_X** queries, and check the status of it when programmatically extracting results.

## Wrap Up!

Congrats on making it to the end of the Vendia GraphQL overview. In this workshop, we:

* Familiarized ourselves with the GraphQL explorer inside of Vendia Share.

* Covered the basics of GraphQL, understanding the differences between queries and mutations.

* Went into more detailing understanding the unique features Vendia offers, including data caching, uploading files to the ledger, and data tracability. 

With this knowledge in hand, you're ready to start working with your data programmatically. The links below will help you with your next steps.

* [Vendia SDK](https://www.vendia.com/docs/share/vendia-client-sdk)

* [GraphQL Docs](https://graphql.org/learn/)

* [Vendia Share Docs](https://www.vendia.com/docs/share)



