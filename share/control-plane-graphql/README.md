# Using the Share Graphql API
This example demonstrates using the GraphQL API to work with the Share Control Plane. This is useful when automating activities such as Uni Creation.

The API requires Sigv4 signed requests. Sigv4 signing is performed using AWS credentials as provided by the AWS Congito service. This example uses email and password combinations to authenticate with Cognito, obtain AWS credentials, and then sign a request. This example specificaly signs a request to List Unis for the given username.

## Running the sample  

Follow these steps to run the sample

*   1: install dependencies
```
npm install
```

*   2: run the example (replace the values for username and password)
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