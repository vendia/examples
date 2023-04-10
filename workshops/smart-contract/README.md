<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.com/images/logo/logo.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Smart Contract Workshop

[Vendia Share](https://www.vendia.net) is the real-time data cloud for rapidly building applications that securely share data across departments, companies, clouds, and regions.  This workshops demonstrates the ease of creating multi-party data sharing solutions using the Share platform.

# Pre-requisites

To complete this workshop, you'll need the following:

* [Git Client](https://git-scm.com/downloads)
* [Vendia Share CLI](https://vendia.net/docs/share/cli)
* [Vendia Share Account](https://share.vendia.net/signup)
* [AWS Account](https://aws.amazon.com/resources/create-account/)

If you haven't already, clone this repository:

### Clone with SSH

```bash
git clone git@github.com:vendia/examples.git
```

### Clone with HTTPS

```bash
git clone https://github.com/vendia/examples.git
```



We will go through the process of creating smart contracts on Vendia Share. Also, we'll discuss the mostly used patterns of smart contract: **Enrichment**, **Validation**, and **Computation**.

## Imaginary Background

In this workshop, we will pretend we are a financial institution. And we have to do enrichment, computation, and validation to our loans. Our setting has all the necessary nodes and mock data setup. The main purpose of this workshop will be setting up smart contracts accordingly,

## Create a Universal Application

To create a Uni using the Share CLI:

1. Change directories to `uni_configuration`
    1. `cd uni_configuration`
2. Create your own copy of the `registration.json.sample` file, removing the `.sample` suffix
    1. `cp registration.json.sample registration.json`
3. Edit the `registration.json` file changing
    1. `name` - keep the `test-` prefix but make the remainder of the name unique
    2. `userId` - on both nodes should match your Vendia Share `userId` (i.e. your email address)
4. Create the Uni
    1. `share uni create --config registration.json`

Wait about 5 minutes for the Uni to reach a `Running` state.


Once your Uni is ready, let's start with [Milestone 0](README-Milestone0.md).

# Workshop Milestones

## Smart Contract Creation
* [Milestone 0 - Getting to Know the Flow](README-Milestone0.md)
* [Milestone 1 - Create Mock Input Query](README-Milestone1.md)
* [Milestone 2 - Create Mock Output Mutation](README-Milestone2.md)
* [Milestone 3 - Create an hello world Lambda Function](README-Milestone3.md)
* [Milestone 4 - Adding Permission to Lambda Function](README-Milestone4.md)
* [Milestone 5 - Create Smart Contraction on Vendia](README-Milestone5.md)

## Main Use Cases
* [Milestone 6a - Enrichment Input Query & Ouput Mutation](README-Milestone6c.md)
* [Milestone 6b - Enrichment Business Logic in Lambda](README-Milestone6a.md)
* [Milestone 6c - Enrichment Test Case](README-Milestone6b.md)
* [Milestone 7a - Validation Input Query & Ouput Mutation](README-Milestone7c.md)
* [Milestone 7b - Validation Business Logic in Lambda](README-Milestone7a.md)
* [Milestone 7c - Validation Test Case](README-Milestone7b.md)
* [Milestone 8a - Computation Input Query & Ouput Mutation](README-Milestone8c.md)
* [Milestone 8b - Computation Business Logic in Lambda](README-Milestone8a.md)
* [Milestone 8c - Computation Test Case](README-Milestone8b.md)

## Optional Infrastructure Management Using Terraform
* [Milestone 9 - Additional Pre-requisites](README-Milestone9.md)
* [Milestone 10 - Manage Role with Terraform](README-Milestone10.md)
* [Milestone 11 - Manage Lambda Function with Terraform](README-Milestone11.md)
* [Milestone 12 - Manage Lambda Permission with Terraform](README-Milestone12.md)
* [Milestone 13 - Retrieve Lambda ARN with Terraform](README-Milestone13.md)

## Troubleshooting Smart Contracts
