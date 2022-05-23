# simple-little-smart-contract

This repository shows how to deploy a Lambda suitable for definition as a Vendia Share [smart contract](https://www.vendia.net/docs/share/smart-contracts). The code for the smart contract is stored in [src/index.py](./src/index.py). The code is a simple placeholder; it will need to conform to the specification to meaningfully work with a Vendia Share Uni.

## Pre-requisites

* [Python3](https://www.python.org/download)

* [AWS Serverless Application Model CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

* [AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

* [jq](https://stedolan.github.io/jq/)

## Clone the Repository

In order to use this example, you'll first need to clone the respository.

### Clone with SSH

```bash
git clone git@github.com:brian-vendia/simple-little-smart-contract.git
```

### Clone with HTTPS

```bash
git clone https://github.com/brian-vendia/simple-little-smart-contract.git
```

### Change to the simple-little-smart-contract Directory

```bash
cd simple-little-smart-contract
```

## Deploying the Smart Contract Function Stack

### Build

It is not strictly necessary to pass the `--use-container` flag for this particular function. However, it is necesssary when a function has dependencies outside of the standard library.

```bash
sam build --use-container
```

### Deploy

```bash
sam deploy --guided \
--region aws-region \
--profile aws-profile \
```

You will be prompted to pass in information about the deployment. Save the generated template file. Subsequent deployments can use the simplified command:

```bash
sam deploy
```

Make note of the `SmartContractFunctionArn` returned as a CloudFormation output.

```bash
export SC_FUNCTION_ARN=output-arn
```

## Determining the Available Function Versions

Vendia Smart Contracts depend upon versioned AWS Lambda functions. The special version `$LATEST` is not a valid version for Vendia Smart Contracts. The following code will display the available versions of a function.

```bash
aws lambda list-versions-by-function --function-name ${SC_FUNCTION_ARN} \
--profile aws-profile | jq '.Versions[].Version'
```

The command will return the available versions for the specific function. Subsequent deployments of this stack will create additional versions of the function. You can take the `SC_FUNCTION_ARN` and add the specific version.

```bash
export FUNCTION_VERSION=your-desired-version
export SC_VERSIONED_ARN=${SC_FUNCTION_ARN}:${FUNCTION_VERSION}
echo ${SC_VERSIONED_ARN}
```

## Deleting the Smart Contract Function Stack

```bash
sam delete --stack-name your-stack-name \
--profile aws-profile \
--region aws-region
```
