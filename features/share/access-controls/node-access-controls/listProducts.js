import fetch from 'node-fetch';
import { ArgumentParser } from 'argparse';
import fsPromises from 'fs/promises';

const version = process.env.npm_package_version;

const parser = new ArgumentParser({
    description: 'Vendia Share Node Access Controls'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-a', '--authtype', { help: 'auth type to use - either "apikey" or "sharejwt"',  required: true});

const args = parser.parse_args();

const listProductsQuery = {
    query: `
        query listProducts {
          list_ProductItems {
            _ProductItems {
              sku
              name
              description
              price
              category
              supplier
            }
          }
        }
    `
}

let credentials = null

fsPromises
    .readFile("../share-auth/.share.env")
    .then(content => {
        credentials = JSON.parse(content);

        if(! validCredentials(credentials)) {
            console.error("Failed to get credentials from `.share.env`.  Please remember to run `npm run login` prior to calling this function.")
            return
        }

        listProducts(args.authtype);
    });

async function listProducts(authtype) {
    console.log("Calling listProducts with authtype " + authtype);

    let graphqlApiUrl = process.env.API_URL
    let headers = {};

    if(authtype === "apikey") {
        headers['x-api-key'] = process.env.API_KEY
    }
    if(authtype === "sharejwt") {
        headers['authorization'] = credentials.identityJwt
    }

    const response = await fetch(graphqlApiUrl, {
        method: 'post',
        body: JSON.stringify(listProductsQuery),
        headers: headers
    });

    const body = await response.json();

    if(!response.ok) {
        console.error('Failed to call Share', body)
        return;
    }

    console.log('\nSuccessfully called Share')

    let products = body.data.list_ProductItems._ProductItems
    products.forEach(product => {
        console.log("Product")
        console.log("\tID: " , product.sku)
        console.log("\tName: " , product.name)
        console.log("\tDescription: " , product.description)
        console.log("\tPrice: " , product.price)
        console.log("\tCategory: " , product.category)
        console.log("\tSupplier: " , product.supplier)
    })
}

function validCredentials(credentials) {
    return credentials && credentials.accessKeyId && credentials.secretAccessKey && credentials.sessionToken;
}

