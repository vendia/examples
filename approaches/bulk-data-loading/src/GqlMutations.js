export class GqlMutations {

    static createInventoryListQuery() {
        let query = `
        query ListInventoryItems {
          list_InventoryItems(readMode: NODE_LEDGERED) {
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

    static createInventoryListNextPageQuery(nextToken) {
        let query = `
        query ListInventoryItems($nextToken: String) {
          list_InventoryItems(nextToken: $nextToken, readMode: NODE_LEDGERED) {
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

    static createInventoryMutation(batch) {
        let variables = {}
        let mutationParameters = []
        let mutationOperations = []

        batch.map((batchRecord, index) => {
            variables["input" + index] = batchRecord
            mutationParameters.push(GqlMutations.createMutationParameter(index))
            mutationOperations.push(GqlMutations.createMutationOperation(index))
        })

        return {
            query: GqlMutations.createMutationString(mutationParameters, mutationOperations),
            variables: variables
        }
    }

    static createMutationParameter(index) {
        return "$input" + index + ": Self_Inventory_Input_!";
    }

    static createMutationOperation(index) {
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

    static createMutationString(mutationParameters, mutationOperations) {
        return `
        mutation AddInventoryItems(
            ${mutationParameters.join(',')}
        ) {
          ${mutationOperations.join('\n')}
        }
    `;
    }

}
