<p align="center">
  <a href="https://vendia.net/">
    <img src="https://share.vendia.net/logo.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Integrations

The `integrations` directory of this repo includes deeper exploration of the core features that comprise Vendia Share. Enjoy!

Each integration example is self-contained and includes a `README.md` with instructions on how to run the example.

| Example | Category | Cloud or External Services | Programming Languages |
|:---------|:--------|:--------|:--------|
| [Ingesting DynamoDB change data into a Uni](datastores/dynamo-to-share/README.md) | Data Stores | AWS Lambda + Amazon DynamoDB  | Python |
| [Ingesting Postgres change data into a Uni](datastores/postgres-to-share/README.md) | Data Stores | Postgres | Python |
| [Ingesting EventBridge events into a Uni](eventing/eventbridge-to-share/README.md) | Eventing | Amazon EventBridge + AWS Lambda  | Python |
| [Ingesting Kafka events into a Uni](eventing/kafka-to-share/README.md) | Eventing | Kafka + AWS Lambda | Python
| [Ingesting Kinesis Data Streams events into a Uni](eventing/kinesis-to-share/README.md) | Eventing | Amazon Kinesis Data Streams + AWS Lambda | Python |
| [Emitting events from a Uni to trigger Azure Function](eventing/share-to-azure-functions/README.md) | Eventing | Azure Functions | Python |
| [Ingesting CSV data into a Uni](files/csv-to-share/README.md) | Files | AWS Lambda + Amazon S3 | Python
| [Ingesting email attachment data into a Uni](files/email-to-share/README.md) | Files | AWS Lambda + Amazon S3 + AWS Simple Email Service | Python
| [Ingesting SFTP file data into a Uni](files/sftp-to-share/README.md) | Files | AWS Transfer Family (SFTP) + AWS Lambda + Amazon S3 | Python
| [Authenticating requests to a Uni using SAML](security/saml-example/README.md) | Security | Amazon Cognito + Auth0 | NA 
| [Visualizing data from a Uni using PowerBI](visualization/power-bi/README.md) | Visualization | Microsoft Power BI | NA
