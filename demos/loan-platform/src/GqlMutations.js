export class GqlMutations {
    static upbInputQuery = `
        query UPBQuery($loanIdentifier: String) {
            list_LoanItems(filter: {loanIdentifier: {eq: $loanIdentifier}}) {
                _LoanItems {
                    ... on Self_Loan {
                        _id
                        unpaidPrincipalBalance
                    }
                }
            }
            list_PaymentItems(
                filter: {loanIdentifier: {eq: $loanIdentifier}}
            ) {
                _PaymentItems {
                    ... on Self_Payment {
                        principalDistributionAmount
                    }
                }
            }
        }    
    `
    static upbOutputMutation = `
        mutation UPBMutation($id: ID!, $unpaidPrincipalBalance: Float) {
            loan1: update_Loan(
                id: $id
                input: {
                    unpaidPrincipalBalance: $unpaidPrincipalBalance
                }
                syncMode: ASYNC
            ) {
                __typename
            }
        }    
    `

    static delingquentInputQuery = `
        query ListDelinquencyStatus($portfolioIdentifier: String) {
            list_LoanItems(filter: {portfolioIdentifier: {eq: $portfolioIdentifier}}) {
                _LoanItems {
                    ... on Self_Loan {
                        delinquencyStatus
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

    static delingquentOutputMutation = `
        mutation DelinquencyMutation($id: ID!, $delinquentPercent: Float, $latePercent: Float) {
            update_LoanPortfolio(
                id: $id
                input: {
                    delinquentPercent: $delinquentPercent,
                    latePercent: $latePercent
                }
                syncMode: ASYNC
            ) {
                __typename
            }
        }
    `

    static wairInputQuery = `
        query ListLoans($securityIdentifier: String) {
            list_LoanItems(filter: {securityIdentifier: {eq: $securityIdentifier}}) {
                _LoanItems {
                    ... on Self_Loan {
                        loanIdentifier
                        securityIdentifier
                        interestRatePercent
                        unpaidPrincipalBalance
                    }
                }
            }
        }    
    `

    static wairOutputMutation = `
        mutation AddDisclosure($input: Self_Disclosure_Input_!) {
            add_Disclosure(
                input: $input
                aclInput: {
                    acl: [
                        { principal: { nodes: "CSSNode" }, operations: [ALL, UPDATE_ACL] }
                        { principal: { nodes: "FNMANode" }, operations: [READ] }
                    ]
                }
                syncMode: ASYNC
            ) {
                __typename
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

    static addLoanMutation = `
        mutation AddLoan($input: Self_Loan_Input_!) {
            add_Loan(
                input: $input,
                syncMode: ASYNC,
                aclInput: {
                    acl: [
                        { principal: {nodes: ["JPMCLenderNode", "FNMANode"]}, operations: [ALL, UPDATE_ACL] }
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
        mutation AddPortfolio($input: Self_LoanPortfolio_Input_!, $servicerNode: [String!], $otherServicerNode: String!) {
            add_LoanPortfolio(
                input: $input
                syncMode: ASYNC
                aclInput: {
                    acl: [
                        { principal: { nodes: $servicerNode }, operations: [ALL, UPDATE_ACL] },
                        { principal: { nodes: [$otherServicerNode, "JPMCLenderNode", "FNMANode"] }, operations: [READ, WRITE] }
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

    static listLoansQuery = `
        query ListLoans {
          list_LoanItems {
            _LoanItems {
              ... on Self_Loan {
                _id
                loanIdentifier
              }
            }
          }
        }
    `

    static assignForServicingMutation = `
        mutation AssignForServicing($id: ID!, $input: Self_Loan_UpdateInput_!, $servicerNode: [String!]) {
            update_Loan(
                id: $id,
                input: $input,
                syncMode: ASYNC,
                aclInput: {
                    acl: [
                        { principal: { nodes: ["JPMCLenderNode", "FNMANode"] }, operations: [ALL, UPDATE_ACL] }
                        { principal: { nodes: $servicerNode }, operations: [ALL, UPDATE_ACL] }
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
    static addPaymentMutation = `
        mutation AddPayments($input: Self_Payment_Input_!, $servicerNode: [String!]) {
            payment1: add_Payment(
                input: $input
                syncMode: ASYNC
                aclInput: {
                    acl: [
                        { principal: { nodes: $servicerNode }, operations: [ALL, UPDATE_ACL] }
                        { principal: { nodes: ["JPMCLenderNode", "FNMANode"] }, operations: [READ, UPDATE_ACL] }
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

    static updateLoanStatusMutation = `
        mutation AssignForServicing($id: ID!, $input: Self_Loan_UpdateInput_!) {
            update_Loan(
                id: $id,
                input: $input,
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

    static listLoansAndPaymentsQuery = `
        query ListLoansAndPayments($lowerBound: String, $upperBound: String) {
          list_LoanItems(
            filter: {_and: [{loanIdentifier: {ge: $lowerBound}}, {loanIdentifier: {le: $upperBound}}]}
          ) {
            _LoanItems {
              ... on Self_Loan {
                _id
                loanIdentifier
              }
            }
          }
          list_PaymentItems(
            filter: {_and: [{loanIdentifier: {ge: $lowerBound}}, {loanIdentifier: {le: $upperBound}}]}
          ) {
            _PaymentItems {
              ... on Self_Payment {
                _id
                loanIdentifier
              }
            }
          }
        }
    `

    static assignLoanForSecuritizationMutation = `
        mutation ShareWithCSS($id: ID!) {
            update_Loan(
                id: $id
                input: {
                }
                syncMode: ASYNC
                aclInput: {
                    acl: [
                        { principal: { nodes: ["JPMCLenderNode", "FNMANode"] }, operations: [ALL, UPDATE_ACL] }
                        { principal: { nodes: "COOPServicingNode" }, operations: [READ] }
                        { principal: { nodes: "CSSNode" }, operations: [READ] },
                        { principal: { nodes: "CSSNode" }, path: "loanCollaborators.securitizerIdentifier", operations: [READ, WRITE] }
                        { principal: { nodes: "CSSNode" }, path: "securityIdentifier", operations: [READ, WRITE] }
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

    static assignPaymentForSecuritizationMutation = `
        mutation ShareWithCSS($id: ID!) {
            update_Payment(
                id: $id
                input: {
                }
                syncMode: ASYNC
                aclInput: {
                    acl: [
                        { principal: { nodes: "COOPServicingNode" }, operations: [ALL, UPDATE_ACL] }
                        { principal: { nodes: ["JPMCLenderNode", "FNMANode"] }, operations: [READ, UPDATE_ACL] }
                        { principal: { nodes: "CSSNode" }, operations: [READ] }
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

    static addSecurityMutation = `
        mutation AddSingleClassSecurity($input: Self_SingleClassSecurity_Input_!) {
          add_SingleClassSecurity(
            input: $input, 
            syncMode: ASYNC,
            aclInput: {
                acl: [
                    { principal: {nodes: "CSSNode"}, operations: [ALL, UPDATE_ACL] }
                    { principal: {nodes: "FNMANode"}, operations: [READ] }
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

    static assignLoanToSecurity = `
        mutation AddLoanToSecurity($id: ID!) {
            update_Loan(
                id: $id
                input: {
                    loanCollaborators: {
                        securitizerIdentifier: "CSSNode"
                    }
                    securityIdentifier: "3333ABC33"
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
}