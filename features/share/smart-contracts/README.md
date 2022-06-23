<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Vendia Share Smart Contracts

## Overview
Vendia Share enables companies to rapidly build applications that securely share data across departments, companies, and clouds.  If _sharing data_ is Step 1, then _acting on_ shared data is almost always Step 2.  There are many ways to act on the data shared using Vendia Share: auto-generated [GraphQL APIs](https://www.vendia.net/docs/share/graphql), event-driven [inbound and outbound integrations](https://www.vendia.net/docs/share/integrations), and, more recently the introduction of [smart contracts](https://www.vendia.net/docs/share/smart-contracts).

Smart contracts allow users to take action on data in a predefined way, one that is versioned and ledgered for the improved transparency of all Uni participants.  This requires predefined and versioned functions to be created by a single participant for the benefit of one or more participants.  Further, the ledgered nature of smart contracts provides an added level of transparency and auditability that the "off-chain" approaches to data processing do not.

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

The Lambda functions demonstrated in this example use [Node.js](https://nodejs.dev/) source code that implements the business logic outlined in each section. While the examples use Node.js code, any [platform and language](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) supported by AWS Lambda will work as the basis for Vendia Share Smart Contracts.

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
The Node.js scripts rely on a set of 3rd party libraries, which must be retreived before executing the scripts.

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

The [schema](uni_configuration/schema.json) for the Uni provides basic data validation based on the schema definition.  For example, `loanIdentifier` must be a 16-digit value, `originationDate` must be a valid date, and `originalInterestRate` must be a number between 0 and 100.  Vendia Share's GraphQL API implementation will reject input that's invalid with respect to the Uni's schema.  While basic data validations are necessary, they do not address the validation of _business rules_ that cannot be expressed through a pre-defined format or regular expression.

The Lender can use a smart contract to ensure more in-depth data validation occurs prior to the Servicer making use of the data.

Let's assume the Lender wants to perform two additional validations on every new Loan added to the Uni.

1. **Origination Date Validation** - Ensuring `originationDate` is not a future date (i.e. a Loan can't exist if it hasn't yet been created)
1. **Original Unpaid Principal Balance Validation** - Assessing `originalUnpaidPrincipalBalance` validity based on the `borrowerCreditScore`

Neither of these in-depth validations are feasible through the schema definition itself.  Both require dynamic validation using the data provided as part of a new Loan.

### Create and Configure a Loan Validation Lambda Function
**NOTE:** The validation pattern demonstrated here is just one of several that can be used to prevent other participants from accessing data prior to validation.

The [validation Lambda function](src/validation/index.js) includes [Node.js](https://nodejs.dev/) source code that implements the validation rules outlined in the previous section, though any [platform and language](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) supported by AWS Lambda will work.

Creating the Lambda function itself is outside the scope of this example.  You can use the [AWS console](https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html), the [AWS CLI](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-awscli.html), or more [advanced approaches](https://aws.amazon.com/blogs/compute/better-together-aws-sam-and-aws-cdk/).  See [this example](../../../approaches/deployment/smart-contracts-with-sam) for a smart contract deployment example that using the [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/).

**NOTE:** Vendia Smart Contracts require AWS Lambda functions be versioned. The special version `$LATEST` will not work. 

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

The Lambda function from the previous section expects an input that includes certain fields (those needing validation).  That input comes from a pre-defined GraphQL query, which will be executed against the **LenderNode** when the Smart Contract is invoked.  See the `validationInputQuery` in [GqlMutations.js](src/GqlMutations.js#L93) for an example.

The Lamdba function from the previous section produces an output that includes the validation result (modeled as an object).  That output is mapped into a pre-defined GraphQL mutation, which wil lbe executed against the **LenderNode** when the Lambda function invocation is complete.  See the `validationOutputMutation` in [GqlMutations.js](src/GqlMutations.js#L109) for an example.

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

You can validate each Loan by invoking the validation Smart Contract created in the previous sections.  The Smart Contract takes a single query argument, which is the `loanIdentifier` of the Loan to be validated.  Upon validation, the Loan's `validationStatus` will be set to either `VALID` (all validation rules are satisfied), `INVALID` (at least one validation rule was not satisified), or `ERROR` (validation failed for an unexpected reason).  Further, if a loan is `VALID`,  its ACLs are updated to allow the **ServicerNode** read access.  In other words, the Servicer will only see valid loans, as only valid loans are made visible to the Servicer by the Lender.

#### Example - Validate a Valid Loan
Loan `0000000000000001` is valid based on the [validation rules](README.md#define-validation-rules) above.

##### Using a Programmatic Client
You can invoke the validation Smart Contract using the provided npm script.  The script takes two arguments, which are the `_id` of the Smart Contract to invoke and the `loanIdentifer` of the loan to validate.

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
With several valid loans in place, it's time for the Servicer to update the statistics of its loan portfolio.

### Define Computation To Be Performed
The Servicer will calculate two values using data from the loans recently added to its loan portfolio.

* **Weighted Average Interest Rate** - The [weighted average](https://www.investopedia.com/terms/w/weightedaverage.asp) of the `interestRatePercent`, weighted by `unpaidPrincipalBalance`
* **Delinquency Percentage** - The percentage of loans with a `delinquencyStatus` set to `DELINQUENT`

### Create and Configure a Loan Portfolio Statistics Calculation Lambda Function
**NOTE:** The computation pattern demonstrated here is just one of several that can be used to compute new values.

The [computation Lambda function](src/computation/index.js) includes [Node.js](https://nodejs.dev/) source code that implements the computation of loan portfolio statistics outlined in the previous section, though any [platform and language](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) supported by Lambda will work.

Creating the Lambda function itself is outside the scope of this example.  You can use the [AWS console](https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html), the [AWS CLI](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-awscli.html), or more [advanced approaches](https://aws.amazon.com/blogs/compute/better-together-aws-sam-and-aws-cdk/).  See [this example](../../../approaches/deployment/smart-contracts-with-sam) for a smart contract deployment example that using the [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/).

**NOTE:** Vendia Smart Contracts require AWS Lambda functions be versioned. The special version `$LATEST` will not work.

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

### Create a Loan Portfolio Statistics Calculation Smart Contract
You'll now use a Smart Contract to connect the Lambda function from the previous section to the **ServicerNode**.  Think of the Smart Contract as a wrapper around the Lambda function, responsible for sending data to the Lambda function (its input) and receiving data from the Lambda function (its output).

The Lambda function from the previous section expects an input that includes certain fields.  That input comes from a pre-defined GraphQL query, which will be executed against the **ServicerNode** when the Smart Contract is invoked.  See the `computationInputQuery` in [GqlMutations.js](src/GqlMutations.js#L123) for an example.

The Lamdba function from the previous section produces an output that includes the loan portfolio statistics (modeled as an object).  That output is mapped into a pre-defined GraphQL mutation, which wil lbe executed against the **ServicerNode** when the Lambda function invocation is complete.  See the `computationOutputMutation` in [GqlMutations.js](src/GqlMutations.js#L144) for an example.

To create a Loan Portfolio Statistics Calculation Smart Contract:

1. Open `.share.env` and assign `COMPUTATION_LAMBDA_ARN` to the computation Lambda function's ARN (the same value used in the previous section for `<your-lambda-function-arn>`)
2. Invoke the provided npm script to create a calculation smart contract on the **ServicerNode**
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

### Calculate Loan Portfolio Statistics
The Servicer now wants to calculate updated values for its loan portfolio.

You can simulate the operations a Servicer might perform when receiving new loans - executing additional computations to keep loan portfolio data accurate for all viewers.

#### Example - Calculate Loan Portfolio Statistics
The loan portfolio's `delinquencyPercentage` and `weightedAverageInterestRate` fields were originally empty.  Now that loans have been added to the loan portfolio, those values can be calculated.

##### Using a Programmatic Client
You can invoke the calculation Smart Contract using the provided npm script.  The script takes no arguments, as its hardcoded to a specific `portfolioIdentifier`.

1. Run the provided npm script to invoke the validation smart contract on the **OriginatorNode**
```
npm run invokeComputationSmartContract -- --smartContractId <your_smart_contract_id>
```

##### Using the Share Web App
You can alternatively invoke the validation Smart Contract using the Smart Contract view of the **ServicerNode** through the Share web app.

1. Click on the smart contract by name
2. Then click `Invoke`
3. Provide the required `portfolioIdentifier` input query arguments
   ```json
   {
     "portfolioIdentifier": "AAAA1111"
   }
   ```
4. Click `Invoke`

In either case, the end result are the computed loan portfolio calculations - `delinquencyPercentage` and `weightedAverageInterestRate` -  are populated.  You can confirm this through the Entity Explorer view of the Share web app or the GraphQL Explorer view of the Share web app using this GraphQL query:

```graphql
query ListPortfolios {
  list_LoanPortfolioItems {
    _LoanPortfolioItems {
      ... on Self_LoanPortfolio {
        portfolioName
        portfolioIdentifier
        delinquencyPercentage
        weightedAverageInterestRate
      }
    }
  }
}
```

## Step 4 - Create a Smart Contract for Data Enrichment
With updated statistics on the Servicer's loan portfolio health, the Lender may now want to help borrowers facing payment challenges.  Specifically, the Lender may want to suggest assistance programs - tailored to the borrower - that may be relevant.

### Define Enrichment To Be Performed
The Lender will populate the `additionalResources` field of a non-performing loan with payment assistance information.  In this example, we'll use a few sample values.  In the real-world, these suggestions could come from an analytics / machine learning solution purpose-built to identify the right assistance program for a borrower.

### Create and Configure a Loan Enrichment Lambda Function
**NOTE:** The enrichment pattern demonstrated here is just one of several that can be used to supplement data values.

The [enrichment Lambda function](src/enrichment/index.js) includes [Node.js](https://nodejs.dev/) source code that implements the computation of loan portfolio statistics outlined in the previous section, though any [platform and language](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) supported by Lambda will work.

Creating the Lambda function itself is outside the scope of this example.  You can use the [AWS console](https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html), the [AWS CLI](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-awscli.html), or more [advanced approaches](https://aws.amazon.com/blogs/compute/better-together-aws-sam-and-aws-cdk/).  See [this example](../../../approaches/deployment/smart-contracts-with-sam) for a smart contract deployment example that using the [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/).

**NOTE:** Vendia Smart Contracts require AWS Lambda functions be versioned. The special version `$LATEST` will not work.

Once the Lambda function exists, it must be configured to permit a specific node in the Uni (in this case the **LenderNode**) to invoke it.

1. First you'll need the Smart Contracts role from the **LenderNode**, which is found in the output of the command below (`LenderNode.resources.smartContracts.aws_Role`)
   ```shell
   share uni get --uni <your_uni_name>
   ```
2. Next you'll use the AWS CLI to set two permissions, one that allows the Smart Contract Principal to view the Lambda function's properties and one that allows the principal to invoke the Lambda function.
   ```
   aws lambda add-permission --region <your-lambda-function-region> --function-name <your-lambda-function-arn> --action lambda:InvokeFunction --statement-id AllowVendiaInvokeFunction --principal <smart-contract-role>
   aws lambda add-permission --region <your-lambda-function-region> --function-name <your-lambda-function-arn> --action lambda:GetFunctionConfiguration  --statement-id AllowVendiaGetFunctionConfiguration  --principal <smart-contract-role>
   ```

### Create a Loan Enrichment Smart Contract
You'll now use a Smart Contract to connect the Lambda function from the previous section to the **LenderNode**.  Think of the Smart Contract as a wrapper around the Lambda function, responsible for sending data to the Lambda function (its input) and receiving data from the Lambda function (its output).

The Lambda function from the previous section expects an input that includes certain fields.  That input comes from a pre-defined GraphQL query, which will be executed against the **LenderNode** when the Smart Contract is invoked, and from the invocation arguements sent when the Smart Contract is invoked.  See the `enrichmentInputQuery` in [GqlMutations.js](src/GqlMutations.js#L158) for an example.

The Lamdba function from the previous section produces an output that includes `additionalResources` for the loan (modeled as an object).  That output is mapped into a pre-defined GraphQL mutation, which wil lbe executed against the **LenderNode** when the Lambda function invocation is complete.  See the `enrichmentOutputMutation` in [GqlMutations.js](src/GqlMutations.js#L171) for an example.

To create a Loan Enrichment Smart Contract:

1. Open `.share.env` and assign `ENRICHMENT_LAMBDA_ARN` to the computation Lambda function's ARN (the same value used in the previous section for `<your-lambda-function-arn>`)
2. Invoke the provided npm script to create an enrichment smart contract on the **LenderNode**
   ```
   npm run createEnrichmentSmartContract
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

### Enrich Loan Data
The Lender now wants to add supplemental information to a non-performing loan.

You can simulate the operations a Lender might perform when addressing a non-performing loan - providing the borrower with tailored payment assistance information.

#### Example - Enrich Loan Data 
Each loan's `additionalResources` field was originally empty.  Now, that field will be populated based on external input.

##### Using a Programmatic Client
You can invoke the enrichment Smart Contract using the provided npm script.  The script takes two arguments, which are the `_id` of the Smart Contract to invoke and the `loanIdentifer` of the loan to enrich.

1. Run the provided npm script to invoke the enrichment smart contract on the **LenderNode**
```
npm run invokeEnrichmentSmartContract -- --smartContractId <your_smart_contract_id> --loanIdentifier 0000000000000003
```

##### Using the Share Web App
You can alternatively invoke the enrichment Smart Contract using the Smart Contract view of the **LenderNode** through the Share web app.

1. Click on the smart contract by name
2. Then click `Invoke`
3. Provide the required `loanIdentifier` input query arguments
   ```json
   {
     "loanIdentifier": "0000000000000003"
   }
   ```
3. Provide the additional `invokeArguments`, which will be used to populate the `aditionalResources` values with these dynamic data values.
   ```json
   {
     "additionalResources": [
        {
          "description": "Option 1 - HUD Payment Programs for Homeowners",
          "uri": "https://www.hud.gov/sites/dfiles/Main/documents/HUDPrograms2020.pdf"
        },
        {
          "description": "Option 2 - FNMA Payment Programs for Homeowners",
          "uri": "https://www.knowyouroptions.com/loanlookup"
        }
      ]  
   }
   ```
4. Click `Invoke`

In either case, the end result is the `additionalResources` of loan `0000000000000003` is populated with the values sent as `invokeArguments`.  You can confirm this through the Entity Explorer view of the Share web app or the GraphQL Explorer view of the Share web app using this GraphQL query:

```graphql
query ListLoans {
    list_LoanItems {
        _LoanItems {
            ... on Self_Loan {
                _id
                loanIdentifier
                delinquencyStatus
                additionalResources {
                    description
                    uri
                }
            }
        }
    }
}
```

## Summary
In this example, you explored three different smart contracts:

* **Validation Smart Contract** - That validates a record _and_ changes the ACLs on that record if it is valid (and only if it is valid).  This allows other participants to see _only_ valid data at all times.
* **Computation Smart Contract** - That computes "rollup" values based on existing data.  This allows computations to be executed (and re-executed) as data changes on the Uni.
* **Enrichment Smart Contract** - That enriches an existing record based on dynamic, runtime inputs provided during smart contract invocation.  This allows the caller to provide per-call data, instructions, or other just-in-time inputs.
