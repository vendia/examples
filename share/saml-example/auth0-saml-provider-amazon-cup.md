# Set Up Auth0 as a SAML Identity Provider with an Amazon Cognito User Pool

[AWS Premium support has provided information for setting up Auth0 as a SAML identity provider with an Amazon Cognito user pool](https://aws.amazon.com/premiumsupport/knowledge-center/auth0-saml-cognito-user-pool/). Follow these steps but realize that this is specific guidance for Auth0.

**NOTE:** Enable the _Implicit grant_ **Allowed OAuth Flows** when configuring the OAuth 2.0 settings of our user pool in Amazon Cognito. Cognito allows for Authorization code grant and Client credentials. We have chosen _Implicit grant_ because we _want_ to expose our user pool tokens directly to the end user. Please review the AWS Blog post [Understanding Amazon Cognito user pool OAuth 2.0 grants](https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-user-pool-oauth-2-0-grants/) for more information.

Amazon Cognito allows federation with other SAML providers. Please refer to Amazon Cognito's Developer Guide for more detail on [integrating with other SAML identity providers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-integrating-3rd-party-saml-providers.html).

We can launch the web UI we configured in our App Client. We should have the ability to log in using our **Auth0** SAML provider. When we log in with our Auth0 user, we will find we are redirected to the _Callback URL_ we specifed when defining our OAuth 2 settings. Note that the URL also includes additional information - the `access_token` and `id_token` from Cognito. 

**NOTE:** Make note of the `id_token`. We will use it in subsequent requests to our Vendia Share node.

Now that we have Auth0 and Amazon Cognito configured, [let's create our Uni](create-and-work-with-uni.md).
