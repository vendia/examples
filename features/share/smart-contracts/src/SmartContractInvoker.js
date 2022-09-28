import dotenv from 'dotenv';
import { ArgumentParser } from 'argparse';
import {GqlMutations} from "./GqlMutations.js";
import {VendiaClient} from "./VendiaClient.js";

dotenv.config({path: "./.share.env"})

console.log(
    "Working with environment variables " +
    "Lender GQL Url " + process.env.LENDER_GQL_URL +
    "Lender API Key " + process.env.LENDER_GQL_APIKEY +
    "Servicer GQL Url " + process.env.SERVICER_GQL_URL +
    "Servicer API Key " + process.env.SERVICER_GQL_APIKEY
);

let parser = new ArgumentParser({
    description: 'Vendia Share Smart Contract Creator'
});

parser.add_argument('-t', '--type', { help: 'type of smart contract to invoke - "validation", "enrichment" or "computation"', required: true});
parser.add_argument('-i', '--smartContractIdentifier', { help: 'smart contract unique identifier - should start with "vrn:"', required: true});
parser.add_argument('-l', '--loanIdentifier', { help: 'loan identifier - only used for the "validation" smart contract', required: false});

let args = parser.parse_args();

if(args.type === 'validation') {
    invokeValidationSmartContract(
        args.smartContractIdentifier,
        args.loanIdentifier
    )
} else if(args.type === 'computation') {
    invokeComputationSmartContract(
        args.smartContractIdentifier
    )
} else if(args.type === 'enrichment') {
    invokeEnrichmentSmartContract(
        args.smartContractIdentifier,
        args.loanIdentifier
    )
}

function invokeValidationSmartContract(smartContractId, loanId) {
    console.debug("Invoking validation smart contract " + smartContractId + " for loan " + loanId)
    let lenderClient = new VendiaClient(
        process.env.LENDER_GQL_URL,
        {'Authorization': process.env.LENDER_GQL_APIKEY}
    )
    lenderClient
        .invokeVendiaShare(createValidationSmartContractPayload(smartContractId, loanId))
        .then(response => {
            console.debug("Response status", response.status)
            if(response?.data?.errors) {
                throw new Error("GraphQL response included errors")
            }
            console.debug("Smart contract invoked", response.data)
        })
        .catch(error => {
            console.error("Failed to invoke Vendia Share", error)
        })
}

function invokeComputationSmartContract(smartContractId, loanId) {
    console.debug("Invoking computation smart contract " + smartContractId)
    let servicerClient = new VendiaClient(
        process.env.SERVICER_GQL_URL,
        {'Authorization': process.env.SERVICER_GQL_APIKEY}
    )
    servicerClient
        .invokeVendiaShare(createComputationSmartContractPayload(smartContractId))
        .then(response => {
            console.debug("Response status", response.status)
            if(response?.data?.errors) {
                throw new Error("GraphQL response included errors")
            }
            console.debug("Smart contract invoked", response.data)
        })
        .catch(error => {
            console.error("Failed to invoke Vendia Share", error)
        })
}

function invokeEnrichmentSmartContract(smartContractId, loanId) {
    console.debug("Invoking validation smart contract " + smartContractId + " for loan " + loanId)
    let lenderClient = new VendiaClient(
        process.env.LENDER_GQL_URL,
        {'Authorization': process.env.LENDER_GQL_APIKEY}
    )
    lenderClient
        .invokeVendiaShare(createEnrichmentSmartContractPayload(smartContractId, loanId))
        .then(response => {
            console.debug("Response status", response.status)
            if(response?.data?.errors) {
                throw new Error("GraphQL response included errors")
            }
            console.debug("Smart contract invoked", response.data)
        })
        .catch(error => {
            console.error("Failed to invoke Vendia Share", error)
        })
}

function createValidationSmartContractPayload(smartContractIdentifier, loanId) {
    let queryArgs = {
        loanIdentifier: loanId
    }

    return {
        query: GqlMutations.smartContractInvocationMutation,
        variables: {
            id: smartContractIdentifier,
            queryArgs: JSON.stringify(queryArgs)
        }
    }
}

function createComputationSmartContractPayload(smartContractIdentifier) {
    let queryArgs = {
        portfolioIdentifier: "AAAA1111"
    }

    return {
        query: GqlMutations.smartContractInvocationMutation,
        variables: {
            id: smartContractIdentifier,
            queryArgs: JSON.stringify(queryArgs)
        }
    }
}

function createEnrichmentSmartContractPayload(smartContractIdentifier, loanId) {
    let queryArgs = {
        loanIdentifier: loanId
    }

    let invokeArgs = {
        additionalResources: [
            {
                description: "Option 1 - HUD Payment Programs for Homeowners",
                uri: "https://www.hud.gov/sites/dfiles/Main/documents/HUDPrograms2020.pdf"
            },
            {
                description: "Option 2 - FNMA Payment Programs for Homeowners",
                uri: "https://www.knowyouroptions.com/loanlookup"
            }
        ]
    }

    return {
        query: GqlMutations.smartContractInvocationMutation,
        variables: {
            id: smartContractIdentifier,
            queryArgs: JSON.stringify(queryArgs),
            invokeArgs: JSON.stringify(invokeArgs)
        }
    }
}
