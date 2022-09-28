# Deploying the Serverless Application

The serverless application will consume transactions captured in our Universal Application's [blocks](https://www.vendia.net/docs/share/terms-and-definitions#block). Blocks are created when data is added, updated, or removed from our Uni.

## Build

```bash
cd serverless_app # Need to be in the root of the examples/demos/crm-sharing/postgres-to-salesforce example
sam build --use-container
```

## Deploy

**NOTE:** Be sure to source your `.env` file. Failure to do so will cause the `sam deploy` to fail.

```bash
. examples/demos/crm-sharing/postgres-to-salesforce/.env
```

The command below will deploy the serverless components to AWS that will allow data created or updated by the **postgres** node in Share to be reflected in the Salesforce instance.

```bash
sam deploy --guided --stack-name postgres-to-salesforce --parameter-overrides \
ParameterKey=ShareUrl,ParameterValue=${SALESFORCE_GRAPHQL_URL} \
ParameterKey=ShareApiKey,ParameterValue=${SALESFORCE_GRAPHQL_API_KEY} \
ParameterKey=SalesforceUsername,ParameterValue=${SALESFORCE_USERNAME} \
ParameterKey=SalesforcePassword,ParameterValue=${SALESFORCE_PASSWORD} \
ParameterKey=SalesforceTokenUrl,ParameterValue=${SALESFORCE_TOKEN_URL} \
ParameterKey=SalesforceClientId,ParameterValue=${SALESFORCE_CONSUMER_KEY} \
ParameterKey=SalesforceClientSecret,ParameterValue=${SALESFORCE_CONSUMER_SECRET} \
--region us-east-1 \
--profile [your AWS profile]
```

Make note of the `BlockProcessingFunctionArn` returned from the CloudFormation output. You will need it when configuring block notifications. Set a shell variable to store the value.

```bash
export SALESFORCE_BLOCK_FUNCTION="cloudformation-output-value"
```

**NOTE:** Subsequent builds and deploys of the serverless application can take advantage of the simplified versions of `sam build` and `sam deploy`.

```bash
sam build
sam deploy
```

## Subscribing the Serverless Functions to Block Notifications

### Attach a Resource-based Policy to Node SNS Topic

Your **salesforce** node has a SNS Topic. Run the following command allow the Topic to invoke the SALESFORCE_BLOCK_FUNCTION:

```bash
aws lambda add-permission \
--function-name ${SALESFORCE_BLOCK_FUNCTION} \
--statement-id lambda-block-notification \
--action lambda:InvokeFunction \
--principal sns.amazonaws.com \
--source-arn ${SALESFORCE_NOTIFICATION_TOPIC} \
--region us-east-1 \
--profile [your AWS profile]
```

### Configure the blockReportLambdas Setting in Vendia

The **salesforce** node needs to be configured to send block notifications to your function. This can be done through the node GraphQL Explorer.

```graphql
mutation update_blockReportLambdas($notificationFunction: String!) {
  updateVendia_Settings(
    input: {aws: {blockReportLambdas: [$notificationFunction]}}
  ) {
    result {
      _id
    }
  }
}
```

You will need to set the notificationFunction value in the web application to match your block notification function ARN. You can get this value by running the following command:

```bash
echo ${SALESFORCE_BLOCK_FUNCTION}
```

### Subscribe the Block Notification Function to Your Node's SNS Topic

Now that you've set the proper permissions and configuration, you can subscribe your Lambda function to your **salesforce** node block notification topic.

```bash
aws sns subscribe --protocol lambda \
  --topic-arn ${SALESFORCE_NOTIFICATION_TOPIC} \
  --notification-endpoint ${SALESFORCE_BLOCK_FUNCTION} \
  --region us-east-1 \
  --profile [your AWS profile]
```

Now that you've set up your Uni, configured Salesforce, and deployed your serverless application, [let's test our solution](./testing-solution.md).
