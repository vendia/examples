export class GqlMutations {
  static addLoanMutation = `
      mutation AddLoan($input: Self_Loan_Input_!) {
        add_Loan(
          input: $input,
          syncMode: ASYNC,
          aclInput: {
              acl: [
                  { principal: {nodes: "OriginatorNode"}, operations: [ALL, UPDATE_ACL] }
                  { principal: {nodes: "ServicerNode"}, operations: [READ] }
              ]
          }
        ) {
          transaction {
            _id
            _owner
            submissionTime
            transactionId
            version
          }
        }
      }
  `


}