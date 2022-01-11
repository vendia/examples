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
	// Shell variables for the Warehouse node
	api := os.Getenv("API")
	api_key := os.Getenv("API_KEY")

	itemNamePtr := flag.String("itemname", "Thing 1", "inventory name")
	quantityPtr := flag.Int("quantity", 1, "item quantity")

	flag.Parse()

	// Create a client (safe to share across requests)
	client := graphql.NewClient(api)

	getId := graphql.NewRequest(`
	  query q($itemName:String) {
		list_InventoryItems(filter: {itemName: {eq: $itemName}}) {
		  _InventoryItems {
			_id
		  }
		}
	  }
	`)

	getId.Var("itemName", *itemNamePtr)
	getId.Header.Set("x-api-key", api_key)

	var getIdResponse struct {
		List_InventoryItems struct {
			InventoryItems []struct {
				Id string `json:"_id"`
			} `json:"_InventoryItems"`
		} `json:"list_InventoryItems"`
	}

	if err := client.Run(context.Background(), getId, &getIdResponse); err != nil {
		panic(err)
	}

	inventory_item_id := getIdResponse.List_InventoryItems.InventoryItems[0].Id

	currentTime := time.Now()

	updateQuantity := graphql.NewRequest(`
	mutation m(
		$id: ID!,
		$quantity: Int,
		$lastUpdated: String
	) {
		update_Inventory_async(
		  id: $id,
		  input: {
			quantity: $quantity
			lastUpdated: $lastUpdated
		  }
		) {
		  error
		  result {
			_id
		  }
		}
	  }
	`)

	updateQuantity.Var("id", inventory_item_id)
	updateQuantity.Var("quantity", quantityPtr)
	updateQuantity.Var("lastUpdated", currentTime.Format("2006-01-02T15:04:05Z"))
	updateQuantity.Header.Set("x-api-key", api_key)

	if err := client.Run(context.Background(), updateQuantity, nil); err != nil {
		panic(err)
	}

	fmt.Printf("%s quantity: %d\n", *itemNamePtr, *quantityPtr)
}
