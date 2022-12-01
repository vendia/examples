<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Success Notifications
Notifications emitted when the node commits a new block. Includes a summary of the transactions included in the block.

| Example                                                          | Programming Languages | Description                                                   |
| :--------------------------------------------------------------- | :-------------------- | :------------------------------------------------------------ |
| [Email](success-notification/email/README.md)                    | GraphGL               | Setting up e-mail notifications using both the UI and GraphQL |
| [Kinesis Firehoses](success-notification/aws-firehose/README.md) | GraphQL               | Receive notifications through Kinese Firehoses                |
| [Lambda Functions](success-notification/aws-lambda/README.md)    | JavaScript, GraphQL   | Handle notifications using Lambda Functions                   |
| [SQS Queues](success-notification/aws-sqs/README.md)             | GraphQL               | Putting notification messages into SQS queues                 |
| [Webhooks](success-notification/webhooks/README.md)              | GraphQL               | Integrate notification with webhooks                          |
        

# Error Notifications
Notifications emitted when an asynchronous transaction cannot be committed within the retry policy. Includes the full details of the original transaction.

| Example                                                     | Programming Languages | Description                                                   |
| :---------------------------------------------------------- | :-------------------- | :------------------------------------------------------------ |
| [Email](error-notification/email/README.md)                 | GraphGL               | Setting up e-mail notifications using both the UI and GraphQL |
| [Lambda Functions](error-notification/aws-lambda/README.md) | JavaScript, GraphQL   | Handle notifications using Lambda Functions                   |
| [SQS Queues](error-notification/aws-sqs/README.md)          | GraphQL               | Putting notification messages into SQS queues                 |
| [Webhooks](error-notification/webhooks/README.md)           | GraphQL               | Integrate notification with webhooks                          |