import dotenv from 'dotenv'
import fs from 'fs';
import { parse } from 'csv-parse';
import { columns } from './Constants.js'
import {VendiaClient} from "../../../features/share/smart-contracts/src/VendiaClient.js";

dotenv.config({path: "./.share.env"})

const filename = "../data/large-data-set.csv";
const batchSize = 10

let batch = []
let batchCount = 1;

let vendiaClient = new VendiaClient(
    process.env.GQL_URL,
    { 'Authorization': process.env.GQL_APIKEY }
);

fs.createReadStream(filename)
    .pipe(parse({
        delimiter: ",",
        from_line: 2,
        columns: columns,
        cast: true,
        cast_date: true
    }))
    .on("data", function (record) {
        batch.push(record)
        if(batch.length == batchSize) {
            console.log("Completing batch " + batchCount);
            sendToShare(batch, batchCount);
            nextBatch();
        }
    })
    .on("end", function () {
        console.log("Finished processing all rows");
    })
    .on("error", function (error) {
        console.log(error.message);
    });

function sendToShare(batch, batchCount) {
    vendiaClient
        .invokeVendiaShare(createInventoryMutation(batch))
        .then(response => {
            console.log("Create inventory response status", response.status)
            if(response?.data?.errors) {
                throw new Error("GraphQL response included errors for batch " + batchCount)
            }
        })
        .catch(error => {
            console.error("Failed to invoke Vendia Share", error)
        })
}

function createInventoryMutation(batch) {
    let variables = {}

    Array.from(Array(batch.length).keys()).forEach(index => {
        variables["input" + index] = batch[index]
    })

    return {
        query: createMutationString(batch.length),
        variables: variables
    }
}

function createMutationString(size) {
    let inputs = []

    Array.from(Array(size).keys()).forEach(index => {
        inputs.push("$input" + index + ": Self_Inventory_Input_!")
    })

    let operations = []
    Array.from(Array(size).keys()).forEach(index => {
        operations.push(`
            entry${index}: add_Inventory(
                input: $input${index}, 
                syncMode: ASYNC
            ) {
                transaction {
                  transactionId
                }
            }
        `)
    })

    let mutationString = `
        mutation AddInventoryItems(
            ${inputs.join(',')}
        ) {
          ${operations.join('\n')}
        }`;

    return mutationString
}

function nextBatch() {
    batch = [];
    batchCount++;
}
