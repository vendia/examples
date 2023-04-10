# Milestone 1 - Create Mock Input Query

## Goal
For our first milestone, we will learn how to create a input query from scratch. There are 2 sections in this milestone: 
1. Create a hardcoded query. 
2. Create a query with variables

## Create a hardcode query
If you are not an expert in Graphql or prefer an easier way to generate a query, go any of your node and check out our `GraphQL Explorer`. With it, you can simply click through a list to generate a query. Below is a sample query that list out all the `Loans` we loaded at the creation of the Uni:

```
query HardCodedQuery {
  list_LoanItems(limit: 10, readMode: CACHED, order: {_id: ASC}) {
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

## Create a query with variables


## Do it on your own


## Key Takeaways

* 

Next up, [Milestone 2](README-Milestone2.md).