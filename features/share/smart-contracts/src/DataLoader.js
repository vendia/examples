import dotenv from 'dotenv'
import fs from 'fs';
import {GqlMutations} from "./GqlMutations.js";
import {VendiaClient} from "./VendiaClient.js";

dotenv.config({path: "./.share.env"})

console.log(
    "Working with environment variables" +
    "Lender GQL Url " + process.env.LENDER_GQL_URL +
    "Lender API Key " + process.env.LENDER_GQL_APIKEY +
    "Servicer GQL Url" + process.env.SERVICER_GQL_URL +
    "Servicer API Key" + process.env.SERVICER_GQL_APIKEY
);

const fsPromises = fs.promises;
const loanDirPath = '../data/loans/';

let lenderClient = new VendiaClient(
    process.env.LENDER_GQL_URL,
    { 'x-api-key': process.env.LENDER_GQL_APIKEY }
);

let servicerClient = new VendiaClient(
    process.env.SERVICER_GQL_URL,
    { 'x-api-key': process.env.SERVICER_GQL_APIKEY }
);

fsPromises
    .readdir(loanDirPath)
    .then(filenames => {
        filenames.forEach(filename => {
            console.log("processing", filename);

            lenderClient
                .invokeVendiaShare(createLoanMutation(loanDirPath + filename))
                .then(response => {
                    console.log("Creat loan response status", response.status)
                    if(response?.data?.errors) {
                        throw new Error("GraphQL response included errors for " + filename, )
                    }
                })
                .catch(error => {
                    console.error("Failed to invoke Vendia Share", error)
                })
        })
    })

servicerClient
    .invokeVendiaShare(createPortfolioMutation())
    .then(response => {
        console.log("Create portfolio response status", response.status)
        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors for loan portfolio")
        }
    })
    .catch(error => {
        console.error("Failed to invoke Vendia Share", error)
    })

function createLoanMutation(filepath) {
    let json = fs.readFileSync(filepath);
    let loan = JSON.parse(json);

    //console.log("Parsed loan is", loan);

    return {
        query: GqlMutations.addLoanMutation,
        variables: {
            input: loan
        }
    }
}

function createPortfolioMutation() {
    return {
        query: GqlMutations.addPortfolioMutation
    }
}

