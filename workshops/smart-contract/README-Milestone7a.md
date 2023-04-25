# Milestone 7a - Validation Input Query & Ouput Mutation

## Goal
We will create a demo input query and output mutation for the purpose of validating our existing data.

## Data Validation
Data validation is another way to use smart contract. By definition: `Data validation - Making sure data is valid prior to its use by other participants`. In this milestone we will create sample input query and output mutations for a data validation smart contract.

## Validation Input Query
Below is a input query that will list out the loan with a specified identifier and return their `_id`, `loanIdentifier`, `borrowerCreditScore`, `unpaidPrincipalBalance`, and `originationDate`.

```
    query ValidationInputQuery($loanIdentifier: String!) {
      list_LoanItems(filter: {loanIdentifier: {eq: $loanIdentifier}}) {
        _LoanItems {
          ... on Self_Loan {
            _id
            loanIdentifier
            borrowerCreditScore
            unpaidPrincipalBalance
            originationDate
          }
        }
      }
    }

```

## Validation Output Mutation
This is a output mutation that will update a loan's `validationStatus` based on the result we get from our lambda function. Note that in this scenario, we have added ACL input to restrict access to certain fields.
```
    mutation ValidationOutputMutation($id: ID!,  $validationStatus: Self_Loan_validationStatusEnum!, $acl: [Vendia_Acl_Input_!]) {
      update_Loan(
        id: $id, 
        input: {
          validationStatus: $validationStatus
        },
        aclInput: {
            acl: $acl
        },
        syncMode: ASYNC
      ) {
        __typename
      }
    }
```

## Questions to Consider

* With above query and mutation, how can we test to see they actually work and syntax-error free?

## Key Takeaways

* Data validation is to make sure data is valid prior to its use by other participants
* ACLs can be used to restrict access to data fields

Next up, [Milestone 7b](README-Milestone7b.md).