import { createSignedFetcher } from '@vendia/aws-signed-fetch'
import { ArgumentParser } from 'argparse';
import fsPromises from 'fs/promises';

const version = process.env.npm_package_version;

let parser = new ArgumentParser({
    description: 'Vendia Share Role'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-u', '--uniname', { help: 'name of the Uni whose details should be retrieved',  required: true});

let args = parser.parse_args();
let credentials = null

fsPromises
    .readFile("../share-auth/.share.env")
    .then(content => {
        credentials = JSON.parse(content);

        if(! validCredentials(credentials)) {
            console.error("Failed to get credentials from `.share.env`.  Please remember to run `npm run login` prior to calling this function.")
            return
        }

        getUni(args.uniname);
    });

function getUni(uniName) {
    console.log("Calling getUni for " + uniName);

    const getUniQuery = {
        query: `
            query getUni($uniName: String!) {
              getUni(uni: $uniName) {
                name
                sku
                status
                created
                nodes {
                    name
                    userId
                    description
                    status
                    region
                    vendiaAccount {
                        csp
                        accountId
                        org
                    }
                    resources {
                        graphqlApi {
                            apiKey
                            httpsUrl
                            websocketUrl
                        }
                    }
                }
              }
            }
        `,
        variables: {
            uniName: uniName
        }
    };

    makeRequest(getUniQuery)
        .then(response => {
            if(response.data.errors) {
                throw response.data.errors;
            }
            console.log('Successfully called Share\n')
            console.log("Uni: " , response.data.data.getUni.name)
            console.log("SKU: " , response.data.data.getUni.sku)
            console.log("Status: " , response.data.data.getUni.status)
            console.log("Created: " , response.data.data.getUni.created)
            let nodes = response.data.data.getUni.nodes
            nodes.forEach(node => {
                console.log("\nNode: " + node.name);
                console.log("\tOwner: " + node.userId);
                console.log("\tDescription: " + node.description);
                console.log("\tStatus: " + node.status);
                console.log("\tRegion: " + node.region);
                console.log();
                console.log("\tCSP: " + node.vendiaAccount.csp);
                console.log("\tCSP Account Id: " + node.vendiaAccount.accountId);
                console.log("\tCSP Org: " + node.vendiaAccount.org);
                console.log();
                if(node.resources) {
                    console.log("\tGraphQL API: " + node.resources.graphqlApi.httpsUrl);
                    console.log("\tWSS API: " + node.resources.graphqlApi.websocketUrl);
                    console.log("\tGraphQL API Key: " + node.resources.graphqlApi.apiKey);
                }
            });
        })
        .catch(error => {
            console.error('Failed to call Share', error)
        });
}

function makeRequest(body) {

    async function getCredentials() {
        return credentials
    }

    const signedFetcher = createSignedFetcher({
        method: 'POST',
        region: 'us-east-1',
        baseUrl: 'https://share.services.vendia.net/share',
        getCredentials: getCredentials,
        debug: false
    })

    return signedFetcher('/', {
        method: 'POST',
        body: JSON.stringify(body)
    })
}

function validCredentials(credentials) {
    return credentials && credentials.accessKeyId && credentials.secretAccessKey && credentials.sessionToken;
}

