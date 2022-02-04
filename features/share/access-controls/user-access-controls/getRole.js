import { createSignedFetcher } from '@vendia/aws-signed-fetch'
import { ArgumentParser } from 'argparse';
import fsPromises from 'fs/promises';

const version = process.env.npm_package_version;

let parser = new ArgumentParser({
    description: 'Vendia Share Role'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-r', '--role', { help: 'role name to target, for "get" only', default: "default", required: false});
parser.add_argument('-p', '--policy', { help: 'policy file to use, for "get" or "set"', default: "./default.policy.json", required: false});

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

        getRole(args.role);
    });

function getRole(roleName) {
    console.log("Calling getRole for " + roleName);

    const getRoleQuery = {
        query: `
            query getUser($userId: String, $role: String) {
              getUser(userId: $userId, role: $role) {
                userId
                roles {
                  name
                  capabilities {
                    action
                    resources
                  }
                }
              }
            }
        `,
        variables: {
            userId: credentials.username,
            role: roleName
        }
    };

    makeRequest(getRoleQuery)
        .then(response => {
            if(response.data.errors) {
                throw response.data.errors;
            }
            console.log('Successfully called Share\n')
            console.log("UserId: " , response.data.data.getUser.userId)
            let roles = response.data.data.getUser.roles
            roles.forEach(role => {
                console.log("Has role: " + role.name);
                let capabilities = role.capabilities;
                capabilities.forEach(capability => {
                    let action = capability.action;
                    console.log("\n\tPermitting: " + action);
                    let resources = capability.resources;
                    resources.forEach(resource => {
                        console.log("\tOn: " + resource)
                    })
                })
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

