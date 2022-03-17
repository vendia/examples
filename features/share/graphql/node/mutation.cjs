const { GraphQLClient, gql } = require('graphql-request');
const commander = require('commander');
const program = new commander.Command();

const api = process.env.API
const api_key = process.env.API_KEY

const moment = require("moment");

async function main() {
  program
  .option('-i, --itemname <name>', 'Item name', 'Thing 1')
  .option('-q, --quantity <quantity>', 'Quantity', 1)
  .showHelpAfterError('(add --help for additional information)');

  program.parse();

  options = program.opts();

  // console.log(`Getting _id for ${options.itemname}`);
  itemId = await getId(options.itemname);
  result = await setQuantity(itemId, parseInt(options.quantity));

  if (result) {
    console.log(`${options.itemname} quantity: ${options.quantity}`)
  }
}

main().catch((error) => console.error(error))


async function getId(itemname) {
  const graphQLClient = new GraphQLClient(api, {
    headers: {
        'x-api-key': api_key
    }
  })

  const variables = {
    itemName: itemname
  }

  const query = gql`
    query listInventoryItems($itemName:String) {
      list_InventoryItems(filter: {itemName: {eq: $itemName}}) {
          _InventoryItems {
              _id
          }
        }
      }
  `

  const result = await graphQLClient.request(query, variables)

  try {
    return(result.list_InventoryItems._InventoryItems[0]._id)
  } catch (error) {
    console.error(`Could not find _id for ${itemname}.`)
    process.exit(1)
  }
}

async function setQuantity(itemId, quantity) {
  const now = moment().format("YYYY-MM-DDTHH:mm:ss") + "Z";
  const graphQLClient = new GraphQLClient(api, {
    headers: {
        'x-api-key': api_key
    }
  })

  const params = {
    id: itemId,
    quantity: quantity,
    lastUpdated: now
  }

  const mutation = gql`
    mutation updateInventory($id: ID!, $quantity: Int, $lastUpdated: String) {
      update_Inventory(id: $id, input: {quantity: $quantity, lastUpdated: $lastUpdated}, syncMode: ASYNC) {
        transaction {
          transactionId
        }
      }
    }
  `

const result = await graphQLClient.request(mutation, params)

try {
  return(result.update_Inventory.result._id)
} catch (error) {
  console.error(`Could not find update quantity of ${itemId} to ${quantity}.`)
  process.exit(1)
}

}

