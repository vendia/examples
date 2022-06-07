<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# saml-example

This example will demonstrate how to authenticate requests to a [Vendia Share Uni](https://vendia.net/docs/share/dev-and-use-unis) using a SAML identity provider (IdP). The point is to illustrate that partners to a Uni can take advantage of existing IT investments like [Okta](https://www.okta.com/), [Ping Identity](https://www.pingidentity.com/), or [Active Directory Federation Services](https://docs.microsoft.com/en-us/windows-server/identity/active-directory-federation-services) without needing to upset existing practices.

[Auth0](https://www.auth0.com) will function as our SAML IdP in this example. We will demonstrate how Amazon Cognito can be configured to federate SAML and issue JWT tokens that are used to authenticate requests to Vendia Share.

![saml-example Architecture](img/saml-example.png)

# Pre-requisites

* [Vendia Share CLI](https://vendia.net/docs/share/cli)

* Administrative permissions to an AWS account

## Clone the Repository

In order to use this example, you'll first need to clone the respository.

### Clone with SSH

```bash
git clone git@github.com:vendia/examples.git
```

### Clone with HTTPS

```bash
git clone https://github.com/vendia/examples.git
```

### Change to the saml-example Directory

```bash
cd examples/share/saml-example
```

Now that we've cloned the repository, [let's set up Auth0 as a SAML identity provider with an Amazon Cognito user pool](auth0-saml-provider-amazon-cup.md).
