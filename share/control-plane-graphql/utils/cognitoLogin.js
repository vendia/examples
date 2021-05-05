/*

The functions in this file retrieve credentials from the Vendia Cognito user pool using the given email/password

*/
const AmazonCognitoIdentity =require('amazon-cognito-identity-js');
const AWS=require('aws-sdk');

module.exports.Login=async function(Username, Password,Pool,Client,Region,IdentityPoolId) {
    return new Promise((resolve,reject)=> {
        let authenticationData = {Username,Password};
        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        let poolData = {UserPoolId: Pool, ClientId: Client};
        let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        let userData = {Username,Pool:userPool};
        let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                var accessToken = result.getAccessToken().getJwtToken();
                AWS.config.region = Region;
                let Logins={};
                Logins[`cognito-idp.${Region}.amazonaws.com/${Pool}`]=result.idToken.jwtToken;
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: IdentityPoolId, 
                    Logins
                });
                        // Make the call to obtain credentials
            AWS.config.credentials.get(function(){

                // Credentials will be available when this function is called.
                var accessKeyId = AWS.config.credentials.accessKeyId;
                var secretAccessKey = AWS.config.credentials.secretAccessKey;
                var sessionToken = AWS.config.credentials.sessionToken;
                resolve({accessKeyId,secretAccessKey,sessionToken});
            });

            },
            onFailure: function(err) {
                reject(err.message || JSON.stringify(err));
            },
        });
    });
};