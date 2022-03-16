# Milestone 5 - Enable Event-Driven Notifications
In this section, you will enable notifications that let the Distributor know a delivery is on its way.  You will then trigger an event by modifying an existing delivery to verify the notifications are sent when the Supplier makes a change.

## Configure Event-Driven Notifications from the DistributorNode
Modifying the settings of the **DistributorNode** can be done using either the `GraphQL Explorer`, the `Entity Explorer`, or the `Share CLI`.

### Update the DistributorNode's Settings
You will update the **DistributorNode** to enable email notifications anytime a new block is added to the Vendia Share ledger.  These `blockNotifications` contain information that can be used by the recipient to retrieve additional information, including the transaction submitted that resulted in a new [block](https://www.vendia.net/docs/share/terms-and-definitions#block) and even the mutations that were included in the transaction.  For simplicity, you will simply attempt to receieve block notifications from the **DistributorNode**.

* Open the `GraphQL Explorer` of the **DistributorNode**. Remove any existing content from the middle pane.

* Copy and paste the mutation below and then execute it to enable block notification emails from **DistributorNode** 
    * **Note:** replace `you@domain.com` with your email address

```
mutation enableBlockNotificationEmails {
  updateVendia_Settings(
    input: {
      blockReportEmails: ["you@domain.com"]
    }, 
    syncMode: ASYNC) {
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

### Confirming the DistributorNode's Settings
There are several ways to confirm the **DistributorNode** successfully applied the settings submitted in the previous section.

#### Using the GraphQL Explorer 
* Open the `GraphQL Explorer` of the **DistributorNode**. Remove any existing content from the middle pane.

* Copy and paste the query below and then execute it to review the block notification email settings from **DistributorNode**
```
query getSettings {
  getVendia_Settings {
    _owner
    blockReportEmails
  }
}
```

**Note:** Running the query above against the **SupplierNode** (i.e. using the **SupplierNode**'s GraphQL Explorer) will produce a different result, as expected, since the block notifications emails are only enabled on the **DistributorNode**.

#### Using the Node Details View
* Click on the `Manage node` button in the upper-right corner of the  **DistributorNode** display
* Click on the `Success Notifications` option in the left menu pane
* Confirm the email address you configured to received block notification emails is included in the list of `Emails` displayed 

### AWS Email Approval
Wait for an email (from AWS) to confirm your desire to receive block notification emails.  

**Note:** If you don't confirm your subscription, you won't receive block notification emails.

**Note:** It may take several minutes for the AWS wiring to take effect.  Good time for a cup of coffee.

## Confirm Event-Driven Notifications from the DistributorNode

The Supplier is ready to make the delivery.  When this change occurs, the Distributor will receive a notification via the block notification email.

### Making a Delivery
The Supplier will update the delivery record to reflect the change in delivery status now that the delivery is out.

* Open the `Entity Explorer` of the **SupplierNode**
* Select `Delivery` in the left navigation pane
* Select the delivery by clicking on its `_id` value
* Click on the `Edit` button
* Modify the `staus` to `enroute`
* Save the changes

**Note:** If a block notification email is not received, it may mean the AWS wiring is not yet in place.  You can wait a few more minutes before making another change to the delivery from the **SupplierNode**, which should trigger a notification.

### Examine the Block Report Email
You should receive an email based on the update to the delivery record in the previous step.

* Sender will be
    ```
    no-reply@sns.amazonaws.com
    ```
* Subject will be similar to
    ```
    Block #000000000000011
    ```

* Body will be similar to 
    ```
    {"blockId": "000000000000011", "blockHash": "1e570ea53abc1dadb6d508570322745fe87a844dfa341efce4ec291b39f09372", "mutations": [{"_id": "017e99ac-7cbc-f569-7414-4336525aa993", "_owner": "SupplierNode"}]}
    ```

## Key Takeaways
Congratulations.  You've successfully reached Milestone 5!

In this section you:

* Configured the **DistributorNode** to receive block notification emails, one of many [integration options](https://www.vendia.net/docs/share/integrations) Vendia Share provides
* Modified a delivery, through the **SupplierNode** to reflect a delivery status update, triggering a block notification email, from the **DistributorNode**

You've used the Vendia Share `GraphQL Explorer` and `Entity Explorer` to drive the interactions with each node's GraphQL API. Time to try something different in [Milestone 6](README-Milestone6.md).
