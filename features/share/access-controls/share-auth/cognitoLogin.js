import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import AWS from "aws-sdk";
import inquirer from "inquirer";

export function Login(
  username,
  password,
  userPoolId,
  clientId,
  region,
  identityPoolId
) {
   
  return new Promise((resolve, reject) => {
    let authenticationData = { Username: username, Password: password };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    let poolData = { UserPoolId: userPoolId, ClientId: clientId };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = { Username: username, Pool: userPool };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    const onSuccess = (result) => {
        const identityJwt = result.getIdToken().getJwtToken();
        let Logins = {};
        Logins[
          `cognito-idp.${region}.amazonaws.com/${userPoolId}`
        ] = identityJwt;

        AWS.config.region = region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials(
          {
            IdentityPoolId: identityPoolId,
            Logins,
          }
        );

        AWS.config.credentials.get(function () {
          const accessKeyId = AWS.config.credentials.accessKeyId;
          const secretAccessKey =
            AWS.config.credentials.secretAccessKey;
          const sessionToken = AWS.config.credentials.sessionToken;

          resolve({
            identityJwt,
            accessKeyId,
            secretAccessKey,
            sessionToken,
          });
        });
      }
      const onFailure = function (err) {
          reject(err.message || JSON.stringify(err));
      };
    cognitoUser.authenticateUser(authenticationDetails, {
      totpRequired: function (challengeName, challengeParameters) {
        inquirer
          .prompt([
            {
              name: "AuthCode",
              type: "password",
              message: "Auth code:",
            },
          ])
          .then(
            (result) => {
              cognitoUser.sendMFACode(
                result.AuthCode,
                {
                  onSuccess,
                  onFailure,
                },
                challengeName
              );
            },
            (err) => {
              console.error(err);
            }
          );
      },
      onSuccess,
      onFailure,
    });
  });
}
