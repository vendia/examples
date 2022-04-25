import dotenv from 'dotenv';
import axios from 'axios';
import { ArgumentParser } from 'argparse';
import {GqlMutations} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

console.log("Working with environment variables GQL " + process.env.ORIGINATOR_GQL_URL + " and api key " + process.env.ORIGINATOR_GQL_APIKEY)

const headers = { 'x-api-key': process.env.ORIGINATOR_GQL_APIKEY }

let parser = new ArgumentParser({
    description: 'Vendia Share Smart Contract Creator'
});

parser.add_argument('-t', '--type', { help: 'type of smart contract to create - "validation", "enrichment" or "computation"', required: true});
parser.add_argument('-i', '--smartContractIdentifier', { help: 'smart contract unique identifier - should start with "vrn:"', required: true});
parser.add_argument('-l', '--loanIdentifier', { help: 'smart contract unique identifier - should start with "vrn:"', required: true});

let args = parser.parse_args();
let smartContractIdentifier = args.smartContractIdentifier
let loanIdentifier = args.loanIdentifier

console.debug("Invoking smart contract " + smartContractIdentifier + " for loan " + loanIdentifier)

invokeVendiaShare(createSmartContractInvocationPayload(smartContractIdentifier))
    .then(response => {
        console.debug("Response status", response.status)
        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors", response.data.errors)
        }
        console.debug("Smart contract invoked", response.data)
    })
    .catch(error => {
        console.error("Failed to invoke Vendia Share", error)
    })

function createSmartContractInvocationPayload() {
    let queryArgs = {
        loanIdentifier: loanIdentifier
    }

    return {
        query: GqlMutations.smartContractInvocationMutation,
        variables: {
            id: smartContractIdentifier,
            queryArgs: JSON.stringify(queryArgs)
        }
    }
}

function invokeVendiaShare(body) {
    return axios.post(
        process.env.ORIGINATOR_GQL_URL,
        body,
        { headers: headers }
    )
}