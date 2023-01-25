/*
This script is used to generate a new set of loans.  Loan files are placed in ../data/loans.
 */

import parse from "json-templates"
import * as fs from 'fs/promises';

const loansOutputDir = '../data/loans/'

let numLoansToGenerate = 100

let loanTemplate = {
    loanIdentifier: "{{loanIdentifier}}",
    loanCollaborators: {
        ownerIdentifier: "{{owner}}",
        lenderIdentifier: "{{lender}}",
    },
    borrowerCreditScore: "{{creditScore}}",
    interestRatePercent: "{{interestRate}}",
    loanToValuePercent: "{{loanToValue}}",
    numberOfUnits: "{{units}}",
    originationDate: "{{originationDate}}",
    unpaidPrincipalBalance: "{{unpaidPrincipalBalance}}"
}

loanTemplate = parse(loanTemplate)

Array.from(Array(numLoansToGenerate).keys()).forEach(loanIndex => {
    console.log("Generating loan #" + loanIndex)

    let loanNumber = String(loanIndex).padStart(16, '0')
    let creditScore = generateRandomInteger(500, 800)
    let interestRate = generateRandomInteger(20, 70) / 10
    let loanToValue = generateRandomInteger(40, 90)
    let units = generateRandomInteger(1, 4)
    let originationDate = "2021-04-" + String(generateRandomInteger(1,30)).padStart(2, '0')
    let unpaidPrincipalBalance = generateRandomInteger(100000, 500000)

    let generatedLoan = loanTemplate({
        loanIdentifier: loanNumber,
        owner: "FNMANode",
        lender: "JPMCNode",
        creditScore: creditScore,
        interestRate: interestRate,
        loanToValue: loanToValue,
        units: units,
        originationDate: originationDate,
        unpaidPrincipalBalance: unpaidPrincipalBalance
    })

    console.log("Generated loan", generatedLoan)

    let filepath = loansOutputDir + 'loan' + String(loanIndex).padStart(3, '0') + '.json'

    fs.writeFile(filepath, JSON.stringify(generatedLoan))
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
