exports.handler = async (event) => {

    console.log("Event is", event)

    let data = event.queryResult
    let invokeArgs = event.invokeArgs

    let loans = data.list_LoanItems._LoanItems

    let sumOfProducts = loans
        .map((loan, index) => loan.interestRatePercent * loan.unpaidPrincipalBalance / 100)
        .reduce((a, b) => a + b)

    let totalBalanceAmount =
        loans.map(loan => loan.unpaidPrincipalBalance).reduce((a, b) => a + b)

    console.log("sumOfProducts " + sumOfProducts);
    console.log("totalBalanceAmount " + totalBalanceAmount);

    let weightedAverage = sumOfProducts / totalBalanceAmount

    console.log("weightedAverage " + weightedAverage);

    let weightedAveragePercent = weightedAverage * 100

    return {
        input: {
            securityIdentifier: loans[0].securityIdentifier,
            reportingPeriod: invokeArgs.reportingPeriod,
            securityType: "L1",
            disclosureType: "WeightedAverageInterestRatePercent",
            disclosureValue: weightedAveragePercent
        }
    }
}
