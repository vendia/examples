import { GraphQLClient, gql } from 'graphql-request'

async function main() {
  const api = process.env.API
  const api_key = process.env.API_KEY


  const graphQLClient = new GraphQLClient(api, {
      headers: {
          'x-api-key': api_key
      }
  })

  const query = gql`
    query q {
        list_InventoryItems {
            _InventoryItems {
                _id
                itemName
                itemNumber
                quantity
                lastUpdated
            }
        }
    }
  `

  const data = await graphQLClient.request(query)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch((error) => console.error(error))

