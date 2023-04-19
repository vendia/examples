# Milestone 6a - Enrichment Input Query & Ouput Mutation

## Goal
We will create a demo input query and output mutation for the purpose of enriching our existing data.

## Data Enrichment
At times, our data could be missing pieces of info that we need. So we will define data enrichment as: `Enhancing data with additional information provided from an external system`. 

## Enrichment Input Query
Here's a simple input query:
```
    query ValidationInputQuery($loanIdentifier: String!) {
      list_LoanItems(filter: {loanIdentifier: {eq: $loanIdentifier}}) {
        _LoanItems {
          ... on Self_Loan {
            _id
            loanIdentifier
          }
        }
      }
    }
```

It lists out all `Loans` filtered by `$loanIdentifier` provided by us.


## Enrichment Output Mutation
Here's what output mutation we have and what we plan to do with our data:
```
    mutation ValidationOutputMutation($id: ID!, $additionalResources: [Self_Loan_additionalResources_additionalResourcesItem_UpdateInput_]) {
      update_Loan(
        id: $id, 
        input: {
          additionalResources: $additionalResources
        },
        syncMode: ASYNC
      ) {
        __typename
      }
    }
```

This mutation updates a loan with a specific ID passed into it and update the field `additionalResources` with anything inserted into `$additionalResources`.

Save these queries and we will use them later to create our enrichment smart contract.

## Questions to Consider

* With above query and mutation, how can we test to see they actually work and syntax-error free?

## Key Takeaways

* Data Enrichment is to enhancing data with additional information provided from an external system
* Enrichment can be done through smart contract with proper setup

Next up, [Milestone 6b](README-Milestone6b.md).