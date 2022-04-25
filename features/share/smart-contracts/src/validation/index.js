exports.handler = async (event) => {

    console.log("Event is", event)

    let loan = event.queryResult.list_LoanItems._LoanItems[0]

    let isValid = isValidOrigination(loan.originationDate) &&
        isValidLoanAmount(loan.originalUnpaidPrincipalBalance, loan.borrowerCreditScore)

    console.log("Validation function determined the loan" + (isValid ? " IS " : " IS NOT ") + "valid");

    return {
        id: loan._id,
        validationStatus: (isValid ? "VALID" : "INVALID")
    }
}

/**
 * True if originationDate is prior to now, false other wise
 * @param originationDate of a loan
 * @returns {boolean} true if origination date isn't in the future, false if it is
 */
function isValidOrigination(originationDate) {
    return Date.parse(originationDate) < Date.now();
}

/**
 * True if balance is less than or equal to borrower's credit score multiplied by 1000
 * @param balance on the loan
 * @param creditScore of the borrower
 * @returns {boolean} true if credit score is sufficiently large for the balance provided, false otherwise
 */
function isValidLoanAmount(balance, creditScore) {
    //A very simplistic check, which can easily be replaced by a more complex algorithm
    return balance <= creditScore * 1000
}
