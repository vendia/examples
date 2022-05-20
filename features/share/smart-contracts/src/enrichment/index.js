/**
 * Uses invokeArgs provided to populate the additionalResources to be added to an existing loan
 * @param event that includes a loan (to be modified) and invokeArgs (whose value should be used to enrich a loan)
 * @returns Promise of an object that contains the enrichment results, as expected by the associated smart contract's outputMutation
 */
exports.handler = async (event) => {

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