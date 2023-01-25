exports.handler = async (event) => {

    console.log("Event is", event)

    let data = event.queryResult

    let loan = data.list_LoanItems._LoanItems[0]
    let payment = data.list_PaymentItems._PaymentItems[0]

    console.log("Loan is", loan);
    console.log("Payment is", payment);

    let updatedBalance = loan.unpaidPrincipalBalance - payment.principalDistributionAmount

    console.log("Updated balance", updatedBalance);

    return {
        id: loan._id,
        unpaidPrincipalBalance: updatedBalance
    }
}
