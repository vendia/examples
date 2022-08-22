import fs from "fs";
import async from "async";
import {parse} from "csv-parse";
import {batchSize, clientConcurrency, filename, parseOptions} from "./Constants.js";
import {GqlMutations} from "./GqlMutations.js";
import {VendiaClient} from "./VendiaClient.js";
import {ErrorStore} from "./ErrorStore.js";

export class CSVFileProcessor {

    constructor() {
        this.vendiaClient = new VendiaClient(
            process.env.GQL_URL,
            { 'Authorization': process.env.GQL_APIKEY }
        );

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

        this.workQueue
            .push({'batch': batch})
            .then(response => {
                console.log("Response for batch " + batchCount + " status " + response.status)

                if(response?.data?.errors) {
                    console.error("Invoking Vendia Share resulted in GQL errors for batch " + batchCount)
                    this.errorStore.addError(response.status)
                }
            })
            .catch(error => {
                console.error("Failed to invoke Vendia Share for batch " + batchCount)
                this.errorStore.addError(error?.response?.status || "UNKNOWN")
            });

        this.resetBatch();
    }

    invokeVendiaShare(task) {
        return this.vendiaClient.invokeVendiaShare(GqlMutations.createInventoryMutation(task.batch))
    }

    resetBatch() {
        this.batch = [];
    }

}
