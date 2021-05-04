<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# Vendia Share Examples

A set of example applications that demonstrate how data can be ingested, queried, and manipulated using [Vendia Share](https://vendia.net/docs/share).

# Pre-requisites

Each of the examples will use the [Vendia Share Command Line Interface (CLI)](https://vendia.net/docs/share/cli) to launch and manage unis.  In addition, each of the examples assumes you have already [registered for Vendia Share](https://share.vendia.net/signup).

# Examples

Each example is self-contained and has a `README.md` file for deploying and using it.

| Example | Cloud Service Provider (CSP) | Service(s) |
|:---------|:--------|:--------|
| [Using a CSV to write data to a Uni](./csv-to-share/README.md) | Amazon Web Services | AWS Lambda + Amazon S3 + Vendia Share |
| [Capturing DynamoDB change data to write data to a Uni](./dynamo-to-share/README.md) | Amazon Web Services | AWS Lambda + Amazon DynamoDB + Vendia Share |
| [Capturing Postgres change data to write data to a Uni](./postgres-to-share/README.md) | N/A | Postgres + Vendia Share |

