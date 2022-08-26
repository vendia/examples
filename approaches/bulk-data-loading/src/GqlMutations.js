export class GqlMutations {

    static createInventoryMutation(batch) {
        let variables = {}
        let mutationParameters = []
        let mutationOperations = []

        batch.map((batchRecord, index) => {
            variables["input" + index] = batchRecord
            mutationParameters.push(GqlMutations.createMutationParameter(index))
            mutationOperations.push(GqlMutations.createMutationOperation(index))
        })

        let query = GqlMutations.createMutationString(mutationParameters, mutationOperations);

        return { query, variables }
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
