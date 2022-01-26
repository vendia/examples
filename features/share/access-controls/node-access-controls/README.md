Create a Uni with Different Node Access Controls
Specifying a different Node Access Controls type on a Uni is simple, which we'll demonstrate in this section.  As shown in the registration.json file below, simply set the `authorizerType` on Node1 to `API_KEY` and set the `authorizerType` on Node2 to `VENDIA_USER`.

First, create a directory to store your Share configuration files
```
mkdir vendia
```

Next, save the registration.json file to the directory you created.  Note: You'll need to modify the `name` to be something unique (referred to as `<UNI_NAME>` hereafter) and the `userId` values to match your Vendia Share user account.
```
```

Then, save the schema.json file to the directory you created
```
```

After that, save the init-state.json file to the directory you created
```
```

Now, change directory to where the files were saved and create a Uni
```
cd vendia
share create --config registration.json
```

We'll give the Uni a few minutes to reach the `RUNNING` state before moving on.
```
share get uni --name <UNI_NAME>
```
Invoking the GraphQL API using an API Key
Node1 in the Uni we created in the previous scenario uses an `API_KEY` authorizerType.  This means that every request to the GraphQL API must include an `x-api-key` header with a value set to the `API_KEY` found in Node1 settings.

The `x.y.z` property returned in the Share CLI invocation below provides the value to use in the `x-api-key` header of a GraphQL API request
```
share uni get --uni <UNI_NAME> --node Node1
```

See this code example for a complete working GraphQL client that sets an `x-api-key` header in its invocation of the Vendia Share GraphQL API.
Invoking the GraphQL API using a JSON Web Token (JWT)
Node2 in the Uni we created in the previous scenario uses a `VENDIA_USER` authorizerType.  This means that every request to the GraphQL API must include an `Authorization` header with a value set to a valid JWT issued by Vendia Share.

See this code example for a complete working GraphQL client that gets a JWT from Vendia Share and then sets an `Authorization` header in its invocation of the Vendia Share GraphQL API.

Authorization to Vendia Share using `IAM` or `CUSTOM` approaches is beyond the scope of this already lengthy post.  We'll continue to build out examples and posts to demonstrate more advanced `authorizerType` settings.  In the meantime, please see this post for more information on setting up a Node with a `COGNITO` `authorizerType`.