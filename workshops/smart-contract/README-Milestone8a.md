# Milestone 8a - Computation Input Query & Ouput Mutation

## Goal
We will create a demo input query and output mutation for the purpose of computing our existing data.

## Data Validation
Data validation is another way to use smart contract. By definition: `Data validation - Making sure data is valid prior to its use by other participants`. In this milestone we will create sample input query and output mutations for a data validation smart contract.

## Validation Input Query
Below is a input query that will list out both the loan items and loan portfolios based on the portfolio identifier provided.
```
    query ComputationInputQuery($portfolioIdentifier: String) {
      list_LoanItems(filter: {portfolioIdentifier: {eq: $portfolioIdentifier}}) {
          _LoanItems {
              ... on Self_Loan {
                  delinquencyStatus
                  interestRatePercent
                  unpaidPrincipalBalance
              }
          }
      }
      list_LoanPortfolioItems(filter: {portfolioIdentifier: {eq: $portfolioIdentifier}}) {
          _LoanPortfolioItems {
              ... on Self_LoanPortfolio {
                  _id
              }
          }
      }
    }
```

Test them out like we did in previous milestones in GraphQL explorer.
Note that `list_LoanPortfolioItems` will not return anything. We can manually add an loan portfolio on `Entity Explorer`.

## Validation Output Mutation
This is a output mutation that will update a loan portfolio's `delingquencyPercentage` and `weightedAverageInterestRate` based on the result we get from our lambda function.
```
    mutation ValidationOutputMutation($id: ID!, $delinquencyPercentage: Float, $weightedAverageInterestRate: Float) {
        update_LoanPortfolio(
            id: $id
            input: {
                delinquencyPercentage: $delinquencyPercentage,
                weightedAverageInterestRate: $weightedAverageInterestRate
            },
            syncMode: ASYNC
        ) {
        __typename
      }
    }
```
If you already added a loan portfoliio entity, test out the above mutation in GraphQL explorer to ensure it works properly.

## Questions to Consider

* Say if we want to test out the output mutation, what do we need and where can we test it? What variables do we have to provide?

## Key Takeaways

* Data computation calculates new data values using data shared by other participants

Next up, [Milestone 8b](README-Milestone8b.md).