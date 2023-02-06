import dotenv from 'dotenv'
import axios from 'axios';
import {GqlMutations} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

console.log("Working with environment variables GQL " + process.env.CSS_GQL_URL + " and api key " + process.env.CSS_GQL_APIKEY)

const headers = { 'Authorization': process.env.CSS_GQL_APIKEY }

const security = {
    issueAmount: 800000,
    issueDate: "2022-05-01",
    issuerIdentifier: "564564",
    maturityDate: "2051-06-15",
    parMinimumAmount: 1000,
    poolIdentifier: "QB9350",
    securityIdentifier: "3333ABC33",
    trustIdentifier: "1"
}

invokeVendiaShare(createSecurityRequestPayload(security))
    .then(response => {
        console.log("Response status", response.status)
        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors for " + loan.loanIdentifier, response.data.errors)
        }
    })
    .catch(error => {
        console.error("Failed to invoke Vendia Share", error)
    })

invokeVendiaShare(createListLoansRequestPayload())
    .then(response => {
        console.log("Response status", response.status)

        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors for " + loan.loanIdentifier, response.data.errors)
        }

        let loans = response.data.data.list_LoanItems._LoanItems

        loans.forEach((loan) => {
            invokeVendiaShare(createLoanUpdateRequestPayload(loan._id))
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

function createSecurityRequestPayload(input) {
    return {
        query: GqlMutations.addSecurityMutation,
        variables: {
            input: input
        }
    }
}


function createLoanUpdateRequestPayload(loanId) {
    return {
        query: GqlMutations.assignLoanToSecurity,
        variables: {
            id: loanId
        }
    }
}

function invokeVendiaShare(body) {
    return axios.post(
        process.env.CSS_GQL_URL,
        body,
        { headers: headers }
    )
}

