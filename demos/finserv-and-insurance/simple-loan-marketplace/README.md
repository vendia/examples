# Vendia Share Demo - Easily Create a Loan Marketplace

[Vendia Share](https://www.vendia.net) is the real-time data cloud for rapidly building applications that securely share data across departments, companies, clouds, and regions.  

## Demo Overview

* __Level__
    * Basic
* __Highlighted Features__
    * Uni Creation
    * GraphQL Explorer
    * Entity Explorer

This demo highlights the ease of creating a multi-party data sharing solution, using the Vendia Share platform, as applied to the Financial Services industry. 

## Demo Context
Specifically, this demo explores a LoanOriginator and a LoanServicer who use Vendia Share to share loan data in real-time.  Prior to using Vendia Share, the LoanOriginator and LoanServicer often struggled to maintain a consistent, shared source of truth for loan information.   Since adopting Vendia Share, they dramatically decreased the time and resource spent on data reconciliation between their isolated loan databases, streamlined their loan origination-to-servicing transition process, decreased payment penalties (e.g. fees for late  property tax payments), and improved their customer satisfaction scores.

## Demo Pre-Requisites

* [Vendia Share Account](https://share.vendia.net/signup)

__NOTE:__ The remaining pre-reqs are optional and only required if you want to use the Programmatic steps of this demo.  If you prefer to use the Share web app exclusively, you can move on to the next section.

To complete the Programmatic steps of this demo, you'll need the following:

* [Git Client](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [Vendia Share CLI](https://vendia.net/docs/share/cli)

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

## Step 1 - Create a Multi-Party Uni
To create a Uni, you can use either the [Share Web Application](https://share.vendia.net) or the [Share CLI](https://vendia.net/docs/share/cli).

### Create a Uni using the Share Web Application
To create a Uni using the Share Web Application:

1. Click the `+ Create Universal Application` button
1. Select the `Create your own` option
1. Enter a unique name, prefixed with `test-`, and then click `Next`
1. Define an `OriginatorNode` and a `ServicerNode`
    1. Feel free to vary the `Node region` but leave the other defaults the same
1. Click the checkbox on each node definition and then click `Next`
1. Copy the contents of [schema.json](uni_configuration/schema.json) into the `Uni Schema` text area
    1. Be sure to remove all existing content prior to copying in the new content
1. Scroll to the bottom of the page an expand the `Initial State` section
1. Copy the contents of [initial-state.json](uni_configuration/initial-state.json) into the `Inital State` text area
1. Click `Create`

Wait about 5 minutes for the Uni to reach a `Running` state.

### Create a Uni Programmatically
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

## Step 2 - Explore the Uni
Using the Share Web App, explore the Uni and its nodes in more detail.

### Uni Views
Select a Uni by name from the Uni listing to view Uni details.  These views are accessible directly under the Uni's name from the Uni details view.

* __Partner Nodes__ - A list of all partner nodes.  In this demo, there are none as you're acting on behalf of both participants.
* __Schema__ - The schema for the Uni, which is identical to [schema.json](uni_configuration/schema.json)
* __Transactions__ - All transactions of the Uni, and their corresponding block in the distributed ledger 
* __Uni Settings__ - Participant listing and Uni management functions

### Node Configuration Views
Click the `Manage node` button to view node details.  These views are accessible using the left menu of the Node details view.

* __Resources__ - All underlying cloud resources for the node
* __Success Notifications__ - Integrations used to notify when a successful transaction occurs in the Uni
* __Error Notifications__ - Integrations used to notify when a failed transaction occurs on the Node
* __Ingress__ - Management of inbound, asynchronous processing channels

### Node Views
* __Entity Explorer__ - A visual tool for exploring and changing the scalar contents of the node
* __GraphQL Explorer__ - A GraphQL-centric tool for exploring and changing the contents of the node
* __File Explorer__ - A visual tool for exploring and changing the file contents of the node
* __Smart Contracts__ -  A tool for managing the Smart Contracts of the node

## Step 3 - Explore the Pre-Loaded Data of the Uni
The `initial-state.json` file referenced in Step 1 was used to seed the Uni with data.  Creating a Uni based on an initial, known set of data can simplify development and testing.

You can now explore that data using several of the Node Views mentioned in the last step.

### Explore Data using Entity Explorer
You can view data using the Entity Explorer view from either node in the Uni.

**NOTE:** Vendia's security model allows users to see Unis and nodes they have access to. You are able to work with either node because both nodes were created with the same user.

1. Click `Entity Explorer` on either node
1. View both `Loan` items
    1. Columns allow sorting
    1. Clicking on an `_id` value shows a detailed view of the `Loan`
    1. Clicking on `View history` from the detailed view shows all version of the `Loan` over time
1. View the `Loan Perforamnce` items
    1. Repeat the same sub-steps from above
    
### Explore Data using GraphQL Explorer
You can view data using the GraphQL Explorer view from either node in the Uni.

1. Click `GraphQL Explorer` on either node
1. List all `Loan` items
    ```graphql
    query ListLoans {
      list_LoanItems {
        _LoanItems {
          _id
          _owner
          borrowerCreditScore
          loanIdentifier
          numberOfUnits
          originalInterestRate
          originalLoanToValue
          originalUnpaidPrincipalBalance
          originationDate
        }
      }
    }
    ```

1. List all `LoanPerformance` items
    ```graphql
    query ListLoanPerformance {
      list_LoanPerformanceItems {
        _LoanPerformanceItems {
          _id
          _owner
          currentInterestRate
          currentUnpaidPrincipalBalance
          lastPaidInstallmentDate
          loanDelinquencyStatus
          loanIdentifier
          monthlyReportingPeriod
          servicerId
        }
      }
    }
    ```
1. Filter `LoanPerformance` items by `currentInterestRate`
    ```graphql
    query ListLoanPerformance {
      list_LoanPerformanceItems(filter: {currentInterestRate: {lt: 3.00}}) {
        _LoanPerformanceItems {
          _id
          _owner
          currentInterestRate
          currentUnpaidPrincipalBalance
          lastPaidInstallmentDate
          loanDelinquencyStatus
          loanIdentifier
          monthlyReportingPeriod
          servicerId
        }
      }
    }    
    ```

## Step 4 - Add a LoanPerformance Record
You can also add new data to the Uni using either the Entity Explorer or GraphQL Explorer.

### Add Data using Entity Explorer
You can add data using the Entity Explorer view from either node in the Uni.

1. Click `Entity Explorer` on either node
1. Click `LoanPerformance` on the left-most pane
1. Click `+ Create LoanPerformance`
1. Enter values for each field
    1. `loanIdentifier` - `23456`
    1. `monthlyReportingPeriod` - `05/01/2022`
    1. `servicerId` - `54321`
    1. `loanDelinquencyStatus` - `current`
    1. `lastPaidInstallmentDate` - `04/01/2022`
    1. `currentInterestRate` - `2.75`
    1. `currentUnpaidPrincipalBalance` - `551000`
1. Click `Save`
1. Wait for the indicator in the bottom-right to provide confirmation
1. View the new `LoanPerformance` entry in the table

### Add Data using GraphQL Explorer
You can add data using the GraphQL Explorer view from either node in the Uni.

1. Click `GraphQL Explorer` on either node
1. Add a `LoanPerformance` item using the mutation below
    ```graphql
    mutation AddLoanPerformance {
      add_LoanPerformance(
        input: { lastPaidInstallmentDate: "2022-04-01", loanIdentifier: "23456", monthlyReportingPeriod: "2022-05-01", servicerId: "54321", currentInterestRate: 2.75, currentUnpaidPrincipalBalance: 551000, loanDelinquencyStatus: current }) {
          transaction {
            transactionId
            _owner
          }
        }
      }
    
    ```
1. Confirm the `LoanPerformance` item is included in the list of all items
    ```graphql
    query ListLoanPerformance {
      list_LoanPerformanceItems {
        _LoanPerformanceItems {
          _id
          _owner
          currentInterestRate
          currentUnpaidPrincipalBalance
          lastPaidInstallmentDate
          loanDelinquencyStatus
          loanIdentifier
          monthlyReportingPeriod
          servicerId
        }
      }
    }
    ```

## Step 5 - Update a LoanPerformance Record
You can update existing data using either the Entity Explorer or GraphQL Explorer.

### Update Data using Entity Explorer
You can update data using the Entity Explorer view from either node in the Uni.

1. Click `Entity Explorer` on either node
1. Click `LoanPerformance` on the left-most pane
1. Select one of the records by clicking its `_id` value
1. Modify the `currentUnpaidPrincipalBalance` value and click `Save`
1. Once the indicator in the bottom-right confirms the save, click the `View history` button
1. Review the changes between the two versions of this record

### Update Data using GraphQL Explorer
You can update data using the GraphQL Explorer view from either node in the Uni.

1. Click `GraphQL Explorer` on either node
1. List all `LoanPerformance` records
    ```graphql
    query ListLoanPerformance {
      list_LoanPerformanceItems {
        _LoanPerformanceItems {
          _id
          _owner
          currentInterestRate
          currentUnpaidPrincipalBalance
          lastPaidInstallmentDate
          loanDelinquencyStatus
          loanIdentifier
          monthlyReportingPeriod
          servicerId
        }
      }
    }
    ```
1. Copy the `_id` value of one of the records - this is the record your will modify in the next step
1. Execute this mutation to modify the `unpaidPrincipalBalance` of the `LoanPerformance` record identified in the previous step.
    1. __NOTE__: The `id` value in the mutation below should be modified to reflect the `id` value you copied in the previous step.
    
   ```graphql
    mutation UpdateLoanPerformance {
      update_LoanPerformance(
        id: "017f2389-b33e-3e52-c7e6-76e60628cb23"
        input: {currentUnpaidPrincipalBalance: 549000}, ) {
          transaction {
            transactionId
            _owner
          }
        }
      }    
    ```
1. Confirm the update `LoanPerformance` record is reflected in the list of all items
     ```graphql
     query ListLoanPerformance {
       list_LoanPerformanceItems {
         _LoanPerformanceItems {
           _id
           _owner
           currentInterestRate
           currentUnpaidPrincipalBalance
           lastPaidInstallmentDate
           loanDelinquencyStatus
           loanIdentifier
           monthlyReportingPeriod
           servicerId
         }
       }
     }
     ```
## Demo Conclusion
Through these simple steps, you explored the basics of Vendia Share.  

For more advanced features, please explore additional [demos](../../../demos).
