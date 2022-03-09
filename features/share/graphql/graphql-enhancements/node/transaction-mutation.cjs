const { GraphQLClient, gql } = require('graphql-request');
const commander = require('commander');
const program = new commander.Command();

const api = process.env.API
const api_key = process.env.API_KEY

const moment = require("moment");

async function main() {
  program
  .option('-s, --ship <quantity>', 'Shipment quantity', 1)
  .showHelpAfterError('(add --help for additional information)');

  program.parse();

  options = program.opts();

  thing1 = await getInfo("Thing 1");
  thing2 = await getInfo("Thing 2");
  thing3 = await getInfo("Thing 3");

  result = await setQuantity(thing1, thing2, thing3, parseInt(options.ship));

  console.log(`Submitted shipment request for processing. Ship ${options.ship} units of Thing1, Thing2, and Thing3.`)
  console.log(`Thing 1:${result.thing1} Thing 2:${result.thing2} Thing 3:${result.thing3}`)
}

main().catch((error) => console.error(error))


async function getInfo(itemname) {
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
              quantity
          }
        }
      }
  `

  const result = await graphQLClient.request(query, variables)

  try {
    return {
      '_id': result.list_InventoryItems._InventoryItems[0]._id,
      'quantity': result.list_InventoryItems._InventoryItems[0].quantity
    };
  } catch (error) {
    console.error(`Could not find _id for ${itemname}.`)
    process.exit(1)
  }
}

async function setQuantity(thing1, thing2, thing3, ship) {
  const now = moment().format("YYYY-MM-DDTHH:mm:ss") + "Z";

  newQuantity1 = parseInt(thing1.quantity) - ship;
  newQuantity2 = parseInt(thing2.quantity) - ship;
  newQuantity3 = parseInt(thing3.quantity) - ship;

  const graphQLClient = new GraphQLClient(api, {
    headers: {
        'x-api-key': api_key
    }
  })

  const params = {
    id1: thing1._id,
    newQuantity1: newQuantity1,
    id2: thing2._id,
    newQuantity2: newQuantity2,
    id3: thing3._id,
    newQuantity3: newQuantity3,
    shipQuantity: ship,
    lastUpdated: now
  }

  const mutation = gql`
    mutation updateInventory(
      $id1: ID!,
      $newQuantity1: Int,
      $id2: ID!,
      $newQuantity2: Int,
      $id3: ID!,
      $newQuantity3: Int,
      $lastUpdated: String,
      $shipQuantity: Int
    ) @vendia_transaction {
      item1: update_Inventory_async(
        id: $id1,
        input: {
          quantity: $newQuantity1,
          lastUpdated: $lastUpdated
        }
        condition: {
          quantity: {ge: $shipQuantity}
        }
      ) {
          error
          result {
            _id
          }
      }
      
      item2: update_Inventory_async(
        id: $id2,
        input: {
          quantity: $newQuantity2,
          lastUpdated: $lastUpdated
        }
        condition: {
          quantity: {ge: $shipQuantity}
        }
      ) {
          error
          result {
            _id
          }
      }

      item3: update_Inventory_async(
        id: $id3,
        input: {
          quantity: $newQuantity3,
          lastUpdated: $lastUpdated
        }
        condition: {
          quantity: {ge: $shipQuantity}
        }
      ) {
          error
          result {
            _id
          }
      }
    }
  `

  const result = await graphQLClient.request(mutation, params)


  try {
    return {
      'thing1': result.item1.result._id,
      'thing2': result.item2.result._id,
      'thing3': result.item3.result._id
    }
  } catch (error) {
    console.error(`Error: ${error}`)
    process.exit(1)
  }

}

