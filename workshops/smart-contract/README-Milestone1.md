# Milestone 1 - Create Mock Input Query

## Goal
For our first milestone, we will learn how to create a input query from scratch. There are 2 sections in this milestone: 
1. Create a hardcoded query. 
2. Create a query with variables

## Create a hardcode query
If you are not an expert in Graphql or prefer an easier way to generate a query, go to any of your node and check out our `GraphQL Explorer`. With it, you can simply click through a list to generate a query. Below is a sample query that list out all the `Loans` we loaded at the creation of the Uni:

```
query HardCodedQuery {
  list_LoanItems(
    limit: 10
    readMode: CACHED
    order: {_id: ASC}
    filter: {loanIdentifier: {eq: "0000000000000005"}}
  ) {
    nextToken
    _LoanItems {
      ... on Self_Loan {
        borrowerCreditScore
        delinquencyStatus
        _id
        _owner
        interestRatePercent
        loanIdentifier
        loanToValuePercent
        numberOfUnits
        originationDate
        portfolioIdentifier
        unpaidPrincipalBalance
        validationStatus
      }
    }
  }
}
```

And here we have a hardcoded input query. Say if we always want the samething from a smart contract then we can use use something like this in our smart contract. But in real world practice, there are always arguments passed into smart contracts to make it more flexible. In the above example, we can make `limit` value a variable. In a real world example, we can also make the `filter` value a variable so we don't always find entries with `loanIdentifier` equals to `0000000000000005`.

## Create a query with variables
Just like any programming language, it's possible to pass in variables. And below is the way we do it with GraphQL. Observe that `$limit` is the variable name, `Int` is the data type. `$limit` is initially declared on top and used as value to `limit`. Note the `value: $value` pattern is a opinioned way to keep things in order. The variable name doesn't have to match the key, but it must be declared on top.

```
query VariableQuery($limit: Int) {
  list_LoanItems(
    limit: $limit
    readMode: CACHED
    order: {_id: ASC}
    filter: {loanIdentifier: {eq: "0000000000000005"}}
  ) {
    nextToken
    _LoanItems {
      ... on Self_Loan {
        borrowerCreditScore
        delinquencyStatus
        _id
        _owner
        interestRatePercent
        loanIdentifier
        loanToValuePercent
        numberOfUnits
        originationDate
        portfolioIdentifier
        unpaidPrincipalBalance
        validationStatus
      }
    }
  }
}
```

We intentionally left alone `loanIdentifier` to test reader's understanding. So let's do some practice.

Lastly, how do we pass in values for these variable in GraphQL? In JSON object.
Here's how it looks like when passing in arguments for the above query:

```
{
  "limit": 5
}
```

## Do it on your own
Based on our query with variable above, add an additional variable for `loanIdentifier`. So we can pass in arguments to determine which `loanIdentifier` we want to see instead of seeing `0000000000000005` all the time. Also, how does the argument JSON look like? You can find answers [here](./solutions/milestone1-solutions/Milestone1-solutions.md).

## Key Takeaways

* Input query gets data from Vendia Share for smart contract logic
* Variables can be used for input query
* Arguments are passed in as JSON

Next up, [Milestone 2](README-Milestone2.md).