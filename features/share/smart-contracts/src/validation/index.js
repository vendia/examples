/**
 * Performs a set of validations against a loan provided as part of the event input.
 *
 * @param event that contains a loan to be validated, among other fields
 * @returns Promise of an object that contains the validation results and ACL modifications, as expected by the associated smart contract's outputMutation
 */
exports.handler = async (event) => {

    let loan = {}
    let validationStatus
    let acls

    try {
        console.log("Event is", event)

        loan = event.queryResult.list_LoanItems._LoanItems[0]

        console.log("Loan is", loan)

        //throw an unexpected error to demonstrate the purpose of the "catch" block below
        if(loan.loanIdentifier === "0000000000000005") {
            throw new Error("Something unexpected happened - oh no!")
        }

        let isValid = isValidOrigination(loan.originationDate) &&
            isValidLoanAmount(loan.unpaidPrincipalBalance, loan.borrowerCreditScore)

        console.log("Validation function determined the loan" + (isValid ? " IS " : " IS NOT ") + "valid");

        if(isValid) {
            validationStatus = "VALID"
            acls = [
                { principal: {nodes: "LenderNode"}, operations: ["ALL", "UPDATE_ACL"] },
                { principal: {nodes: "ServicerNode"}, operations: ["READ"] }
            ]
        } else {
            validationStatus = "INVALID"
            acls = [
                {principal: {nodes: "LenderNode"}, operations: ["ALL", "UPDATE_ACL"]}
            ]
        }
    } catch (error) {
        console.error("Unexpected exception during validation", error)

        validationStatus = "ERROR"
        acls = [
            { principal: {nodes: "LenderNode"}, operations: ["ALL", "UPDATE_ACL"] }
        ]

    } finally {
        console.log("Returning " + validationStatus + " and " + acls + " for loan " + loan._id)

        return {
            id: loan._id,
            validationStatus: validationStatus,
            acl: acls
        }
    }
}

/**
 * True if originationDate is prior to now, false otherwise
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
