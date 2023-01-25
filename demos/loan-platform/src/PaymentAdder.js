import dotenv from 'dotenv'
import fs from 'fs';
import axios from 'axios';
import {GqlMutations} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

const fsPromises = fs.promises;
const paymentDirPath = '../data/payments/';

console.log("Working with environment variables " +
    "COOP GQL " + process.env.COOP_GQL_URL +
    "COOP API Key " + process.env.COOP_GQL_APIKEY +
    "PHH GQL " + process.env.PHH_GQL_URL +
    "PHH API Key " + process.env.PHH_GQL_APIKEY
)

fsPromises
    .readdir(paymentDirPath)
    .then(filenames => {
        filenames.forEach((filename, index) => {
            console.log("processing", filename);

            let servicerNode = null
            let gqlUrl = null
            let headers = null

            if(index < 50) {
                servicerNode = "COOPServicingNode"
                gqlUrl = process.env.COOP_GQL_URL
                headers = {"Authorization": process.env.COOP_GQL_APIKEY}
            } else {
                servicerNode = "PHHServicingNode"
                gqlUrl = process.env.PHH_GQL_URL
                headers = {"Authorization": process.env.PHH_GQL_APIKEY}
            }

            invokeVendiaShare(
                gqlUrl,
                createRequestPayload(paymentDirPath + filename, servicerNode),
                headers
            )
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

function createRequestPayload(filepath, servicerNode) {
    let json = fs.readFileSync(filepath);
    let loan = JSON.parse(json);

    console.log("Parsed loan is", loan);

    return {
        query: GqlMutations.addPaymentMutation,
        variables: {
            input: loan,
            servicerNode: servicerNode
        }
    }
}

function invokeVendiaShare(url, body, headers) {
    return axios.post(
        url,
        body,
        { headers: headers }
    )
}
