# Milestone 6 - Use a Custom GraphQL Client
In this section, you will use a custom GraphQL client, driven from the command line, to add more products and purchase orders and list products stored in your Uni.

# Download Your Binaries
It's time to interact with your Uni using something that isn't included in the Vendia web app. We have created binaries across several platforms that will allow you to interact with you Uni. The binaries were written using [Golang](https://go.dev/).

|  Function | Binaries |
|:---------|:--------|
| addProduct | [windows_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addProduct_windows_amd64.exe) / [darwin_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addProduct_darwin_amd64) / [darwin_arm64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addProduct_darwin_arm64) / [linux_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addProduct_linux_amd64) |
| addPurchaseOrder | [windows_amd64.exe](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addPurchaseOrder_windows_amd64.exe) / [darwin_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addPurchaseOrder_darwin_amd64) / [darwin_arm64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addPurchaseOrder_darwin_arm64) / [linux_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/addPurchaseOrder_linux_amd64) |
| listProducts | [windows_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/listProducts_windows_amd64.exe) / [darwin_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/listProducts_darwin_amd64) / [darwin_arm64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/listProducts_darwin_arm64) / [linux_amd64](https://vendia-workshop-artifacts.s3.amazonaws.com/food-and-beverage/optimized-distribution/listProducts_linux_amd64) | 

Each of the binaries depends upon two environment variables - `API` and `API_KEY`. This is how you'll specify the node you'll read from and write to.

## Adding a New Product

The `addProduct` utility can take in the same parameters you used in the built-in GraphQL Explorer. There is a built-in `-help` function that details the command line arguments the utility accepts.

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

Experiment and add add a new product.

```
API="https://my-api.execute-api.us-east-1.amazonaws.com/graphql/" \
API_KEY="my-key" \
./addProduct_darwin_amd64 -name "My Awesome Product" \
-description "So awesome. Much product" -sku abc123 \
-price 9.99 -supplier "Awesome Supplier" \
-category conventional
```

<details>
<summary>Validate output from from addProduct</summary>

<img width="1319" alt="new-product" src="https://user-images.githubusercontent.com/71095088/151473760-662b5251-f5a3-4335-9422-9f4c44bd0b9d.png">
</details>

Examine the source code - you'll find a standard GraphQL mutation that updates your Uni.

<details>
<summary>Source code for addProduct.go</summary>

The following code was use to build the `addProduct` binaries.

```
package main

import (
	"context"
	"flag"
	"fmt"
	"os"

	"github.com/machinebox/graphql"
)

func main() {
	// Shell variables for the Uni node
	api, ok := os.LookupEnv("API")
	if !ok {
		panic("API environment variable not set")
	}

	api_key, ok := os.LookupEnv("API_KEY")
	if !ok {
		panic("API_KEY environment variable not set")
	}

	namePtr := flag.String("name", "", "product name")
	descriptionPtr := flag.String("description", "", "product description")
	skuPtr := flag.String("sku", "", "product sku")
	categoryPtr := flag.String("category", "", "product category - specialty|natural|conventional")
	pricePtr := flag.Float64("price", 0.00, "product price")
	promoContentPtr := flag.String("promoContent", "", "product promotional content")
	supplierPtr := flag.String("supplier", "", "product supplier")

	flag.Parse()

	// Create a client (safe to share across requests)
	client := graphql.NewClient(api)

	addProduct := graphql.NewRequest(`
	mutation addProduct(
		$name: String,
		$description: String,
		$sku: String,
		$category: Self_Product_categoryEnum,
		$price: Float,
		$promotionalContent: String,
		$supplier: String
	) {
		add_Product_async(
		  input: {
			name: $name
			description: $description
			sku: $sku
			category: $category
			price: $price
			promotionalContent: $promotionalContent
			supplier: $supplier
		  }
		) {
		  error
		  result {
			_id
		  }
		}
	  }
	`)

	addProduct.Var("name", namePtr)
	addProduct.Var("description", descriptionPtr)
	addProduct.Var("sku", skuPtr)
	addProduct.Var("category", categoryPtr)
	addProduct.Var("price", pricePtr)
	addProduct.Var("promotionalContent", promoContentPtr)
	addProduct.Var("supplier", supplierPtr)
	addProduct.Header.Set("x-api-key", api_key)

	if err := client.Run(context.Background(), addProduct, nil); err != nil {
		panic(err)
	}

	fmt.Printf("%s successfully added\n", *namePtr)
}
```
</details>

**NOTE:** These examples are from the Mac OS X (x64) binary. Please update the name of the program and be sure to include `API` and `API_KEY` environment variables based upon your node's configuration.

## Adding a New Purchase Order

The `addPurchaseOrder` utility can take in the same parameters you used in the built-in GraphQL Explorer. There is a built-in `-help` function that details the command line arguments the utility accepts.

```bash
API="https://my-api.execute-api.us-east-1.amazonaws.com/graphql/" \
API_KEY="my-key" \
./addPurchaseOrder_darwin_amd64 -help
Usage of ./addPurchaseOrder_darwin_amd64:
  -dateIssued string
        date purchase order issued (default "2022-01-27")
  -quantity string
        purchase order quantity
  -sku string
        product sku
  -totalPrice float
        total price of purchase order
```

Experiment and add add a new purchase order.

```
API="https://my-api.execute-api.us-east-1.amazonaws.com/graphql/" \
API_KEY="my-key" \
./addPurchaseOrder_darwin_amd64 -sku xyx321 \
-quantity 4321 -totalPrice 9999.99
```

<details>
<summary>Validate output from addPurchaseOrder</summary>

<img width="1320" alt="new-purchase-order" src="https://user-images.githubusercontent.com/71095088/151477267-82173b7a-0d13-4a48-8944-bb69d86cea90.png">
</details>

Examine the source code - you'll find a standard GraphQL mutation that updates your Uni.

<details>
<summary>Source code for addPurchaseOrder.go</summary>

The following code was use to build the `addPurchaseOrder` binaries.

```
package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/machinebox/graphql"
)

func main() {
	// Shell variables for the Uni node
	api, ok := os.LookupEnv("API")
	if !ok {
		panic("API environment variable not set")
	}

	api_key, ok := os.LookupEnv("API_KEY")
	if !ok {
		panic("API_KEY environment variable not set")
	}

	currentDate := time.Now().Format("2006-01-02")

	dateIssuedPtr := flag.String("dateIssued", currentDate, "date purchase order issued")
	quantityPtr := flag.String("quantity", "", "purchase order quantity")
	skuPtr := flag.String("sku", "", "product sku")
	totalPricePtr := flag.Float64("totalPrice", 0.00, "total price of purchase order")

	flag.Parse()

	// Create a client (safe to share across requests)
	client := graphql.NewClient(api)

	// getId.Header.Set("x-api-key", api_key)

	addPurchaseOrder := graphql.NewRequest(`
	mutation addPurchaseOrder(
		$sku: String,
		$quantity: String,
		$dateIssued: String,
		$totalPrice: Float
	) {
		add_PurchaseOrder_async(
		  input: {
			sku: $sku,
			quantity: $quantity,
			dateIssued: $dateIssued,
			totalPrice: $totalPrice
		  }
		) {
		  error
		  result {
			_id
		  }
		}
	  }
	`)

	addPurchaseOrder.Var("quantity", quantityPtr)
	addPurchaseOrder.Var("dateIssued", dateIssuedPtr)
	addPurchaseOrder.Var("sku", skuPtr)
	addPurchaseOrder.Var("totalPrice", totalPricePtr)
	addPurchaseOrder.Header.Set("x-api-key", api_key)

	if err := client.Run(context.Background(), addPurchaseOrder, nil); err != nil {
		panic(err)
	}

	fmt.Printf("Successfully added PO for %s\n", *skuPtr)
}
```
</details>

**NOTE:** These examples are from the Mac OS X (x64) binary. Please update the name of the program and be sure to include `API` and `API_KEY` environment variables based upon your node's configuration.

## Listing All Products

The `listProducts` utility can take in the same parameters you used in the built-in GraphQL Explorer. There is built-in `-help` functionality that shares how to pass in parameters.

```bash
API="https://my-api.execute-api.us-east-1.amazonaws.com/graphql/" \
API_KEY="my-key" \
./listProducts_darwin_amd64
```

<details>
<summary>Validate output from listProducts</summary>

<img width="1324" alt="list-products" src="https://user-images.githubusercontent.com/71095088/151479136-f373f2bc-40d8-4a5d-907b-d2f5e00f33cd.png">
</details>

Examine the source code - you'll find a standard GraphQL mutation that lists products in your Uni.

<details>
<summary>Source code for listProducts.go</summary>

The following code was use to build the `listProducts` binaries.

```
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/machinebox/graphql"
)

func main() {
	// Shell variables for the Uni node
	api, ok := os.LookupEnv("API")
	if !ok {
		panic("API environment variable not set")
	}

	api_key, ok := os.LookupEnv("API_KEY")
	if !ok {
		panic("API_KEY environment variable not set")
	}

	// Create a client (safe to share across requests)
	client := graphql.NewClient(api)

	request := graphql.NewRequest(`
		query listProducts {
			list_ProductItems {
				_ProductItems {
					name
					description
					sku
					category
					price
					supplier
					promotionalContent
				}
			}
		}
	`)

	request.Header.Set("x-api-key", api_key)

	var response struct {
		List_ProductItems struct {
			ProductItems []struct {
				Id                 string  `json:"_id"`
				Name               string  `json:"name"`
				Description        string  `json:"description"`
				Sku                string  `json:"sku"`
				Category           string  `json:"category"`
				Price              float64 `json:"price"`
				Supplier           string  `json:"supplier"`
				PromotionalContent string  `json:"promotionalContent"`
			} `json:"_ProductItems"`
		} `json:"list_ProductItems"`
	}

	if err := client.Run(context.Background(), request, &response); err != nil {
		panic(err)
	}

	inventory_items := response.List_ProductItems.ProductItems

	for _, item := range inventory_items {
		item_json, err := json.MarshalIndent(item, "", "  ")

		if err != nil {
			log.Fatalf(err.Error())
		}

		fmt.Println(string(item_json))

	}
}
```
</details>

**NOTE:** These examples are from the Mac OS X (x64) binary. Please update the name of the program and be sure to include `API` and `API_KEY` environment variables based upon your node's configuration.


## Key Takeaways
Congratulations.  You've successfully reached Milestone 6!

In this portion of the workshop you interacted with your node's GraphQL API using a CLI utility. Vendia is not opinionated about how you interact with data in your Uni. The CLI utility was written in golang but could just as easily have been written in [Node.js](https://github.com/vendia/examples/tree/main/features/share/graphql/node) or [Python](https://github.com/vendia/examples/tree/main/features/share/graphql/python3) - or a host of [other programming languages](https://graphql.org/code/#language-support). Ultimately, your application is simply interacting with a GraphQL API.

In this section you:

* Created products using a binary interacting with a node's GraphQL API
* Created a purchase order using a binary interacting with a node's GraphQL API
* Listed all products using a binary interacting with a node's GraphQL API

For one final (and optional) challenge, check out [Milestone 7](README-Milestone7.md).
