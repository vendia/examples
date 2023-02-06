import dotenv from 'dotenv'
import axios from 'axios';
import {GqlMutations} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

console.log("Working with environment variables GQL " + process.env.FNMA_GQL_URL + " and api key " + process.env.FNMA_GQL_APIKEY)

const headers = { 'Authorization': process.env.FNMA_GQL_APIKEY }

invokeVendiaShare(createListLoansRequestPayload())
    .then(response => {
        console.log("Response status", response.status)

        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors for " + loan.loanIdentifier, response.data.errors)
        }

        let loans = response.data.data.list_LoanItems._LoanItems

        loans.sort((a, b) => a.loanIdentifier.localeCompare(b.loanIdentifier))

        loans.forEach((loan, index) => {
            let input = {
                delinquencyStatus: "CURRENT"
            }

            if(index == 0) {
                input.delinquencyStatus = "DELINQUENT"
            }

            if(index == 50 || index == 51) {
                input.delinquencyStatus = "LATE"
            }

            invokeVendiaShare(createLoanUpdateRequestPayload(loan._id, input))
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

function createLoanUpdateRequestPayload(loanId, input) {
    return {
        query: GqlMutations.updateLoanStatusMutation,
        variables: {
            id: loanId,
            input: input
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

