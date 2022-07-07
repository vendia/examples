<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Reacting to Events from Vendia Share using Azure Functions

In this example, we'll use a cross-cloud [Universal Application](https://www.vendia.net/product) to demonstrate
real-time, event-driven processing using Azure Functions. Consider the case of a Supplier (on AWS), working through a
Distributor (on AWS), who delivers goods to a Retailer (on Azure). When the Supplier makes an adjustment (say by
changing the anticipated fulfillment date of an existing purchase order), both the Distributor and the Retailer would
like to be made aware (and take action) immediately.

<figure>
  <img src="https://user-images.githubusercontent.com/85032783/147981825-f0e94c34-6488-4fd3-82f4-7ef8e00224a2.png" width="100%"/>
  <figcaption align="center"><b>Figure 1</b> - <i>A Supplier, Distributor, and Retailer reacting in real-time across clouds as changes to purchase orders occur</i></figcaption>
</figure>

We'll start by modifying the fulfillment date of a purchase order by executing
a [GraphQL mutation](https://graphql.org/learn/queries/#mutations) against the Supplier's Node in the Uni. That, in
turn, will cause an event to flow to Retailer's Node in the Uni and then to the Retailer's Azure environment, delivered
to [Azure Event Grid](https://azure.microsoft.com/en-us/services/event-grid/). From there, an
event-driven [Azure Function](https://azure.microsoft.com/en-us/services/functions/) within the Retailer's Azure
environment will process the delivered event.

Now let's get started!

## Step 0 - Prerequisites

Before getting started with this example, we'll first need to:

* Create a [Vendia Share account](https://share.vendia.net/)
* Create an [Azure account](https://azure.microsoft.com/en-us/free/)
* Install [Node.js](https://nodejs.org/en/download/)
* Install the [Azure Command Line Interface](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (CLI)
* Install the [Vendia Command Line Interface](https://www.vendia.net/docs/share/cli) (CLI)

## Step 1 - Create a Cross-Cloud Vendia Uni

Our first step is to create a cross-cloud Uni for this example, with the following participants:

* A **SupplierNode** (on AWS in `us-east-2`)
* A **DistributorNode** AWS Node (on AWS in `us-west-2`)
* A **RetailerNode** (on Azure in `eastus`)

This is accomplished using a `registration.json` file that defines one Node per Uni participant. Each Node definition
includes a `csp` (short for cloud service provider) and a `region`, which
is [unique to each CSP](https://www.vendia.net/docs/share/cli/guide#supported-cloud-platforms-and-regions). Using the
example below, we're able to provision a multi-cloud, multi-region Uni that connects all three participants in just
about 5 minutes.

**Note:** Please refer to our docs for more information about the modeling Uni participants
using [a registration file](https://www.vendia.net/docs/share/uni-creation#registration-file) or modeling data
using [a schema file](https://www.vendia.net/docs/share/data-modeling#sample-registration-files).

1. Change directories to `uni_configuration`
    * `cd uni_configuration`
1. Copy the `registration.json.sample` file to `registration.json`
    * `cp registration.json.sample registration.json`
1. Modify the `registration.json` file
    * Replace value of the Uni's `name` with a unique name for your Uni, hereafter referred to as `<UNI_NAME>`
    * Replace the value of each Node's `userId` with the email address associated with your Vendia account for all 3
      Node definitions
1. Login to the Share CLI
    * `share auth login`
1. Create a Uni
    * `share uni create --config registration.json`
1. Wait about 5 minutes for the Uni to be created
    * `share uni get --uni <UNI_NAME>`
1. Proceed only after the Uni state has transitioned to `RUNNING`
    <details>
      <summary>Uni Get Output</summary>

      ```bash
      Getting <UNI_NAME> info...
      ┌─────────────────────┐
      │   Uni Information   │
      └─────────────────────┘
    
      Uni Name:    <UNI_NAME>.unis.vendia.net
      Uni Status:  RUNNING
      Node Count:  3
      Nodes Info:  ...
      ```
    </details>

## Step 2 - Create an Azure Service Principal

A multi-cloud, multi-region Uni allows its participants - the Supplier, the Distributor, and the Retailer - to create
and modify Products and Purchase Orders. A participant can then integrate its Vendia Share Node with services in their
cloud service provider (CSP) of choice in order to immediately detect and act upon Uni events.

Our next step is to connect the Vendia **RetailerNode** with an Azure CSP environment. This mimics a common integration
approach, where a Retailer has an existing Azure CSP environment and wants to use CSP services to produce or consume
data from its Vendia Share Node.

When your Uni reaches a `RUNNING` state, you'll have a multi-cloud, multi-region Uni, including a Retailer Node. To
permit the **RetailerNode** to send events to an Azure CSP environment secured by
an [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/) (Azure AD) tenant, we need to
create
a [Service Principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object)
within Azure AD.

1. Change directories back to the root directory of this example
    * `cd ..`
1. Login to your Azure environment using the Azure CLI
    * `az login`
    *
    The [Azure Subscription ID](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-how-subscriptions-associated-directory)
    is returned in `id` field of the CLI output of the previous command, hereafter referred to
    as `<AZURE_SUBSCRIPTION_ID>`
      <details>
          <summary>Sample Azure Login CLI Output</summary>

          [
              {
              "cloudName": "AzureCloud",
              "homeTenantId": "<AZURE_TENANT_ID>",
              "id": "<AZURE_SUBSCRIPTION_ID>",
              "isDefault": true,
              "managedByTenants": [],
              "name": "Azure subscription 1",
              "state": "Enabled",
              "tenantId": "<AZURE_TENANT_ID>",
              "user": {
                      "name": "<AZURE_USERNAME>",
                      "type": "user"
                  }
              }
          ]
     </details>

1. Set the Azure Subscription ID against which future Azure CLI commands will execute
    * `az account set --subscription "<AZURE_SUBSCRIPTION_ID>"`
1. To confirm the Azure Event Grid used to relay events from Share to your Azure environment is ready for use, we must
   first [register Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/custom-event-quickstart#enable-the-event-grid-resource-provider)
   as a provider
    * `az provider register --namespace Microsoft.EventGrid`
1. Wait until the provider is in the `Registered` state
    * `az provider show --namespace Microsoft.EventGrid --query "registrationState"`
1. Use the Vendia CLI to determine the Azure AD Application ID for your newly provisioned **RetailerNode** (the **
   RetailerNode** in the Uni).
    * `share uni get --uni <UNI_NAME>`
    * In the CLI output of the above command, note the value of the `Retailer.Resources.azure_ApplicationId` property.
      The value hereafter will be referred to as `<RETAILER_NODE_APPLICATION_ID>`.
1. Now it's time to permit connections between the automatically created Vendia tenant for the **RetailerNode** and your
   Azure tenant using a Service Principal. After running the command below, note the Service Principal's ID (`objectId`)
   from the output for future reference, hereafter referred to as `<SERVICE_PRINCIPAL_ID>`.
    * `az ad sp create --id "<RETAILER_NODE_APPLICATION_ID>"`
    * In the CLI output of the above command, note the value of the `objectId` property. The value hereafter will be
      referred to as `<SERVICE_PRINCIPAL_ID>`.

## Step 3 - Create an Azure Function

Now that the Service Principal is configured to permit the **RetailerNode** to emit events to services within your Azure
environment, there are several integration options at our disposal. The integration option we'll explore here is an
Azure Function that takes action when an event is received. In this example, consider a Supplier that makes a Purchase
Order adjustment (changing the expected fulfillment date) and a Retailer that wants to take immediate action (changing
dates for promoting a popular sale, as a result).

To create an Azure Function:

1. Set the Azure CLI to store our parameters between steps in this section
    * `az config param-persist on`
1. Create an Azure Resource Group in the same region as the **RetailerNode**. Note that `eastus` in the command below
   matches the value in the `registration.json.sample` file but should be changed if you've adjusted the region in
   your `registration.json` file.
    * `az group create --name retailer-function-rg --location eastus`
1. Create an Azure Storage Account
    * `az storage account create --name retailerfuncstorage --sku Standard_LRS`
1. Create an Azure Function App. Note that the parameters in the command below match the values in
   the `registration.json.sample` file and the provided directory structure. Any changes to either should be reflected
   in the command below.
    * `az functionapp create --consumption-plan-location eastus --runtime python --runtime-version 3.8 --functions-version 3 --name retailer-functionapp --os-type linux`
    * In the CLI output of the above command, note the value of the `id` property. The value hereafter will be referred
      to as `<FUNCTION_APP_RESOURCE_ID>`.
1. Publish the `retailer-function`
    * `func azure functionapp publish retailer-functionapp`
1. Grant the Service Principal permission to call the published Azure Function
   `az role assignment create --assignee "<SERVICE_PRINCIPAL_ID>" --role "Website Contributor" --scope "<FUNCTION_APP_RESOURCE_ID>"`
1. Open the [Vendia Share web application](https://share.vendia.net/uni) and click your Uni’s name. Find the **
   RetailerNode** and click on its `GraphQL explorer` button. Clear the sample query in the middle pane, and insert the
   mutation below.
    <details>
    <summary>Update Azure Settings Mutation</summary>

      ```
      mutation updateAzureSettings {
        updateVendia_Settings(
          input: {
            azure: {
              defaultTenantId: "<AZURE_TENANT_ID>"
              defaultSubscriptionId: "<AZURE_SUBSCRIPTION_ID>"
              blockReportFunctions: [
                {
                  resourceGroupName: "<AZURE_RESOURCE_GROUP>"
                  functionAppName: "<AZURE_FUNCTION_APP_NAME>"
                  functionName: "<AZURE_FUNCTION_NAME>"
                }
              ]
            }
          }) {
          transaction {
            _id
            _owner
            transactionId
            submissionTime
            version
          }
        }
      }
      ```
    </details>

    * Be sure to update the mutation values as they pertain to your Azure environment:
        * **<AZURE_TENANT_ID>** - The ID of
          the [Azure AD tenant](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-how-to-find-tenant#find-tenant-id-with-cli)
          within which your Azure Function resides
        * **<AZURE_SUBSCRIPTION_ID>** - The Subscription ID of the Azure AD tenant within which your Azure Function
          resides
        * **<AZURE_RESOURCE_GROUP>** - The name of
          the [resource group](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) that contains your
          Azure Function App.
        * **<AZURE_FUNCTION_APP_NAME>** - The name of
          your [Azure Function App](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp)
          .
        * **<AZURE_FUNCTION_NAME>** - The name of your Azure Function App Function, which can be found by clicking into
          the Function App and then clicking `Functions`

1. Verify the settings were updated as expected before continuing

    <details>
      <summary>Get Azure Settings Query</summary>

      ```
      query getAzureSettings {
        getVendia_Settings {
          azure {
            blockReportFunctions {
              functionName
              functionAppName
              resourceGroupName
            }
            defaultSubscriptionId
            defaultTenantId
          }
        }
      }
      ```
    </details>

## Step 4 - React in Real-Time Events on Azure

Now it's time for the Supplier (from its **SupplierNode**) to make a Purchase Order adjustment. When that happens, the
Retailer (from its **RetailerNode**) will be notified immediately and will be able to take action (through its
configured Azure Function).

1. Using the Vendia Share Web Application's GraphQL Explorer of the **SupplierNode**, identify a Purchase Order to
   modify, noting the `_id` for one of the Purchase Orders listed for the subsequent step, referred to hereafter
   as `<PO_ID>`

    <details>
      <summary>List Purchase Orders Query</summary>

      ```
      query listPurchaseOrders {
        list_PurchaseOrderItems {
          _PurchaseOrderItems {
            _id
            _owner
            created
            expected
            fulfilled
            orderId
            updated
            items {
              quantity
              sku
            }
          }
        }
      }
      ```
    </details>

1. Execute a GraphQL mutation (or use Vendia Share's Entity Explorer to make an equivalent update without any GraphQL)
   to modify the PO identified in the previous step

    <details>
      <summary>Update Purchase Order Mutation</summary>

      ```
      mutation updatePurchaseOrder {
        update_PurchaseOrder(
          id: "<PO_ID>",
          input: {
            expected: "2022-01-03T00:00:00Z"
          }) {
          transaction {
            _id
            _owner
            submissionTime
            transactionId
            version
          }
        }
      }
      ```
    </details>

The update to the **SupplierNode** will cause a block notification event to be emitted from the **RetailerNode**. Thanks
to the configuration in previous sections, an Azure Function will receive and process the block notification event. We
can now view the output of the Azure Function, which was triggered through the **RetailerNode**, using the
Azure-provided [Application Insights](https://docs.microsoft.com/en-us/azure/azure-functions/analyze-telemetry-data)
view.

<figure>
  <img src="https://user-images.githubusercontent.com/85032783/147982095-1d1602ee-616f-4b81-b455-463fe7857429.png" width="100%"/>
  <figcaption align="center"><b>Figure 2</b> - <i>The Azure Function output after successfully processing an event delivered from the <b>RetailerNode</b></i></figcaption>
</figure>
