import fs from "fs";
import async from "async";
import {parse} from "csv-parse";
import {batchSize, clientConcurrency, filename, parseOptions} from "./Constants.js";
import {GqlMutations} from "./GqlMutations.js";
import {ErrorStore} from "./ErrorStore.js";
import { createVendiaClient } from '@vendia/client';

export class CSVFileProcessor {

    constructor() {
        this.vendiaClient = createVendiaClient({
            apiUrl: process.env.GQL_URL,
            apiKey: process.env.GQL_APIKEY
        });

        this.workQueue = async.queue(async task => { return this.invokeVendiaShare(task) }, clientConcurrency);

        this.errorStore = new ErrorStore()

        this.batch = []

        this.batchCount = 0;
    }

    async processInventoryFile() {
        console.time("Inventory Records Extracted");
        console.time("Inventory Records Ingested");

        fs
            .createReadStream(filename)
            .pipe(parse(parseOptions))
            .on("data", record => {
                this.batch.push(record)
                if(this.batch.length === batchSize) {
                    this.processBatch(this.batch, ++this.batchCount);
                }
            })
            .on("end", async () => {
                console.log("Finished processing all records");

                console.timeEnd("Inventory Records Extracted");

                await this.workQueue.drain();

                console.timeEnd("Inventory Records Ingested");

                this.errorStore.logErrors();
            })
            .on("error", error => {
                console.log(error.message);
            });
    }

    processBatch(batch, batchCount) {
        console.log("Processing batch " + batchCount);

        this.workQueue.push({'batch': batch, 'batchCount': batchCount})

        this.resetBatch();
    }

    async invokeVendiaShare(task) {
        let { query, variables } = GqlMutations.createInventoryMutation(task.batch);

        try {
            await this.vendiaClient.request(query, variables)
            console.log("Successful GQL call for batch " + task.batchCount);
        } catch(error) {
            console.error("Unsuccessful GQL call for batch " + task.batchCount)
            this.errorStore.addError(error?.response?.status || "UNKNOWN")
        }
    }

    resetBatch() {
        this.batch = [];
    }

}
