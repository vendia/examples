# Using the Share Graphql API
This example demonstrates using the GraphQL API to work with the Share Control Plane. This is useful when automating activities such as Uni Creation.

The Share control plane API requires [Amazon Signature Version 4 (Sigv4)](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) signed requests. Sigv4 signing is performed using AWS credentials as provided by the AWS Congnito service. This example uses email and password combinations to authenticate with Cognito, obtain AWS credentials, and then sign a request. This example specifically signs a request to list Unis for the given username.

## Running the sample  

Follow these steps to run the sample

*   1: Install dependencies
```
npm install
```

*   2: Run the example (replace the values for username and password)
```
./vendiaapiauth --username me@vendia.com --password superSecretPassword
```

If everything works, you should see a JSON response like this:
```
{
    "size": 0,
    "timeout": 0,
    "statusMessage": "OK",
    "statusCode": 200,
    "data": {
        "data": {
            "listUnis": {
                "unis": [
                    {
                        "name": "test-uni-.unis.vendia.net",
                        "status": "RUNNING"
                    }
                ]
            }
        }
    }
}
```
