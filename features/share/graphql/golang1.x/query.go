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
	// Shell variables for the Warehouse node
	api := os.Getenv("API")
	api_key := os.Getenv("API_KEY")

	// Create a client (safe to share across requests)
	client := graphql.NewClient(api)

	request := graphql.NewRequest(`
		query q {
			list_InventoryItems {
				_InventoryItems {
					_id
					itemName
					itemNumber
					quantity
					lastUpdated
				}
			}
		}
	`)

	request.Header.Set("x-api-key", api_key)

	var response struct {
		List_InventoryItems struct {
			InventoryItems []struct {
				Id          string `json:"_id"`
				ItemName    string `json:"itemName"`
				ItemNumber  string `json:"itemNumber"`
				Quantity    int    `json:"quantity"`
				LastUpdated string `json:"lastUpdated"`
			} `json:"_InventoryItems"`
		} `json:"list_InventoryItems"`
	}

	if err := client.Run(context.Background(), request, &response); err != nil {
		panic(err)
	}

	inventory_items := response.List_InventoryItems.InventoryItems

	for _, item := range inventory_items {
		item_json, err := json.MarshalIndent(item, "", "  ")

		if err != nil {
			log.Fatalf(err.Error())
		}

		fmt.Println(string(item_json))
	}

	// map[
	// list_InventoryItems:
	// map[
	// _InventoryItems:[
	// map[
	// _id:017e215e-3b07-45d1-07c7-1b9117c72935 itemName:Thing 1 itemNumber:th001 lastUpdated:2022-01-01T00:00:00Z quantity:100
	// ]
	// map[
	// _id:017e215e-3c60-94a7-c62c-a0cb1393f5d5 itemName:Thing 2 itemNumber:th002 lastUpdated:2022-01-01T00:00:00Z quantity:200
	// ]
	// map[
	// _id:017e215e-3d82-ff72-c516-6c609f145bbf itemName:Thing 3 itemNumber:th003 lastUpdated:2022-01-01T00:00:00Z quantity:300
	// ]
	// ]
	// ]
	// ]
}
