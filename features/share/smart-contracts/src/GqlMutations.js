export class GqlMutations {
  static addLoanMutation = `
      mutation AddLoan($input: Self_Loan_Input_!) {
        add_Loan(
          input: $input,
          aclInput: {
              acl: [
                  { principal: {nodes: "LenderNode"}, operations: [ALL, UPDATE_ACL] }
              ]
          },
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

  static addPortfolioMutation = `
      mutation AddPortfolio {
          add_LoanPortfolio(
              input: {
                portfolioIdentifier: "AAAA1111",
                portfolioName: "Loan Portfolio"
            },
              aclInput: {
                  acl: [
                      { principal: { nodes: "ServicerNode" }, operations: [ALL, UPDATE_ACL] },
                      { principal: {nodes: "LenderNode"}, operations: [READ] }
                  ]
              },
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

  static smartContractCreationMutation = `
    mutation CreateSmartContract($name: String!, $description: String, $inputQuery: String, $outputMutation: String!, $resource: String!) {
      addVendia_Contract(
        input: {
          name: $name, 
          description: $description,
          inputQuery: $inputQuery,
          outputMutation: $outputMutation,
          resource: {uri: $resource}
        },
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
    mutation InvokeSmartContract($id: ID!, $queryArgs: String!, $invokeArgs: String = "{}") {
      invokeVendia_Contract(
        id: $id, 
        input: {
          queryArgs: $queryArgs,
          invokeArgs: $invokeArgs
        },
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

  static validationInputQuery = `
    query ValidationInputQuery($loanIdentifier: String!) {
      list_LoanItems(filter: {loanIdentifier: {eq: $loanIdentifier}}) {
        _LoanItems {
          ... on Self_Loan {
            _id
            loanIdentifier
            borrowerCreditScore
            unpaidPrincipalBalance
            originationDate
          }
        }
      }
    }
  `

  static validationOutputMutation = `
    mutation ValidationOutputMutation($id: ID!,  $validationStatus: Self_Loan_validationStatusEnum!, $acl: [Vendia_Acl_Input_!]) {
      update_Loan(
        id: $id, 
        input: {
          validationStatus: $validationStatus
        },
        aclInput: {
            acl: $acl
        },
        syncMode: ASYNC
      ) {
        __typename
      }
    }
  `

  static computationInputQuery = `
    query ComputationInputQuery($portfolioIdentifier: String) {
      list_LoanItems(filter: {portfolioIdentifier: {eq: $portfolioIdentifier}}) {
          _LoanItems {
              ... on Self_Loan {
                  delinquencyStatus
                  interestRatePercent
                  unpaidPrincipalBalance
              }
          }
      }
      list_LoanPortfolioItems(filter: {portfolioIdentifier: {eq: $portfolioIdentifier}}) {
          _LoanPortfolioItems {
              ... on Self_LoanPortfolio {
                  _id
              }
          }
      }
    }
  `

  static computationOutputMutation = `
    mutation ValidationOutputMutation($id: ID!, $delinquencyPercentage: Float, $weightedAverageInterestRate: Float) {
        update_LoanPortfolio(
            id: $id
            input: {
                delinquencyPercentage: $delinquencyPercentage,
                weightedAverageInterestRate: $weightedAverageInterestRate
            },
            syncMode: ASYNC
        ) {
        __typename
      }
    }
  `

  static enrichmentInputQuery = `
    query ValidationInputQuery($loanIdentifier: String!) {
      list_LoanItems(filter: {loanIdentifier: {eq: $loanIdentifier}}) {
        _LoanItems {
          ... on Self_Loan {
            _id
            loanIdentifier
          }
        }
      }
    }
  `

  static enrichmentOutputMutation = `
    mutation ValidationOutputMutation($id: ID!, $additionalResources: [Self_Loan_additionalResources_additionalResourcesItem_UpdateInput_]) {
      update_Loan(
        id: $id, 
        input: {
          additionalResources: $additionalResources
        },
        syncMode: ASYNC
      ) {
        __typename
      }
    }
  `

}
