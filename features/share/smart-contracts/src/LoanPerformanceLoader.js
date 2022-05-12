import dotenv from 'dotenv'
import fs from 'fs';
import axios from 'axios';
import {GqlMutations} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

console.log("Working with environment variables GQL " + process.env.SERVICER_GQL_URL + " and api key " + process.env.SERVICER_GQL_APIKEY)

const fsPromises = fs.promises;
const headers = { 'x-api-key': process.env.SERVICER_GQL_APIKEY }
const performanceDirPath = '../resources/performance/';

fsPromises
    .readdir(performanceDirPath)
    .then(filenames => {
        filenames.forEach(filename => {
            console.log("processing", filename);
            let json = fs.readFileSync(performanceDirPath + filename);
            let records = JSON.parse(json);
            records.forEach(record => {
                invokeVendiaShare(createRequestPayload(record))
                    .then(response => {
                        console.log("Response status", response.status)
                        if(response?.data?.errors) {
                            throw new Error("GraphQL response included errors for " + filename, response.data.errors)
                        }
                    })
                    .catch(error => {
                        console.error("Failed to invoke Vendia Share", error)
                    })
            })
        })
    })

function createRequestPayload(record) {
    console.log("Parsed performance record is", record);

    return {
        query: GqlMutations.addPerformanceMutation,
        variables: {
            input: record
        }
    }
}

function invokeVendiaShare(body) {
    return axios.post(
        process.env.SERVICER_GQL_URL,
        body,
        { headers: headers }
    )
}