/**
 * Performs a set of computations against a set of loans provided as part of the event input.
 *
 * @param event that contains loans to use for computation, among other fields
 * @returns Promise of an object that contains the computation results, as expected by the associated smart contract's outputMutation
 */
exports.handler = async (event) => {

    console.log("Event is", event)

    let data = event.queryResult

    let loans = data.list_LoanItems._LoanItems
    let portfolio = data.list_LoanPortfolioItems._LoanPortfolioItems[0]

    console.log("Loans are", loans);
    console.log("Portfolio is", portfolio);

    let delinquencyPercentage = calculateDelinquencyPercentage(loans)
    let weightedAverageInterestRate = calculateWeightedAverageInterestRate(loans)

    return {
        id: portfolio._id,
        delinquencyPercentage: delinquencyPercentage,
        weightedAverageInterestRate: weightedAverageInterestRate
    }
}

/**
 * Calculate the percentage of loans in the "DELINQUENT" status
 * @param loans to evaluate
 * @returns delinquencyPercentage of delinquent loans within the set provided
 */
function calculateDelinquencyPercentage(loans) {
    let total = loans.length
    let numDelinquent = 0

    loans.forEach(loan => {
        if(loan.delinquencyStatus === "DELINQUENT") {
            numDelinquent = numDelinquent + 1
        }
    })

    console.log("total is", total)
    console.log("numDelinquent is", numDelinquent)

    let delinquencyPercentage = (numDelinquent / total) * 100

    console.log("Percent delinquent", delinquencyPercentage);

    return delinquencyPercentage
}

/**
 * Calculate the weighted average interest rate for loans provided
 * @param loans to evaluate
 * @returns weightedAveragePercent of the loans provided
 */
function calculateWeightedAverageInterestRate(loans) {
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

    console.log("weightedAveragePercent " + weightedAveragePercent);

    return weightedAveragePercent
}