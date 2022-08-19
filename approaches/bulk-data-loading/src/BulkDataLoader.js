import dotenv from 'dotenv'
import fs from 'fs';
import {parse} from 'csv-parse';
import {batchSize, filename, parseOptions} from './Constants.js'
import {InventoryVerifier} from "./InventoryVerifier.js";
import {VendiaClient} from "./VendiaClient.js";
import {createInventoryMutation} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

const vendiaClient = new VendiaClient(
    process.env.GQL_URL,
    { 'Authorization': process.env.GQL_APIKEY }
)

let batch = []
let batchCount = 1;
let errorMap = {}

fs
    .createReadStream(filename)
    .pipe(parse(parseOptions))
    .on("data", function (record) {
        batch.push(record)
        if(batch.length === batchSize) {
            console.log("Batch " + batchCount + " is ready");
            processBatch(batch, batchCount);
        }
    })
    .on("end", function () {
        console.log("Finished processing all records");
    })
    .on("error", function (error) {
        console.log(error.message);
    });

await new InventoryVerifier().waitForCompleteInventory();

if(Object.keys(errorMap).length > 0) {
    console.log("Error map", errorMap);
} else {
    console.log("No errors :)");
}

function processBatch(batch, batchCount) {
    console.log("Processing batch " + batchCount);

    vendiaClient
        .invokeVendiaShare(createInventoryMutation(batch))
        .then(response => {
            console.log("Response for batch " + batchCount + " status " + response.status)

            if(response?.data?.errors) {
                console.error("Invoking Vendia Share resulted in GQL errors for batch " + batchCount)
                addToErrorMap(response.status)
            }
        })
        .catch(error => {
            console.error("Failed to invoke Vendia Share for batch " + batchCount, error)
            addToErrorMap(error?.response?.status || "UNKNOWN")
        })

    nextBatch();
}

function addToErrorMap(status) {
    if(errorMap[status] == null) {
        errorMap[status] = 0;
    }
    errorMap[status] = errorMap[status] + 1;
}

function nextBatch() {
    batch = [];
    batchCount++;
}
