<p align="center">
  <a href="https://vendia.net/">
    <img src="https://raw.githubusercontent.com/vendia/examples/main/vendia-logo.png" alt="vendia logo" width="100px">
  </a>
</p>

# Vendia Share Smart Contracts

## Overview
Vendia Share enables companies to rapidly build applications that securely share data across departments, companies, and clouds.  If _sharing data_ is Step 1, then _acting on_ shared data is almost always Step 2.  There are many ways to act on the data shared using Vendia Share: auto-generated [GraphQL APIs](https://www.vendia.net/docs/share/graphql), event-driven [inbound and outbound integrations](https://www.vendia.net/docs/share/integrations), and, more recently the introduction of [smart contracts](https://www.vendia.net/docs/share/smart-contracts).

Smart contracts allow users to take action on data in a predefined way, one that is versioned and ledgered for the improved transparency of all Uni participants.  This allows predefined and versioned functions to be created by a single participant for the benefit of all participants.  Further, the ledgered nature of smart contracts provides an added level of transparency and auditability that the "off-chain" approaches to data processing do not.

Smart contracts can be used for a variety of purposes.  In this example, we'll explore a set of smart contracts that are used for:

* **Data validation** - Making sure data is valid prior to its use by other participants
* **Data computation** - Calculating new data values using data shared by other participants
* **Data enrichment** - Enhancing data with additional information provided from an external system

In this example, you'll explore a Uni with two participants: a Lender and a Servicer working in the home mortgage space.  The Lender creates new loans on the Uni.  The Servicer manages a portfolio of loans on the Uni. Both participants will make use of smart contracts to automate their interactions and increase their operational transparency.

## Step 0 - Prerequisites
Smart contracts are programmatic in nature, which means this example will be heavily programmatic as well.  Before getting started with this example, you'll first need to:

* Create a [Vendia Share account](https://share.vendia.net/)
* Create a [Amazon Web Services account](https://aws.amazon.com/free)
* Install the Vendia Share [Command Line Interface (CLI)](https://www.vendia.net/docs/share/cli)
* Install [Node.js](https://nodejs.org/en/download/)
* Install [Git Client](https://git-scm.com/downloads)

In addition, you'll also need to clone this repository.

<details>
<summary>Instructions for cloning the repository</summary>

### Clone with SSH

```bash
git clone git@github.com:vendia/examples.git
```

### Clone with HTTPS

```bash
git clone https://github.com/vendia/examples.git
```

</details>

## Step 1 - Create a Universal Application
Before exploring smart contract functionality, you'll first want to create a [Uni](https://www.vendia.net/docs/share/dev-and-use-unis#what-is-a-uni).  A Uni is what allows the Lender and the Servicer to share data and code (i.e. smart contracts) with each other in real-time and with control.

To create a Uni using the Share CLI:

1. Change directories to `uni_configuration`
    1. `cd uni_configuration`
1. Create your own copy of the `registration.json.sample` file, removing the `.sample` suffix
    1. `cp registration.json.sample registration.json`
1. Edit the `registration.json` file changing
    1. `name` - keep the `test-` prefix but make the remainder of the name unique
    1. `userId` - on both nodes should match your Vendia Share `userId` (i.e. your email address)
1. Create the Uni
    1. `share uni create --config registration.json`

Wait about 5 minutes for the Uni to reach a `Running` state.

## Step 2 - Create a Smart Contract for Data Validation
Once the Uni has reached a `Running` state, it's time for the Lender to add some loans.  

### Load Unvalidated Loan Data
With the Uni running, the Lender is ready to add Loans to the Uni.

#### Configure the Scripts
The below scripts look for a file named `.share.env` within the `src` directory.  To create that file:

1. Change into the `src` directory (assuming from the `uni_configuration` directory from Step 1)
   ```shell
   cd ../src
   ```
1. Create the file with a set of pre-defined properties
   ```shell
   echo -e "LENDER_GQL_URL=\nLENDER_GQL_APIKEY=\nSERVICER_GQL_URL=\nSERVICER_GQL_APIKEY=\nVALIDATION_LAMBDA_ARN=\nCOMPUTATION_LAMBDA_ARN=\nENRICHMENT_LAMBDA_ARN=\n" >> .share.env
   ```
1. Insert the values for each property prefixed with `LENDER` or `SERVICER` based on the GraphQL URL and API Key information for the **OriginatorNode** and **ServicerNode**.  The remainder of the properities will be assigned values in the subsequent sections. 
   ```shell
   share uni get --name <name_of_your_uni>
   ```

#### Pull Dependencies
The Node.js scripts rely on a set of 3rd party libraries, which must be retreived before executing the scripts

```shell
npm i
```

#### Add Loans

The script below adds the loans from the [resources](data/loans) directory to the Uni, on behalf of the Lender, and adds a loan portfolio, on behalf of the Servicer.  Both the loans and the loan portfolio will be used in subsequent sections to highlight the value of real-time data sharing and smart contracts.

```shell
npm run loadData
```

### Define Validation Rules
The Lender wants to ensure the Servicer is only able to act on loans with valid data.

The [schema](uni_configuration/schema.json) for the Uni provides basic validation based on the schema definition.  For example, `loanIdentifier` must be a 16-digit value, `originationDate` must be a valid date, and `originalInterestRate` must be a number between 0 and 100.  While those syntax checks are necessary for data validation, they do not address business rule validation.

The Lender can use a smart contract to ensure more in-depth data validation occurs prior to the Servicer making use of the data.

Let's assume the Lender wants to perform two additional validations on every new Loan added to the Uni.

1. **Origination Date Validation** - Ensuring `originationDate` is not a future date (i.e. a Loan can't exist if it hasn't yet been created)
1. **Original Unpaid Principal Balance Validation** - Assessing `originalUnpaidPrincipalBalance` validity based on the `borrowerCreditScore`

Neither of these in-depth validations are feasible through the schema definition itself.  Both require dynamic validation using the data provided as part of a new Loan.

### Create and Configure a Loan Validation Lambda Function
**NOTE:** The validation pattern demonstrated here is just one of several that can be used to prevent other participants from accessing data prior to validation.

The [validation Lambda function](src/validation/index.js) includes [Node.js](https://nodejs.dev/) source code that implements the validation rules outlined in the previous section, though any [platform and language](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) supported by AWS Lambda will work.

Creating the Lambda function itself is outside the scope of this example.  You can use the [AWS console](https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html), the [AWS CLI](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-awscli.html), or more [advanced approaches](https://aws.amazon.com/blogs/compute/better-together-aws-sam-and-aws-cdk/).

Once the Lambda function exists, it must be configured to permit a specific node in the Uni (in this case the **LenderNode**) to invoke it.

1. First you'll need the Smart Contract Role from the **LenderNode**, which is found in the output of the command below (`LenderNode.resources.smartContracts.aws_Role`)
   ```shell
   share uni get --uni <your_uni_name>
   ```
2. Next you'll use the AWS CLI to set two permissions, one that allows the Smart Contract Principal to view the Lambda function's properties and one that allows the principal to invoke the Lambda function.
   ```
   aws lambda add-permission --region <your-lambda-function-region> --function-name <your-lambda-function-arn> --action lambda:InvokeFunction --statement-id AllowVendiaInvokeFunction --principal <smart-contract-role>
   aws lambda add-permission --region <your-lambda-function-region> --function-name <your-lambda-function-arn> --action lambda:GetFunctionConfiguration  --statement-id AllowVendiaGetFunctionConfiguration  --principal <smart-contract-role>
   ```

### Create a Loan Validation Smart Contract
You'll now use a Smart Contract to connect the Lambda function from the previous section to the **LenderNode**.  Think of the Smart Contract as a wrapper around the Lambda function, responsible for sending data to the Lambda function (its input) and receiving data from the Lambda function (its output).

The Lambda function from the previous section expects an input that includes certain fields (those needing validation).  That input comes from a pre-defined GraphQL query, which will be executed against the **LenderNode** when the Smart Contract is invoked.  See the `validationInputQuery` in [GqlMutations.js](src/GqlMutations.js) for an example.

The Lamdba function from the previous section produces an output that includes the validation result (modeled as an object).  That output is mapped into a pre-defined GraphQL mutation, which wil lbe executed against the **LenderNode** when the Smart Contract invocation is complete.  See the `validationOutputMutation` in [GqlMutations.js](src/GqlMutations.js) for an example.

To create a Loan Validation Smart Contract:

1. Open `.share.env` and assign `VALIDATION_LAMBDA_ARN` to the validation Lambda function's ARN (the same value used in the previous section for `<your-lambda-function-arn>`)
2. Invoke the provided npm script to create a validation smart contract on the **LenderNode**
   ```
   npm run createValidationSmartContract
   ```
3. Use the GraphQL Explorer view of the **LenderNode** to confirm the smart contract exists, and to find its unique identifier (`_id`) needed in subsequent sections. 
   ```graphql
   query ListSmartContracts {
     listVendia_ContractItems {
       Vendia_ContractItems {
         ... on Vendia_Contract {
           _id
           _owner
           name
           revisionId
           description
           inputQuery
           outputMutation
           resource {
             csp
             uri
           }
         }
       }
     }
   }
   ```

### Validate Loan Data
All the Loans the Lender added in the last step have a `validationStatus` set to `PENDING` and [data access controls](https://www.vendia.net/docs/share/fine-grained-data-permissions) in the form of an Access Control List (ACL) that prevent the Servicer from seeing the yet-to-be-validated loans.

You can validate each Loan by invoking the validation Smart Contract created in the previous sections.  The Smart Contract takes a single query argument, which is the `loanIdentifier` of the Loan to be validated.  Upon validation, the Loan's `validationStatus` will be set to either `VALID` (all validation rules are satisfied), `INVALID` (at least one validation rule was not satisified), or `ERROR` (validation failed for an unexpected reason).  Further, if a loan is `VALID`, its  

#### Example - Validate a Valid Loan
Loan `0000000000000001` is valid based on the [validation rules](README.md#define-validation-rules) above.

##### Using a Programmatic Client
You can invoke the validation Smart Contract using the provided npm script.  The script takes one argument, which is the `_id` of the Smart Contract to invoke.

1. Run the provided npm script to invoke the validation smart contract on the **OriginatorNode**
```
npm run invokeValidationSmartContract -- --smartContractId <your_smart_contract_id> --loanIdentifier 0000000000000001
```

##### Using the Share Web App
You can alternatively invoke the validation Smart Contract using the Smart Contract view of the **LenderNode** through the Share web app.

1. Click on the smart contract by name 
2. Then click `Invoke`
3. Provide the required `loanIdentifier` input query arguments
   ```json
   {
     "loanIdentifier": "0000000000000001"
   }
   ```
4. Click `Invoke`

In either case, the end result is the loan's `validationStatus` is now set to `VALID` and the loan's ACL has been adjusted to allow the Servicer to see it.  You can confirm this through the Entity Explorer view of the Share web app or the GraphQL Explorer view of the Share web app using this GraphQL query:

```graphql
query ListLoanValidationStatus {
  list_LoanItems {
    _LoanItems {
      ... on Self_Loan {
        loanIdentifier
        validationStatus
      }
    }
  }
}
```

#### Example - Validate an Invalid Loan
Loan `0000000000000002` is invalid based on the [validation rules](README.md#define-validation-rules) above (it's `originationDate` is in the future).

Repeat the steps from the previous section to invoke the validation smart contract again, either programatically or through the Smart Contract view of the Share web app, using a new `loanIdentifier` of `0000000000000002`.

#### Example - Validate the Remaining Loans 
Repeat the steps from the previous section for the remaining three loans: `0000000000000003`, `0000000000000004` and `0000000000000005`.

Confirm the end result using the Entity Explorer or GraphQL Explorer view of the Share web app.

From the **LenderNode** you should see all 5 loans - 3 with the validation status of `VALID`, 1 with the validation status of `INVALID`, and 1 with the validation status of `ERROR`.

From the **ServicerNode** you should see only 3 loans - the 3 with the validation status of `VALID`.

```graphql
query ListLoanValidationStatus {
  list_LoanItems {
    _LoanItems {
      ... on Self_Loan {
        loanIdentifier
        validationStatus
      }
    }
  }
}
```

## Step 3 - Create a Smart Contract for Data Computation
With several valid loans in place, it's time for the Loan Servicer to add loan performance data.  This data will be used by the Loan Originator to better assist borrower's facing payment hardship in Step 4.

#### Add Historical Loan Performance Data

The script below adds the historical loan performance data from the [resources](data/performance) directory to the Uni.

```shell
npm run loadPerformance
```

### Define Computation To Be Performed
The Loan Servicer adds loan performance data to the Uni every (currently monthly) reporting period.  As this happens, the Loan Servicer would like to compute the loan's `loanDelinquencyStatus` based on its current and historical performance data.

Specifically, a loan performance record should be marked as `LATE` if the last payment was more than a month and `DELINQUENT` if the last payment was more than three months ago.

### Create and Configure a Loan Risk Calculation Lambda Function
**NOTE:** The computation pattern demonstrated here is just one of several that can be used to generate values from data input prior to adding that data to the shared ledger.

The [computation Lambda function](src/computation/index.js) includes [Node.js](https://nodejs.dev/) source code that implements the computation of `loanDelinquencyStatus` outlined in the previous section, though any [platform and language](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) supported by Lambda will work.

Creating the Lambda function itself is outside the scope of this example.  You can use the [AWS console](https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html), the [AWS CLI](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-awscli.html), or more [advanced approaches](https://aws.amazon.com/blogs/compute/better-together-aws-sam-and-aws-cdk/).

Once the Lambda function exists, it must be configured to permit a specific node in the Uni (in this case the **ServicerNode**) to invoke it.

1. First you'll need the Smart Contracts role from the **ServicerNode**, which is found in the output of the command below (`ServicerNode.resources.smartContracts.aws_Role`)
   ```shell
   share uni get --uni <your_uni_name>
   ```
2. Next you'll use the AWS CLI to set two permissions, one that allows the Smart Contract Principal to view the Lambda function's properties and one that allows the principal to invoke the Lambda function.
   ```
   aws lambda add-permission --region <your-lambda-function-region> --function-name <your-lambda-function-arn> --action lambda:InvokeFunction --statement-id AllowVendiaInvokeFunction --principal <smart-contract-role>
   aws lambda add-permission --region <your-lambda-function-region> --function-name <your-lambda-function-arn> --action lambda:GetFunctionConfiguration  --statement-id AllowVendiaGetFunctionConfiguration  --principal <smart-contract-role>
   ```

### Create a Loan Risk Calculation Smart Contract
You'll now use a Smart Contract to connect the Lambda function from the previous section to the **ServicerNode**.  Think of the Smart Contract as a wrapper around the Lambda function, responsible for sending data to the Lambda function (its input) and receiving data from the Lambda function (its output).

The Lambda function from the previous section expects an input that includes certain fields (those used to compute loan delinquency status).  That input comes from a pre-defined GraphQL query, which will be executed against the **ServicerNode** when the Smart Contract is invoked, and from the invocation arguements sent when the Smart Contract is invoked.  See the `computationInputQuery` in [GqlMutations.js](src/GqlMutations.js) for an example.

The Lamdba function from the previous section produces an output that includes the loan performance data and its computed loan delinquency status (modeled as an object).  That output is mapped into a pre-defined GraphQL mutation, which wil lbe executed against the **ServicerNode** when the Smart Contract invocation is complete.  See the `computationOutputMutation` in [GqlMutations.js](src/GqlMutations.js) for an example.

To create a Loan Validation Smart Contract:

1. Open `.share.env` and assign `COMPUTATION_LAMBDA_ARN` to the computation Lambda function's ARN (the same value used in the previous section for `<your-lambda-function-arn>`)
2. Invoke the provided npm script to create a validation smart contract on the **ServicerNode**
   ```
   npm run createComputationSmartContract
   ```
3. Use the GraphQL Explorer view of the **ServicerNode** to confirm the smart contract exists, and to find its unique identifier (`_id`) needed in subsequent sections.
   ```graphql
   query ListSmartContracts {
     listVendia_ContractItems {
       Vendia_ContractItems {
         ... on Vendia_Contract {
           _id
           _owner
           name
           revisionId
           description
           inputQuery
           outputMutation
           resource {
             csp
             uri
           }
         }
       }
     }
   }
   ```

### Calculate Loan Delinquency Status
The Servicer now wants to add loan performance data for the next reporting period.  In this step the `invokeArgument` includes loan performance data, but without a `loanDelinquencyStatus` value present.  The Smart Contract will determine the appropriate value, based on the provided (via `invokeArguments`) and historical (via `inputQuery`) data.

You can now simulate the operations a Servicer might perform when adding new loan performance data that requires additional computation before the data is stored to the ledger, and shared with others. 

#### Example - Calculate Loan Delinquency 
Loan `ABCD1234` is delinquent based on the [computation logic](README.md#define-computation-to-be-performed) above.

##### Using a Programmatic Client
You can invoke the calculation Smart Contract using the provided npm script.  The script takes 1 argument, which is the `_id` of the Smart Contract to invoke.

1. Run the provided npm script to invoke the validation smart contract on the **OriginatorNode**
```
npm run invokeComputationSmartContract -- --smartContractId <your_smart_contract_id> --loanIdentifier ABCD1234
```

##### Using the Share Web App
You can alternatively invoke the validation Smart Contract using the Smart Contract view of the **ServicerNode** through the Share web app.

1. Click on the smart contract by name
2. Then click `Invoke`
3. Provide the required `loanIdentifier` input query arguments
   ```json
   {
     "loanIdentifier": "ABCD1234"
   }
   ```
4. Provide the required `invokeArguments`
   ```json
   
   ```
4. Click `Invoke`

In either case, the end result is the Loan Performance data is added and a computed `loanDelinquencyStatus` is included.  You can confirm this through the Entity Explorer view of the Share web app or the GraphQL Explorer view of the Share web app using this GraphQL query:

```graphql

```

#### Example - Validate an Invalid Loan
Loan `WXYZ9876` is late based on the [validation rules](README.md#define-validation-rules) above.

Repeat the steps from the previous section to invoke the computation smart contract again, either programatically or through the Smart Contract view of the Share web app, using:

* A new `loanIdentifier` of `WXYZ9876`
* A new `invokeArguments` value of 
```json

```

You can confirm this through the Entity Explorer view of the Share web app or the GraphQL Explorer view of the Share web app using this GraphQL query:

```graphql
```

You should see two new loan performance data entries, one with loan delinquency status of `DELINQUENT` and one with a loan delinquency status of `CURRENT`. 

## Step 4 - Create a Smart Contract for Data Enrichment

### Create a Loan Assistance Lambda Function

### Create a Loan Assistance Smart Contract

### Enrich Loans with Loan Assistance Info

## Summary
In this example you:
