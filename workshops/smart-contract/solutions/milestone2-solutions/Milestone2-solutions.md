# Milestone 1 - Create Mock Input Query

## Mutation Solution

```
mutation VariableMutation($input1: Self_Loan_Input_!, $input2: Self_Loan_Input_!) {
  action1: add_Loan(
    input: $input1,
    syncMode: ASYNC
  ) {
    __typename
  },
  action2: add_Loan(
    input: $input2,
    syncMode: ASYNC
  ) {
    __typename
  }
}
```
