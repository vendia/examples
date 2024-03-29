# Milestone 6 - Interact with GraphQL URLs
In this section, you will use a 3rd party tool, driven from the command line, to add more products and purchase orders and list products stored in your Uni.

# Using cURL

cURL is one of the most popular command line tools used to quickly test out endpoints. For the purpose of this milestone, we will use cURL command to interact with our endpoint.

## Get Programmatic Access
On Vendia UI, go to the node you plan to interact with, and go to the authentication tab. Create yourself a API key by click on `Add API Key`.

You should also get a piece of sample curl command that looks this:
```
  curl 'https:<graphql-url>' \
    -H 'Authorization: <your-api-key>' \
    -H 'content-type: application/json' \
    -H 'accept: application/json' \
    --data-raw '{"query":"query blocksQuery {  listVendia_BlockItems {    Vendia_BlockItems {      blockId      blockHash    }  }}","variables":null,"operationName":"blocksQuery"}' \
    --compressed
```

## Adding a New Product

Let's try to add a product on our node with below Curl command. Make sure you replace the place holders.

```
curl -g \
    -X POST \
    '<your-graphql-endpoint>' \
    -H 'Authorization: <your-api-token>' \
    -H 'content-type: application/json' \
    -H 'accept: application/json' \
    --data-raw '{ "query": "mutation MyMutation { add_Product(input: {name: \"Your Product\", price: 19.99, description: \"Your Favorite Product\"}) { result { _id } }}" }' \
    --compressed
```

You should see a response like this:

```
{"data": {"add_Product": {"result": {"_id": "01852c6d-02f6-7fda-c5cc-47e0933300f1"}}}}%
```

## Adding a New Purchase Order

Let's try to add a new purchase order on our node with below Curl command. Make sure you replace the place holders.

```
curl -g \
    -X POST \
    '<your-graphql-endpoint>' \
    -H 'Authorization: <your-api-token>' \
    -H 'content-type: application/json' \
    -H 'accept: application/json' \
    --data-raw '{ "query": "mutation MyMutation { add_PurchaseOrder(input: {quantity: \"5\", sku: \"abc\", totalPrice: 15.99}) { result { _id } }}" }' \
    --compressed
```

You should see a response like this:
```
{"data": {"add_PurchaseOrder": {"result": {"_id": "01852dbd-ed4a-fdd5-afb6-597c4fa1ffa6"}}}}%
```

## Listing All Products

```
curl -g \
    -X POST \
    '<your-graphql-endpoint>' \
    -H 'Authorization: <your-api-token>' \
    -H 'content-type: application/json' \
    -H 'accept: application/json' \
    --data-raw '{ "query": "query MyQuery { list_ProductItems(limit: 2) { _ProductItems { _id _owner category description name price } }}"}' \
    --compressed
```

You should see a response like this:

```
{"data": {"list_ProductItems": {"_ProductItems": [{"_id": "01852bab-00dc-7052-b3c8-e02c6841a99f", "_owner": "SupplierNode", "category": "natural", "description": "Organic and delicious", "name": "Blue Corn Tortillas Chips", "price": 1.99}, {"_id": "01852bab-020e-0b20-5975-db29d4ad354b", "_owner": "SupplierNode", "category": "specialty", "description": "Imported from Greece", "name": "Sheep's Milk Feta", "price": 2.19}]}}}%
```

## Key Takeaways
Congratulations.  You've successfully reached Milestone 6!

In this portion of the workshop you interacted with your node's GraphQL API using a CLI utility. Vendia is not opinionated about how you interact with data in your Uni. Similar http requests can be written in [Node.js](https://github.com/vendia/examples/tree/main/features/share/graphql/node) or [Python](https://github.com/vendia/examples/tree/main/features/share/graphql/python3) - or a host of [other programming languages](https://graphql.org/code/#language-support). Ultimately, your application is simply interacting with a GraphQL API. We recommend using [Vendia SDK](https://www.vendia.com/docs/share/vendia-client-sdk) for production grade applications.

In this section you:

* Created products using cURL with a node's GraphQL API
* Created a purchase order using cURL interacting with a node's GraphQL API
* Listed all products using cURL interacting with a node's GraphQL API


# GO sample codes (Optional)

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
		add_Product(
		  input: {
			name: $name
			description: $description
			sku: $sku
			category: $category
			price: $price
			promotionalContent: $promotionalContent
			supplier: $supplier
		  }) {
		  transaction {
			transactionId
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
		add_PurchaseOrder(
		  input: {
			sku: $sku,
			quantity: $quantity,
			dateIssued: $dateIssued,
			totalPrice: $totalPrice
		  }) {
		  transaction {
			transactionId
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
Congratulations.  You've successfully reached Milestone 6 Optional section!

In this portion of the workshop you interacted with your node's GraphQL API using a CLI utility. Vendia is not opinionated about how you interact with data in your Uni. The CLI utility was written in golang but could just as easily have been written in [Node.js](https://github.com/vendia/examples/tree/main/features/share/graphql/node) or [Python](https://github.com/vendia/examples/tree/main/features/share/graphql/python3) - or a host of [other programming languages](https://graphql.org/code/#language-support). Ultimately, your application is simply interacting with a GraphQL API.

In this section you:

* Created products using a binary interacting with a node's GraphQL API
* Created a purchase order using a binary interacting with a node's GraphQL API
* Listed all products using a binary interacting with a node's GraphQL API

For one final (and optional) challenge, check out [Milestone 7](README-Milestone7.md).
