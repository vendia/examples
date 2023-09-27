<p align="center">
  <a href="https://vendia.net/">
    <img src="https://share.vendia.net/logo.svg" alt="vendia logo" width="250px">
  </a>
</p>

<!-- All images cannot be rendered in this template because the template is meant to be put under <type>-notification/<tools>/README.md. Once that is created everything will show up. -->


# Integrate Success/Error Notification With \<Place-Holder>

## Purpose
This is a guide on how to set up success/error notifications to <tool-name>. Note that all notification examples include 2 parts: UI Setup & GraphQL setup. Readers don't have to go through both cases.

# Prerequisites
* Completed the setup in accordance with this [README.md](../../README.md)
* \<requirement>
* \<requirement>

## UI Setup
1. Click on the Uni you created. If you created according to previous guide, it should be named something like this `test-<your-uni-name>`
![click-test-uni](../../img/re-usable/click-test-uni.png)

2. Click on the Node you need notification for. In this case, let's choose `PrimaryNode`.
![click-primary-node](../../img/re-usable/click-primary-node.png)

3. On Node detail page, click on `Manage Node`
![click-manage-node](../../img/re-usable/click-manage-node.png)

4. On `Manage Node` page, click on `Success Nofitifications` tab:

![click-success-notification](../../img/success/click-success-notification.png)

4. On `Manage Node` page, click on `Error Nofitifications` tab:

![click-error-notification](../../img/error/click-error-notification.png)

1. \<steps 1 - x> setting things up in UI
2. \<steps x - n> subscription confirmation piece that can be in both UI and GraphQL
3. Your notification setup is completed. Now let's [VALIDATE](#notification-validation) it's working properly.

## GraphQL Setup

1. Go to `PrimaryNode`'s detail page and click on `GraphQL Explorer`: 

![click-graphql](../../img/re-usable/click-grahql-explorer.png)

2. Clear your GraphQL explorer editor. Copy this piece of GraphQL code, replace `<change-this-to-fit-blow-snippet>` to your info, and paste it into the editor. Then click the start button.

1. \<steps 1 - x> setting things up using graphQL
2. \<steps x - n> subscription confirmation piece that can be in both UI and GraphQL
3. Your notification setup is completed. Now let's [VALIDATE](#notification-validation) it's working properly.

## Notification Validation
To ensure our notification is working properly, we just have to create a new block in our Uni. Basically that means any changes is fine. For the purpose of our validation, let's use GraphQL Explorer for this task.

<!-- step 1 and 2 are reusable for all examples -->

1. Go to `PrimaryNode`'s detail page and click on `GraphQL Explorer`: 

![click-graphql](../../img/re-usable/click-grahql-explorer.png)

<!-- Two step 2s are provided for success and error cases respectively -->

2. Clear your GraphQL explorer editor. Copy this piece of GraphQL code and paste it into the editor. Then click the start button.
```
mutation MyMutation {
  add_Product(
    input: {description: "testing notification", name: "notify me", price: 1.5, size: M, sku: "54321"}
    syncMode: NODE_COMMITTED
  ) {
    result {
      _id
    }
  }
}
```
* It should look like this:

![graphql-mutation-result](../../img/re-usable/create-new-block.png)

2. Clear your GraphQL explorer editor. Copy this piece of GraphQL code and paste it into the editor. Then click the start button.
```
mutation MyMutation {
  update_Product(
    input: {price: 1.5}
    condition: {price: {eq: 999}}
    id: "123"
    syncMode: NODE_LEDGERED
  ) {
    result {
      _id
    }
  }
}

# Note that we are making a condition that will never be matched to generate the error.
```
* It should look like this:

![graphql-mutation-result](../../img/re-usable/create-new-error.png)

<!-- Step 3 will be unique to each section and depends on the tools you use. -->
3. \<write what needs to be done at tool level to see if things are working>

* Note: Unlike success notification, error notifications takes longer to be triggered. If you don't get anything after 20-30 minutes. Report it to Vendia.

4. You are able to use mutation id to get more information and use this notification to trigger other activities. But that will be outside the scope of this guide. Enjoy your data sharing journey!

# Additional Resources

* https://www.vendia.com/docs/share/integrations