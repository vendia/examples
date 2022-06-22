<p align="center">
  <a href="https://vendia.net/">
    <img width="100px" alt="vendia-logo" src="https://user-images.githubusercontent.com/71095088/155574245-01f1cfbe-63bc-464d-9450-ce0b118b39c1.png">
  </a>
</p>

# postgres-to-salesforce

This project codifies the sharing of account contact data stored in a Postgres database with Salesforce CRM.

## Pre-requisites

### Salesforce

* A new [Salesforce Connected App](https://help.salesforce.com/s/articleView?id=sf.connected_app_overview.htm&type=5) needs to exist and be properly configured. The `Consumer Key` and `Consumer Secret` are needed for API interactions.

### Postgres

A sample Postgres database is deployed as a Vagrant virtual machine.

* [Oracle VirtualBox](https://www.virtualbox.org/wiki/Downloads)

* [Hashicorp Vagrant](https://www.vagrantup.com/downloads)

* [Ansible](https://www.ansible.com/)

### Vendia Share

* [Vendia Share CLI](https://vendia.net/docs/share/cli)

* [jq](https://stedolan.github.io/jq/)

### Serverless Application

* [Python3](https://www.python.org/download)

* [AWS Serverless Application Model CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

* [AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

* [Docker](https://docs.docker.com/install/)

* [jq](https://stedolan.github.io/jq/)

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

### Change to the postgres-to-share Directory

```bash
cd examples/demos/crm-sharing/postgres-to-salesforce
```

[Let's get started by deploying the example Uni](./deploy-uni.md).
