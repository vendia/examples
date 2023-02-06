import dotenv from 'dotenv'
import axios from 'axios';
import {GqlMutations} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

console.log("Working with environment variables GQL " + process.env.FNMA_GQL_URL + " and api key " + process.env.FNMA_GQL_APIKEY)

const headers = { 'Authorization': process.env.FNMA_GQL_APIKEY }

const numCoop = 50

const coopServicerName =  "COOPServicingNode"

const phhServicerName= "PHHServicingNode"

const coopInput = {
    loanCollaborators: {
        servicerIdentifier: coopServicerName
    },
    portfolioIdentifier: "AAAA1111"
}

const phhInput = {
    loanCollaborators: {
        servicerIdentifier: phhServicerName
    },
    portfolioIdentifier: "BBBB2222"
}

invokeVendiaShare(createListLoansRequestPayload())
    .then(response => {
        console.log("Response status", response.status)

        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors for " + loan.loanIdentifier, response.data.errors)
        }

        let loans = response.data.data.list_LoanItems._LoanItems

        loans.sort((a, b) => a.loanIdentifier.localeCompare(b.loanIdentifier))

        loans.forEach((loan, index) => {
            let input = null
            let servicerName = null

            if(index < numCoop) {
                servicerName = coopServicerName
                input = coopInput
            } else {
                servicerName = phhServicerName
                input = phhInput
            }

            invokeVendiaShare(createLoanUpdateRequestPayload(loan._id, input, servicerName))
                .then(response => {
                    console.log("Response status", response.status)
                    if(response?.data?.errors) {
                        throw new Error("GraphQL response included errors for " + loan.loanIdentifier, response.data.errors)
                    }
                })
                .catch(error => {
                    console.error("Failed to invoke Vendia Share", error)
                })
        })
    })
    .catch(error => {
        console.error("Failed to invoke Vendia Share", error)
    })

function createListLoansRequestPayload() {
    return {
        query: GqlMutations.listLoansQuery
    }
}

function createLoanUpdateRequestPayload(loanId, input, servicerName) {
    return {
        query: GqlMutations.assignForServicingMutation,
        variables: {
            id: loanId,
            input: input,
            servicerNode: servicerName
        }
    }
}

function invokeVendiaShare(body) {
    return axios.post(
        process.env.FNMA_GQL_URL,
        body,
        { headers: headers }
    )
}

