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
	shipPtr := flag.Int("ship", 1, "quantity to ship")

	flag.Parse()

	// Create a client (safe to share across requests)
	client := graphql.NewClient(api)

	getId := graphql.NewRequest(`
	  query listInventoryItems($itemName:String) {
		list_InventoryItems(filter: {itemName: {eq: $itemName}}) {
		  _InventoryItems {
			_id
			quantity
		  }
		}
	  }
	`)

	getId.Var("itemName", *itemNamePtr)
	getId.Header.Set("x-api-key", api_key)

	var getIdResponse struct {
		List_InventoryItems struct {
			InventoryItems []struct {
				Id       string `json:"_id"`
				Quantity int    `json:"quantity"`
			} `json:"_InventoryItems"`
		} `json:"list_InventoryItems"`
	}

	if err := client.Run(context.Background(), getId, &getIdResponse); err != nil {
		panic(err)
	}

	inventoryItemId := getIdResponse.List_InventoryItems.InventoryItems[0].Id
	fmt.Printf("_id: %s\n", inventoryItemId)

	quantity := getIdResponse.List_InventoryItems.InventoryItems[0].Quantity
	fmt.Printf("quantity: %d\n", quantity)

	currentTime := time.Now()

	newQuantity := quantity - *shipPtr
	fmt.Printf("newQuantity: %d\n", newQuantity)

	fmt.Printf("shipQuantity: %d\n", *shipPtr)

	updateQuantity := graphql.NewRequest(`
		mutation updateInventory(
			$id: ID!,
			$newQuantity: Int,
			$lastUpdated: String
			$shipQuantity: Int
		) {
			update_Inventory_async(
			id: $id,
			input: {
				quantity: $newQuantity
				lastUpdated: $lastUpdated
			}
			condition: {
				quantity: {ge: $shipQuantity}
			}
			) {
			error
			result {
				_id
			}
			}
		}
	`)

	updateQuantity.Var("id", inventoryItemId)
	updateQuantity.Var("newQuantity", newQuantity)
	updateQuantity.Var("shipQuantity", *shipPtr)
	updateQuantity.Var("lastUpdated", currentTime.Format("2006-01-02T15:04:05Z"))
	updateQuantity.Header.Set("x-api-key", api_key)

	if err := client.Run(context.Background(), updateQuantity, nil); err != nil {
		panic(err)
	}

	fmt.Printf("Submitted shipment request for processing (%d of %s)\n", *shipPtr, *itemNamePtr)
}
