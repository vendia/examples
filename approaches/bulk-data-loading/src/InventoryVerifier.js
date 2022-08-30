import {checkDelay, inventoryRecordSize, maxInventoryChecks} from "./Constants.js";
import { createVendiaClient } from '@vendia/client';

export class InventoryVerifier {

    constructor() {
        this.vendiaClient = createVendiaClient({
            apiUrl: process.env.GQL_URL,
            apiKey: process.env.GQL_APIKEY
        });
    }

    async waitForCompleteInventory() {
        let actualInventorySize = 0;
        let actualInventoryChecks = 0;

        console.log("Checking if inventory is complete");

        console.time("Inventory Records Ledgered");

        while(actualInventorySize < inventoryRecordSize && actualInventoryChecks < maxInventoryChecks) {

            actualInventoryChecks++;
            actualInventorySize = await this.getInventorySize();

            console.log("Current inventory size is " + actualInventorySize +
                " and actualInventoryChecks is " + actualInventoryChecks)

            if(actualInventorySize < inventoryRecordSize) {
                console.log("Inventory is incomplete - will try again shortly");
                await this.delay(checkDelay * 1000)
            } else {
                console.log("Inventory is complete!");
                console.timeEnd("Inventory Records Ledgered");
            }
        }
    }

    async getInventorySize() {
        console.log("Calculating inventory size");

        let actualInventorySize = 0;
        let resultPageCount = 0;
        let nextToken = null;
        let lastPageFound = false;

        try {
            while(actualInventorySize < inventoryRecordSize && !lastPageFound) {
                resultPageCount++;

                //console.log("Getting inventory results - page " + resultPageCount);

                let response = null;

                if(nextToken == null) {
                    //console.log("Next token is null - starting a fresh query")
                    response = await this.vendiaClient.entities.inventory.list();
                } else {
                    //console.log("Next token is NOT null - continuing a query")
                    response = await this.vendiaClient.entities.inventory.list({
                        nextToken: nextToken
                    })
                }

                let itemCount = response?.items?.length;
                nextToken = response?.nextToken;

                //console.log("Got itemsCount " + itemCount + " and nextToken " + nextToken);

                if(!isNaN(itemCount)) {
                    actualInventorySize += itemCount;

                    if(nextToken == null) {
                        lastPageFound = true;
                    }

                    console.log("Calculated inventory size " + actualInventorySize + " and lastPageFound " + lastPageFound);
                }
            }
        } catch(error) {
            console.error("Received error when getting inventory size - exiting early");
        }

        console.log("Inventory Stats - Size: " + actualInventorySize + " Result Pages: " + resultPageCount);

        return actualInventorySize;
    }

    async delay(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }
}
