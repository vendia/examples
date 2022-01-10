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
}
