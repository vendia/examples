export function createInventoryListQuery() {
    let query = `
        query ListInventoryItems {
          list_InventoryItems {
            _InventoryItems {
              _id
            }
            nextToken
          }
        }
    `;

    return {
        query: query,
        variables: {}
    }
}

export function createInventoryListNextPageQuery(nextToken) {
    let query = `
        query ListInventoryItems($nextToken: String) {
          list_InventoryItems(nextToken: $nextToken) {
            _InventoryItems {
              _id
            }
            nextToken
          }
        }
    `;

    return {
        query: query,
        variables: {
            nextToken: nextToken
        }
    }
}

export function createInventoryMutation(batch) {
    let variables = {}
    let mutationParameters = []
    let mutationOperations = []

    batch.map((batchRecord, index) => {
        variables["input" + index] = batchRecord
        mutationParameters.push(createMutationParameter(index))
        mutationOperations.push(createMutationOperation(index))
    })

    return {
        query: createMutationString(mutationParameters, mutationOperations),
        variables: variables
    }
}

function createMutationParameter(index) {
    return "$input" + index + ": Self_Inventory_Input_!";
}

function createMutationOperation(index) {
    return `
        entry${index}: add_Inventory(
            input: $input${index}, 
            syncMode: ASYNC
        ) {
            transaction {
              transactionId
            }
        }
    `
}

function createMutationString(mutationParameters, mutationOperations) {
    return `
        mutation AddInventoryItems(
            ${mutationParameters.join(',')}
        ) {
          ${mutationOperations.join('\n')}
        }
    `;
}
