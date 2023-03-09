<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.com/images/logo/logo.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Intro to GraphQL with Vendia

[Vendia Share](https://www.vendia.net) is the real-time data cloud for rapidly building applications that securely share data across departments, companies, clouds, and regions.  This workshop walks you through the basics of GraphQL and interacting with the Share platform programmatically.

The workshop will involve us spinning up our [Supplier and Distributor](https://github.com/vendia/examples/tree/main/demos/food-and-beverage/simple-supplier-distributor) demo and interacting with the Uni programmatically, covering the basics of GraphQL queries and mutations as well as Vendia's own advanced features.

If you have already spun-up the Supplier and Distributor Uni, no need to do so again for the purpose of this demo. 

# Pre-requisites

To complete this workshop, you'll need the following:

* [Git Client](https://git-scm.com/downloads)
* [Vendia Share CLI](https://vendia.net/docs/share/cli)
* [Vendia Share Account](https://share.vendia.net/signup)
* [AWS Account with S3 Access](https://aws.amazon.com/console/) (Optional)

Optionally, you'll need:
* Your code editor of choice

In addition, you'll also need to clone this respository.

### Clone with SSH

```bash
git clone git@github.com:vendia/examples.git
```

### Clone with HTTPS

```bash
git clone https://github.com/vendia/examples.git
```

# Workshop Milestones
You'll incrementally create a multi-party application through a series of Milestones.  Each Milestone builds on the previous, so they should be executed in order.

## Setup
* [Milestone 0 - Set up Universal Application](README-Milestone0.md)

## GraphQL Foundations
* [Milestone 1 - GraphQL Introduction](README-Milestone1.md)
* [Milestone 2 - GraphQL in Vendia Share](README-Milestone2.md)
* [Milestone 3 - Queries and Mutations](README-Milestone3.md)

## Advanced Features
* [Milestone 4 - Vendia & GraphQL](README-Milestone4.md)
* [Milestone 5 - Examples of Advanced Queries](README-Milestone5.md)
