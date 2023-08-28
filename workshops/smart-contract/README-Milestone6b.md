# Milestone 6b - Enrichment Business Logic in Lambda

## Goal
We will create a working lambda function that will use the result of our input query and create the necessary variable json object to return to our output mutation.

## Examine sample code
We will use below code snippet for our enrichment smart contract.
```
/**
 * Uses invokeArgs provided to populate the additionalResources to be added to an existing loan
 * @param event that includes a loan (to be modified) and invokeArgs (whose value should be used to enrich a loan)
 * @returns Promise of an object that contains the enrichment results, as expected by the associated smart contract's outputMutation
 */
export const handler = async (event) => {

        console.log("Event is", event)

        let loan = event.queryResult.list_LoanItems._LoanItems[0]

        console.log("Loan is", loan)

        //this step could be much more complex - API call to an external system to receive recommendations,
        //data retrieval from some data source within your AWS environment,
        //or anything else you can access from a Lambda function
        let additionalResources = event.invokeArgs.additionalResources

        console.log("Additional resources are", additionalResources)

        return {
            id: loan._id,
            additionalResources: additionalResources
        }
}
```

Examining the above code snippet, we can see that it doesn't do anything fancy but only getting the loan `id` and retrieve invocation arguments and return them as a variable JSON.

Now let's create our lambda function. If you don't remember how to do that, refer to [milestone 3](./README-Milestone3.md).

## Testing Your Understanding

* Is invokeArgs the only way to enrich data? If not, what else?

## Key Takeaways

* You can enrich data by utilizing invoke argument from input variable
* The number of ways of richment is limited to the capability of lambda and node.js

Next up, [Milestone 6c](README-Milestone6c.md).