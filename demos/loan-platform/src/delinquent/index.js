exports.handler = async (event) => {

    console.log("Event is", event)

    let data = event.queryResult

    let loans = data.list_LoanItems._LoanItems
    let portfolio = data.list_LoanPortfolioItems._LoanPortfolioItems[0]

    console.log("Loans are", loans);
    console.log("Portfolio is", portfolio);

    let numDelinquent = 0
    let numLate = 0
    let total = loans.length

    loans.forEach(loan => {
        if(loan.delinquencyStatus === "LATE") {
            numLate = numLate + 1
        }
        if(loan.delinquencyStatus === "DELINQUENT") {
            numDelinquent = numDelinquent + 1
        }
    })

    console.log("total is", total)
    console.log("numLate is", numLate)
    console.log("numDelinquent is", numDelinquent)

    let latePercent = ((numLate + numDelinquent) / total) * 100
    let delinquentPercent = (numDelinquent / total) * 100

    console.log("Percent late", latePercent);
    console.log("Percent delinquent", delinquentPercent);

    return {
        id: portfolio._id,
        latePercent: latePercent,
        delinquentPercent: delinquentPercent
    }
}