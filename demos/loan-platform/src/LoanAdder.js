import dotenv from 'dotenv'
import fs from 'fs';
import axios from 'axios';
import {GqlMutations} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

console.log("Working with environment variables GQL " + process.env.JPMC_GQL_URL + " and api key " + process.env.JPMC_GQL_APIKEY)

const fsPromises = fs.promises;
const headers = { 'Authorization': process.env.JPMC_GQL_APIKEY }
const loanDirPath = '../data/loans/';

fsPromises
    .readdir(loanDirPath)
    .then(filenames => {
        filenames.forEach(filename => {
            console.log("processing", filename);
            invokeVendiaShare(createRequestPayload(loanDirPath + filename))
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

function createRequestPayload(filepath) {
    let json = fs.readFileSync(filepath);
    let loan = JSON.parse(json);

    console.log("Parsed loan is", loan);

    return {
        query: GqlMutations.addLoanMutation,
        variables: {
            input: loan
        }
    }
}

function invokeVendiaShare(body) {
    return axios.post(
        process.env.JPMC_GQL_URL,
        body,
        { headers: headers }
    )
}
