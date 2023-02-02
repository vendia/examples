import dotenv from 'dotenv';
import { ArgumentParser } from 'argparse';
import {GqlMutations} from "./GqlMutations.js";
import {VendiaClient} from "./VendiaClient.js";

dotenv.config({path: "./.share.env"})

console.log(
    "Working with environment variables " +
    "FNMA GQL Url " + process.env.FNMA_GQL_URL +
    "FNMA API Key " + process.env.FNMA_GQL_APIKEY +
    "CSS GQL Url " + process.env.CSS_GQL_URL +
    "CSS API Key " + process.env.CSS_GQL_APIKEY
);

let parser = new ArgumentParser({
    description: 'Vendia Share Smart Contract Creator'
});

parser.add_argument('-t', '--type', { help: 'type of smart contract to create - "upb", "delingquent" or "wair"', required: true});

let args = parser.parse_args();

if(args.type === 'upb') {
    createUpbSmartContract()
} else if(args.type === 'delinquent') {
    createDelinquentSmartContract()
} else if(args.type === 'wair') {
    createWairSmartContract()
}

function createUpbSmartContract() {
    console.debug("Adding upb smart contract")
    let fnmaClient = new VendiaClient(
        process.env.FNMA_GQL_URL,
        {'Authorization': process.env.FNMA_GQL_APIKEY}
    )
    fnmaClient
        .invokeVendiaShare(createUpbSmartContractPayload())
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

function createDelinquentSmartContract() {
    console.debug("Adding wair smart contract")
    let cssClient = new VendiaClient(
        process.env.FNMA_GQL_URL,
        {'Authorization': process.env.FNMA_GQL_APIKEY}
    )
    cssClient
        .invokeVendiaShare(createDelinquentSmartContractPayload())
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

function createWairSmartContract() {
    console.debug("Adding delingquent smart contract")
    let fnmaClient = new VendiaClient(
        process.env.CSS_GQL_URL,
        {'Authorization': process.env.CSS_GQL_APIKEY}
    )
    fnmaClient
        .invokeVendiaShare(createWairSmartContractPayload())
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

function createUpbSmartContractPayload() {
    return {
        query: GqlMutations.smartContractCreationMutation,
        variables: {
            name: 'upb-smart-contract',
            description: 'Smart contract for upb, created programatically',
            inputQuery: GqlMutations.upbInputQuery,
            outputMutation: GqlMutations.upbOutputMutation,
            resource: process.env.UPB_LAMBDA_ARN
        }
    }
}

function createDelinquentSmartContractPayload() {
    return {
        query: GqlMutations.smartContractCreationMutation,
        variables: {
            name: 'delingquent-smart-contract',
            description: 'Smart contract for delingquent, created programatically',
            inputQuery: GqlMutations.delingquentInputQuery,
            outputMutation: GqlMutations.delingquentOutputMutation,
            resource: process.env.DELINQUENT_LAMBDA_ARN
        }
    }
}

function createWairSmartContractPayload() {
    return {
        query: GqlMutations.smartContractCreationMutation,
        variables: {
            name: 'wair-smart-contract',
            description: 'Smart contract for wair, created programatically',
            inputQuery: GqlMutations.wairInputQuery,
            outputMutation: GqlMutations.wairOutputMutation,
            resource: process.env.WAIR_LAMBDA_ARN
        }
    }
}