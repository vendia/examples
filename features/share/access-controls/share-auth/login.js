#!/usr/bin/env node
import { Login as cognitoLogin } from './cognitoLogin.js';
import { ArgumentParser } from 'argparse';
import fsPromises from 'fs/promises';

const version = process.env.npm_package_version;

let parser = new ArgumentParser({
    description: 'Vendia Share Login'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-u', '--username', { help: 'username', required: true });
parser.add_argument('-p', '--password', { help: 'password', required: true });

let args = parser.parse_args();

let vendiaShareCognitoConfig = {
    region: "us-east-1",
    identitypool: "us-east-1:1df563d6-c5ef-4bad-aa88-17e4df3ff324",
    userpool: "us-east-1_N7amGsOgA",
    clientId: "7rcfp2gvcrb86fkig5k2mml23t"
}

cognitoLogin(args.username, args.password, vendiaShareCognitoConfig.userpool, vendiaShareCognitoConfig.clientId,
    vendiaShareCognitoConfig.region, vendiaShareCognitoConfig.identitypool)
    .then(credentials => {
        credentials.username = args.username;
        fsPromises
            .writeFile('./.share.env', JSON.stringify(credentials))
            .then(result => {
                console.log("Successfully authenticated to Vendia Share.  Temporary credentials are stored in .share.env.")
            });
    })
    .catch(error => {
        console.error("Failed to authenticate to Vendia Share.", error);
    });

