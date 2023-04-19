# Milestone 6c - Enrichment Test Case

## Goal
In this milestone, we will add some test cases for our enrichment lambda function.

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
          "_id": "01878164-1c03-d38f-919b-bb5351b94fbb"
          "loanIdentifier": "0000000000000011",
        }
      ]
    }
  }
}
```

If you don't remember how to create a test case for lambda function, refer to [milestone 3](README-Milestone3.md).

## Deploy Enrichment Smart Contract

Now we have everything we need to create our enrichment smart contract. Let's create it on Vendia Share. If you don't remember how to do that, refer to [milestone 5](README-Milestone5.md).

Note: Do not forget that we need appropriate permissions to create them. Refer to [milestone 4](README-Milestone4.md) is you don't remember.

## Testing Your Understanding

* Why should we create a testing event for AWS lambda?

## Key Takeaways

* Testing events are super helpful to ensure our lambda functions are working as expected
* Enrichment is one popular use case for smart contract

Next up, [Milestone 7a](README-Milestone7a.md).