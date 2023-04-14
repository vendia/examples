# Milestone 1 - Create Mock Input Query

## Query Solution

```
query HardCodedQuery($limit: Int, $loanIdentifier: String) {
  list_LoanItems(
    limit: $limit
    readMode: CACHED
    order: {_id: ASC}
    filter: {loanIdentifier: {eq: $loanIdentifier}}
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

## Argument Solution
```
{
  "limit": 5,
  "loanIdentifier": "0000000000000005"
}
```