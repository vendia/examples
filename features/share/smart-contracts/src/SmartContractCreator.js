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

let args = parser.parse_args();
let requestPayload = null;

if(args.type == 'validation') {
    console.debug("Adding validation smart contract")
    requestPayload = createValidationSmartContractPayload()
}

invokeVendiaShare(requestPayload)
    .then(response => {
        console.debug("Response status", response.status)
        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors", response.data.errors)
        }
        console.debug("Smart contract created", response.data)
    })
    .catch(error => {
        console.error("Failed to invoke Vendia Share", error)
    })

function createValidationSmartContractPayload() {
    return {
        query: GqlMutations.smartContractMutation,
        variables: {
            name: 'validation-smart-contract',
            description: 'Smart contract for validation, created programatically',
            inputQuery: GqlMutations.validationInputQuery,
            outputMutation: GqlMutations.validationOutputMutation,
            resource: process.env.VALIDATION_LAMBDA_ARN
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