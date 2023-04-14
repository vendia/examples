# Milestone 2 - Create Mock Output Mutation

## Goal
To take actions in Vendia Share through smart contract, we must set a output mutation. Just like input query, they are really just GraphQL Query & Mutation. The input & output states their purposes. In this milestone, let's create mutations for smart contract use.

## Create a hardcoded mutation
Same as query, a output mutation has limited usage if we hardcode it. That is same things happen regardless what data we got and what logic it went through lambda function. Below is a hardcoded mutation sample:

```
mutation HardcodedMutation {
  add_Loan(
    input: {
      borrowerCreditScore: 10
      delinquencyStatus: CURRENT
      interestRatePercent: 1.5
      loanToValuePercent: 1.5
      numberOfUnits: 10
      originationDate: "2021-04-11"
      unpaidPrincipalBalance: 1.5
      loanIdentifier: "0000000000000020"
      portfolioIdentifier: "AAAA29485"
    }
    syncMode: ASYNC
  ) {
    __typename
  }
}
```

This is a straight forward mutation that adds a loan to your ledger.

## Create a mutation with variables
Let's make our hardcoded mutation more useful by putting some variables in it. In this case, let's swap out the whole input value into a variable.

```
mutation VariableMutation($input: Self_Loan_Input_!) {
  add_Loan(
    input: $input,
    syncMode: ASYNC
  ) {
    __typename
  }
}
```

With above setup, `$input` will be replaced by the data returned from AWS lambda function. That also means, if the data returned from lambda is invalid, the mutation will fail. Therefore, it's crucial to have cloudwatch enabled for your lambda for future easy debugging.

## Multiple actions within a mutation
A intuitive way to add another action inside a mutation will be to add another `add_Loan` under the mutation. But that will not work as functions and aliases inside the mutation must be unique. So in this case, if we want to add 2 loans, we must make 2 aliases that calls `add_Loan`.
Below is a modified version of the above mutation utilizing alias.

```
mutation VariableMutation($input: Self_Loan_Input_!) {
  action1: add_Loan(
    input: $input,
    syncMode: ASYNC
  ) {
    __typename
  }
}
```

Current, more than 10 actions within a mutation is not supported. If you have such needs, reach out to Vendia team and discuss the options.

## Do it on your own
How would you modify the above mutation so that it can add another loan with another separate input variable? Give it some though. Then compare your answer [here](./solutions/milestone2-solutions/Milestone2-solutions.md).


## Key Takeaways
* Output mutations are used to take action within Vendia Share
* Multiple actions can be done within a mutation
* No more than 10 actions within a mutation for now

Next up, [Milestone 3](README-Milestone3.md).