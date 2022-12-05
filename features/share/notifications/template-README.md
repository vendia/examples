<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

<!-- All images cannot be rendered in this template because the template is meant to be put under <type>-notification/<tools>/README.md. Once that is created everything will show up. -->


# Integrate Success Notification With \<Place-Holder>

## Purpose
Fill in why we are writing this.

# Prerequisites
* Completed the setup in accordance with this [README.md](../../README.md)
* \<requirement>
* \<requirement>

## UI Setup
1. \<steps 1 - x> setting things up in UI
2. \<steps x - n> subscription confirmation piece that can be in both UI and GraphQL
3. Your notification setup is completed. Now let's [VALIDATE](#notification-validation) it's working properly.

## GraphQL Setup

1. \<steps 1 - x> setting things up using graphQL
2. \<steps x - n> subscription confirmation piece that can be in both UI and GraphQL
3. Your notification setup is completed. Now let's [VALIDATE](#notification-validation) it's working properly.

## Notification Validation
To ensure our notification is working properly, we just have to create a new block in our Uni. Basically that means any changes is fine. For the purpose of our validation, let's use GraphQL Explorer for this task.

<!-- step 1 and 2 are reusable for all examples -->

1. Go to `PrimaryNode`'s detail page and click on `GraphQL Explorer`: 

![click-graphql](../../image/re-usable/click-grahql-explorer.png)

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

![graphql-mutation-result](../../image/re-usable/create-new-block.png)

<!-- Step 3 will be unique to each section and depends on the tools you use. -->
3. \<write what needs to be done at tool level to see if things are working>


4. You are able to use mutation id to get more information and use this notification to trigger other activities. But that will be outside the scope of this guide. Enjoy your data sharing journey!

# Additional Resources

* https://www.vendia.com/docs/share/integrations