# Milestone 8a - Computation Input Query & Ouput Mutation

## Answer to Questions

* Say if we want to test out the output mutation, what do we need and where can we test it? What variables do we have to provide?

  * There are many ways to test it. The easiest and recommended way is to do it on Vendia Share UI, the GraphQL explorer under the node page. Below are sample JSON we can submit as part of the variable argument.

  ```
  {
    "id": "01879fee-799e-2a56-201c-ace7436b652f",
    "delinquencyPercentage": 4.5,
    "weightedAverageInterestRate": 10.5
  }
  ```