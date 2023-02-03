# Loan Platform Use case

# Purpose

This demo is meant to mimic a real world loan platform scenario where multiple financial institutions have to share their data across organizations and make changes to loans. All names are to keep things as realistic as possible.

# Pre-Requisite

This demo heavily uses the Share CLI and the GraphQL Explorer so all pre-reqs listed are required.

* [Node.js](https://nodejs.org/en/download/) 8.19.2 or higher
* [Vendia Share Account](https://share.vendia.net/signup)
* [Vendia Share CLI](https://vendia.net/docs/share/cli) 0.7.1 or higher
* [Vendia Share Client SDK](https://www.vendia.net/docs/share/vendia-client-sdk#prerequisites) installed through package.json
* [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) v1.3.7 or higher
* zsh 5.8 or higher

# Setting up

Assuming All above pre-requisites are met. At your terminal:
```
./setup.sh
```

The the script will create all the necessary resources for you to see the whole demo including:
* Uni
* 5 nodes
* dummy payments
* dummy loans
* aws lambda functions/roles/policies
* environment files necessary to run node.js apps

NOTE: There are interactive prompts in the beginning and the end of the script.

# Demo Steps

## Step 1 - Demo Loan Loading Flow


#### Add Loans through JPMCLenderNode
**Summary:**
* All loans stored in `data/loans` will be loaded via GraphQL mutations

**Command:**
```bash
npm run addLoans
```

**Notes:**
* Only JPMC and FNMA have access to the loans

#### Add Loan Portfolios through COOPServicingNode and PHHServicingNode
**Summary:**
* One Loan Portfolio will be created for each servicer

**Command:**
```bash
npm run addPortfolios
```

**Notes:**
* JPMC, FNMA, and both Servicers have access to the portfolios at this point

## Step 2 - Demo Loan Servicing Flow
These steps can either be executed as part of a demo or in prep for a demo

#### Assign Loans for servicing by either COOPServicerNode or PHHServicerNode through FannieMaeNode
**Summary:**
* Loan ACLs are adjusted to provide Servicer with READ access
* Loan-to-LoanPortfolio mappings are updated

**Command:**
```bash
npm run assignForServicing
```

**Notes:**
* **Wait** until ALL loans have been ledgered before executing this command

#### Add Payments through COOPServicerNode and PHHServicerNode
**Summary:**
* All payments stored in `data/payments` will be loaded via GraphQL mutations

**Command:**
```bash
npm run addPayments
```
**Notes:**
* JPMC, FNMA, and the owning Servicer have access to the payments

#### OPTIONAL - Update a Loan's `unpaidPrincipalBalance` using a Smart Contract
**Summary:**
* Lambda function updates a Loan's `unpaidPrincipalBalance` field, and is here [index.js](src/upb/index.js)
* Show one possible application of a Smart Contract, in this case for computation
* Typically done through Vendia Share Web App's Smart Contract View
  * Use loanIdentifier `"0000000000000000"` as input


#### Set Loan status through FNMANode
**Summary:**
* Update all Loans to include a `status` value

**Command:**
```bash
npm run updateLoanStatus
```
**Notes:**
* The status values are hardcoded for demo purposes - in reality, this would be done dynamically based on payment info received from servicers

#### View Loans, Loan Portfolios, and Payments from FNMANode
**Summary:**
* check the updateStatus file to see how the status have been updated.

## Step 3 - Demo Loan Servicing Transfer Flow

#### Load Loan Servicing Transfer Web App
**Summary:**
* Go to `http://localhost:3000/` to see the sample front end app.


#### Transfer Loan from COOP to PHH from FNMA view
#### Transfer Loan from COOP to PHH from COOP view

See the difference between each node's access through the web app.

#### OPTIONAL - Update a LoanPortfolio's `latePercent` and `delinquentPercent` values using a Smart Contract
**Summary:**
* Lambda function updates the LoanPortfolio's metadata, and is here [index.js](src/delinquent/index.js)
* Show one possible application of a Smart Contract, in this case for computation
* Typically done through Vendia Share Web App's Smart Contract View
   * Use loanPortfolioIdentifier `"AAAA1111"` as input



## Step 4 - Demo Loan Securitization Flow

#### Make Loans Available to CSS
**Summary:**
* Permit CSS access to some "performing" loans (and associated payments), which can then be securitized

**Command:**
```bash
cd ..
npm run assignForSecuritization
```

**Notes:**
* **Wait** until ALL payments have been ledgered before executing this command
* CSS view through Entity Explorer will now show some loans and payments

#### Add Security through CSS
**Summary:**
* Create a new security from the CSSNode

**Command:**
```bash
npm run addSecurity
```

**Notes:**
* **Wait** until ALL loan updates required for securitization have been ledgered before executing this command
* CSS and FNMA can view the Security

#### OPTIONAL - Create a Disclosure Calculation using a Smart Contract
**Summary:**
* Lambda function calculates the weighted average interest rate of the security, and is here [index.js](src/wair/index.js) 
* Show one possible application of a Smart Contract, in this case for computation
* Typically done through Vendia Share Web App's Smart Contract View
   * Use securityIdentifier of `"3333ABC33"` and reportingPeriod of `"2021-04"` as input

**Notes:**
* CSSNode and FNMANode will see the disclosure
* Good time to show ledger of all transactions as well, if this wasn't shown previously
