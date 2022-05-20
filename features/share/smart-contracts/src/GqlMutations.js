export class GqlMutations {
  static addLoanMutation = `
      mutation AddLoan($input: Self_Loan_Input_!) {
        add_Loan(
          input: $input,
          syncMode: ASYNC,
          aclInput: {
              acl: [
                  { principal: {nodes: "LenderNode"}, operations: [ALL, UPDATE_ACL] }
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

  static addPortfolioMutation = `
      mutation AddPortfolio {
          add_LoanPortfolio(
              input: {
                portfolioIdentifier: "AAAA1111",
                portfolioName: "Loan Portfolio"
            }
              syncMode: ASYNC
              aclInput: {
                  acl: [
                      { principal: { nodes: "ServicerNode" }, operations: [ALL, UPDATE_ACL] },
                      { principal: {nodes: "LenderNode"}, operations: [READ] }
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

  static smartContractMutation = `
    mutation CreateSmartContract($name: String!, $description: String, $inputQuery: String, $outputMutation: String!, $resource: String!) {
      addVendia_Contract(
        input: {
          name: $name, 
          description: $description,
          inputQuery: $inputQuery,
          outputMutation: $outputMutation,
          resource: {uri: $resource}
        }
        syncMode: ASYNC
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

  static smartContractInvocationMutation = `
    mutation InvokeSmartContract($id: ID!, $queryArgs: String!) {
      invokeVendia_Contract_async(
        id: $id, 
        input: {
          queryArgs: $queryArgs
        }
      ) {
        result {
          _id
          _owner
          submissionTime
          transactionId
          version
        }
      }
    }
  `

  static validationInputQuery = `
    query ValidationInputQuery($loanIdentifier: String!) {
      list_LoanItems(filter: {loanIdentifier: {eq: $loanIdentifier}}) {
        _LoanItems {
          ... on Self_Loan {
            _id
            borrowerCreditScore
            originalUnpaidPrincipalBalance
            originationDate
          }
        }
      }
    }
  `

  static validationOutputMutation = `
    mutation ValidationOutputMutation($id: ID!,  $input: Self_Loan_UpdateInput_!, $servicerAction: Vendia_OperationType) {
      update_Loan_async(
        id: $id, 
        input: $input,
        aclInput: {
            acl: [
                { principal: {nodes: "LenderNode"}, operations: [ALL, UPDATE_ACL] }
                { principal: {nodes: "ServicerNode"}, operations: [$servicerAction] }
            ]
        }
      ) {
        error
      }
    }
  `

  static computationInputQuery = `
  `

  static computationOutputMutation = `
  `

}