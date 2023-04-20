# Milestone 8c - Computation Test Case

## Test cases in Lambda
Now that we have our lambda function in our last milestone, we must make sure it works by providing some test cases for it. The easiest way is to provide mock event to be passed in. Below is a sample test event we can use:

```
{
  "invocationId": "sample-id",
  "invokeArgs": {},
  "queryResult": {
    "list_LoanItems": {
      "_LoanItems": [
        {
          "delinquencyStatus": "CURRENT",
          "interestRatePercent": 5.2,
          "unpaidPrincipalBalance": 352108
        },
        {
          "delinquencyStatus": "CURRENT",
          "interestRatePercent": 9.2,
          "unpaidPrincipalBalance": 445000
        },
        {
          "delinquencyStatus": "DELINQUENT",
          "interestRatePercent": 4.25,
          "unpaidPrincipalBalance": 600000
        },
        {
          "delinquencyStatus": "CURRENT",
          "interestRatePercent": 2.99,
          "unpaidPrincipalBalance": 800000
        },
        {
          "delinquencyStatus": "CURRENT",
          "interestRatePercent": 5,
          "unpaidPrincipalBalance": 500000
        }
      ]
    },
    "list_LoanPortfolioItems": {
      "_LoanPortfolioItems": [
        {
          "_id": "01879fee-799e-2a56-201c-ace7436b652f"
        }
      ]
    }
  }
}
```

If you don't remember how to create a test case for lambda function, refer to [milestone 3](README-Milestone3.md).

## Deploy Computation Smart Contract

Now we have everything we need to create our computation smart contract. Let's create it on Vendia Share. If you don't remember how to do that, refer to [milestone 5](README-Milestone5.md).

Note: Do not forget that we need appropriate permissions to create them. Refer to [milestone 4](README-Milestone4.md) if you don't remember.

## Testing Your Understanding

* Why should we create a testing event for AWS lambda?

## Key Takeaways

* Testing events are super helpful to ensure our lambda functions are working as expected
* Computation is one popular use case for smart contract

The rest of the sections are OPTIONAL and for productivity only.

Next up, [Milestone 9](README-Milestone9.md).