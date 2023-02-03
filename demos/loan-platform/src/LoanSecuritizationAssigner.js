import dotenv from 'dotenv'
import axios from 'axios';
import {GqlMutations} from "./GqlMutations.js";

dotenv.config({path: "./.share.env"})

console.log("Working with environment variables GQL " + process.env.FNMA_GQL_URL + " and api key " + process.env.FNMA_GQL_APIKEY)

const headers = { 'Authorization': process.env.FNMA_GQL_APIKEY }

invokeVendiaShare(createListLoansAndPaymentsRequestPayload())
    .then(response => {
        console.log("Response status", response.status)

        if(response?.data?.errors) {
            throw new Error("GraphQL response included errors for " + loan.loanIdentifier, response.data.errors)
        }

        let loans = response.data.data.list_LoanItems._LoanItems
        let payments = response.data.data.list_PaymentItems._PaymentItems

        loans.sort((a, b) => a.loanIdentifier.localeCompare(b.loanIdentifier))
        payments.sort((a, b) => a.loanIdentifier.localeCompare(b.loanIdentifier))

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

        payments.forEach((payment) => {
            invokeVendiaShare(createPaymentUpdateRequestPayload(payment._id))
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

function createListLoansAndPaymentsRequestPayload() {
    return {
        query: GqlMutations.listLoansAndPaymentsQuery,
        variables: {
            lowerBound: "0000000000000001",
            upperBound: "0000000000000010"
        }
    }
}

function createLoanUpdateRequestPayload(loanId) {
    return {
        query: GqlMutations.assignLoanForSecuritizationMutation,
        variables: {
            id: loanId
        }
    }
}

function createPaymentUpdateRequestPayload(paymentId) {
    return {
        query: GqlMutations.assignPaymentForSecuritizationMutation,
        variables: {
            id: paymentId
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

