import dotenv from 'dotenv'
import axios from 'axios';
import {GqlMutations} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

console.log("Working with environment variables " +
    "COOP GQL " + process.env.COOP_GQL_URL +
    "COOP API Key " + process.env.COOP_GQL_APIKEY +
    "PHH GQL " + process.env.PHH_GQL_URL +
    "PHH API Key " + process.env.PHH_GQL_APIKEY
)

/*
invokeVendiaShare(
    process.env.COOP_GQL_URL,
    createRequestPayload(
        {
            portfolioIdentifier: "AAAA1111",
            portfolioName: "COOP Loan Portfolio"
        },
        ["COOPServicingNode"],
        "PHHServicingNode"
    ),
    {'Authorization': process.env.COOP_GQL_APIKEY}
    )
    .then(response => {
        console.log("Response status", response.status)
        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors for COOP", response.data.errors)
        }
    })
    .catch(error => {
        console.error("Failed to invoke Vendia Share", error)
    })
*/
invokeVendiaShare(
    process.env.PHH_GQL_URL,
    createRequestPayload(
        {
            portfolioIdentifier: "BBBB2222",
            portfolioName: "PHH Loan Portfolio"
        },
        ["PHHServicingNode"],
        "COOPServicingNode"
    ),
    {'Authorization': process.env.PHH_GQL_APIKEY},
    )
    .then(response => {
        console.log("Response status", response.status)
        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors for PHH", response.data.errors)
        }
    })
    .catch(error => {
        console.error("Failed to invoke Vendia Share", error)
    })


function createRequestPayload(portfolio, servicerNode, otherServicerNode) {
    return {
        query: GqlMutations.addPortfolioMutation,
        variables: {
            input: portfolio,
            servicerNode: servicerNode,
            otherServicerNode: otherServicerNode
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
