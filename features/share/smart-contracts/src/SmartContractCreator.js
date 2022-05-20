import dotenv from 'dotenv';
import { ArgumentParser } from 'argparse';
import {GqlMutations} from "./GqlMutations.js";
import {VendiaClient} from "./VendiaClient";

dotenv.config({path: "./.share.env"})

console.log(
    "Working with environment variables" +
    "Lender GQL Url " + process.env.LENDER_GQL_URL +
    "Lender API Key " + process.env.LENDER_GQL_APIKEY +
    "Servicer GQL Url" + process.env.SERVICER_GQL_URL +
    "Servicer API Key" + process.env.SERVICER_GQL_APIKEY
);

let parser = new ArgumentParser({
    description: 'Vendia Share Smart Contract Creator'
});

parser.add_argument('-t', '--type', { help: 'type of smart contract to create - "validation", "enrichment" or "computation"', required: true});

let args = parser.parse_args();

if(args.type === 'validation') {
   createValidationSmartContract()
} else if(args.type === 'computation') {
    createComputationSmartContract()
}

function createValidationSmartContract() {
    console.debug("Adding validation smart contract")
    let lenderClient = new VendiaClient(
        process.env.LENDER_GQL_URL,
        {'x-api-key': process.env.LENDER_GQL_APIKEY}
    )
    lenderClient
        .invokeVendiaShare(createValidationSmartContractPayload())
        .then(response => {
            console.debug("Response status", response.status)
            if(response?.data?.errors) {
                throw new Error("GraphQL response included errors")
            }
            console.debug("Smart contract created", response.data)
        })
        .catch(error => {
            console.error("Failed to invoke Vendia Share", error)
        })
}

function createComputationSmartContract() {
    console.debug("Adding computation smart contract")
    let lenderClient = new VendiaClient(
        process.env.SERVICER_GQL_URL,
        {'x-api-key': process.env.SERVICER_GQL_APIKEY}
    )
    lenderClient
        .invokeVendiaShare(createComputationSmartContractPayload())
        .then(response => {
            console.debug("Response status", response.status)
            if(response?.data?.errors) {
                throw new Error("GraphQL response included errors")
            }
            console.debug("Smart contract created", response.data)
        })
        .catch(error => {
            console.error("Failed to invoke Vendia Share", error)
        })
}

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

function createComputationSmartContractPayload() {
    return {
        query: GqlMutations.smartContractMutation,
        variables: {
            name: 'computation-smart-contract',
            description: 'Smart contract for computation, created programatically',
            inputQuery: GqlMutations.computatiohInputQuery,
            outputMutation: GqlMutations.computationOutputMutation,
            resource: process.env.COMPUTATION_LAMBDA_ARN
        }
    }
}