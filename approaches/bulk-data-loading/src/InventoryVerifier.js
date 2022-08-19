import {createInventoryListNextPageQuery, createInventoryListQuery} from "./GqlMutations.js";
import {VendiaClient} from "./VendiaClient.js";
import {checkDelay, inventoryRecordSize, maxInventoryChecks} from "./Constants.js";

export class InventoryVerifier {

    vendiaClient = new VendiaClient(
        process.env.GQL_URL,
        { 'Authorization': process.env.GQL_APIKEY }
    );

    async waitForCompleteInventory() {
        let actualInventorySize = 0;
        let actualInventoryChecks = 0;

        console.log("Checking if inventory is complete");

        while(actualInventorySize < inventoryRecordSize && actualInventoryChecks < maxInventoryChecks) {

            actualInventoryChecks++;
            actualInventorySize = await this.getInventorySize();

            console.log("Current inventory size is " + actualInventorySize + " and actualInventoryChecks is " + actualInventoryChecks)

            if(actualInventorySize < inventoryRecordSize) {
                console.log("Inventory is incomplete - will try again shortly");
                await this.delay(checkDelay * 1000)
            } else {
                console.log("Inventory is complete!");
            }
        }
    }

    async getInventorySize() {
        console.log("Calculating inventory size");

        let actualInventorySize = 0;
        let resultPageCount = 0;
        let nextToken = null;
        let lastPageFound = false;

        while(actualInventorySize < inventoryRecordSize && !lastPageFound) {
            console.log("Getting inventory results - page " + ++resultPageCount);

            let response = null;

            if(nextToken == null) {
                console.log("Next token is null - starting a fresh query")
                response = await this.vendiaClient.invokeVendiaShare(createInventoryListQuery());
            } else {
                console.log("Next token is NOT null - continuing a query")
                response = await this.vendiaClient.invokeVendiaShare(createInventoryListNextPageQuery(nextToken));
            }

            let itemCount = response?.data?.data?.list_InventoryItems?._InventoryItems?.length;
            nextToken = response?.data?.data?.list_InventoryItems?.nextToken;

            console.log("Got itemsCount " + itemCount + " and nextToken " + nextToken);

            actualInventorySize += itemCount;

            if(nextToken == null) {
                lastPageFound = true;
            }

            console.log("Actual inventory size " + actualInventorySize + " and lastPageFound " + lastPageFound);
        }

        console.log("Final stats - inventory size: " + actualInventorySize + " result pages: " + resultPageCount);

        return actualInventorySize;
    }

    async delay(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }
}
