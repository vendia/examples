# Milestone 6 - Use a Custom GraphQL Client
In this section, you will use a custom GraphQL client, driven from the command line, to add more products and purchase orders and list products stored in your Uni.

# Download Your Binaries
It's time to interact with your Uni using something that isn't included in the Vendia web app. We have created binaries across several platforms that will allow you to interact with you Uni.

|  function | Binaries |
|:---------|:--------|
| addProduct | [windows_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addProduct_windows_amd64.exe) / [darwin_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addProduct_darwin_amd64) / [darwin_arm64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addProduct_darwin_arm64) / [linux_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addProduct_linux_amd64) |
| addPurchaseOrder | [windows_amd64.exe](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addPurchaseOrder_windows_amd64.exe) / [darwin_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addPurchaseOrder_darwin_amd64) / [darwin_arm64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addPurchaseOrder_darwin_arm64) / [linux_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addPurchaseOrder_linux_amd64) |
| listProducts | [windows_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/listProducts_windows_amd64.exe) / [darwin_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/listProducts_darwin_amd64) / [darwin_arm64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/listProducts_darwin_arm64) / [linux_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/listProducts_linux_amd64) | 

Each of the binaries depends upon two environment variables being set - `API` and `API_KEY`. This is how you'll specify the node you'll read from and write to.

## Adding a New Product

The `addProduct` utility can take in the same parameters you used in the built-in GraphQL Explorer. There is built-in `-help` functionality that shares how to pass in parameters.

```bash
API="https://my-api.execute-api.us-east-1.amazonaws.com/graphql/" \
API_KEY="my-key" \
./addProduct_darwin_amd64 -help
Usage of ./addProduct_darwin_amd64:
  -category string
        product category - specialty|natural|conventional
  -description string
        product description
  -name string
        product name
  -price float
        product price
  -promoContent string
        product promotional content
  -sku string
        product sku
  -supplier string
        product supplier
```

**NOTE:** This example is from a Mac OS X (x64) binary. Please update the name of the program and be sure to include `API` and `API_KEY` environment variables based upon your node's configuration.




## Key Takeaways
Congratulations.  You've successfully reached Milestone 6!

In this section you:

* Did some stuff...

For one final (and optional) challenge, check out [Milestone 7](README-Milestone7.md).
