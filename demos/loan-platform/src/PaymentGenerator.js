/*
This script is used to generate a new set of loans.  Loan files are placed in ../data/loans.
 */

import parse from "json-templates"
import * as fs from 'fs/promises';

const paymentsOutputDir = '../data/payments/'

let numPaymentsToGenerate = 100

let paymentTemplate = {
    loanIdentifier: "{{loanIdentifier}}",
    principalAndInterestPaymentAmount: "{{principalAndInterestPaymentAmount}}",
    principalDistributionAmount: "{{principalDistributionAmount}}",
    effectiveDate: "{{effectiveDate}}",
    reportingPeriod: "{{reportingPeriod}}"
}

paymentTemplate = parse(paymentTemplate)

Array.from(Array(numPaymentsToGenerate).keys()).forEach(paymentIndex => {
    console.log("Generating payment #" + paymentIndex)

    let loanIdentifier = String(paymentIndex).padStart(16, '0')
    let principalAndInterestPaymentAmount = generateRandomInteger(500, 2500)
    let principalDistributionAmount = principalAndInterestPaymentAmount * 0.33
    let effectiveDate = "2021-04-" + String(generateRandomInteger(1,15)).padStart(2, '0')
    let reportingPeriod = "2021-04"

    let generatedPayment = paymentTemplate({
        loanIdentifier: loanIdentifier,
        principalAndInterestPaymentAmount: principalAndInterestPaymentAmount,
        principalDistributionAmount: principalDistributionAmount,
        effectiveDate: effectiveDate,
        reportingPeriod: reportingPeriod
    })

    console.log("Generated payment", generatedPayment)

    let filepath = paymentsOutputDir + 'payment' + String(paymentIndex).padStart(3, '0') + '.json'

    fs.writeFile(filepath, JSON.stringify(generatedPayment))
        .then(result => {
            console.log("Done writing " + filepath)
        })
        .catch(error => {
            console.error("Failed to write " + filepath, error)
        })
})

function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
