#!/bin/zsh

# This script is meant to setup demo environments which includes:
# 1. All Vendia share nodes
# 2. AWS lambda functions and roles
# 3. Share smart contracts created dependent on step

err() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')]: $*" >&2
}

if [[ $? -ne 0 ]] 
then
  err "Initial catch."
  exit 1
fi


# 1. All Vendia share nodes

echo "Getting your username.."
user_name=$(share auth whoami | grep @vendia.net | awk '{print $5}')

if [[ $? -ne 0 ]] 
then
  err "failed to get user name."
  exit 1
fi

echo "Your username is: " "$user_name" "Your nodes will be created under this username."

echo "Copy sample file and replacing all user ids to above user id."



## Copy the sample files and replace the user ids.
cp ./uni_configuration/registration.json.sample ./uni_configuration/registration.json

### replace user id
sed -i '' -e "s/you@vendia.net/$user_name/g" ./uni_configuration/registration.json

if [[ $? -ne 0 ]] 
then
  err "failed to generate registration files."
  exit 1
fi

### replace uni name

echo "Enter a uni name to be created:"

read uni_name

sed -i '' -e "s/test-loan-platform/$uni_name/g" ./uni_configuration/registration.json

if [[ $? -ne 0 ]] 
then
  err "failed to swap out uni name."
  exit 1
fi

## Creating the uni and nodes
share uni create --config ./uni_configuration/registration.json

if [[ $? -ne 0 ]] 
then
  err "failed to create uni."
  exit 1
fi

## Ensure the uni is ready

while [ "$uni_status" != "RUNNING" ]
do
    uni_status=$(share uni get --uni "$uni_name" --json | jq -r .status)
    if [ $? -ne 0 ]; then
        err "failed to get uni status."
        exit 1
    fi
    echo "Waiting for uni to be ready... Current status is: " "$uni_status"
    sleep 20
done

echo "uni creation completed!"

## Gather node info for .share.env creation

### Save json output
uni_info=$(share uni get --uni "$uni_name" --json)

### Note that all jq results are sorted to guarantee we are getting the right thing in right order.
### Save node names
read -A nodes_names < <(echo $(echo $uni_info | jq -r '.nodes | sort_by(.name) | .[].name'))
### Save graphql API endpoints
read -A graphqlAPI < <(echo $(echo $uni_info | jq -r '.nodes | sort_by(.name) | .[].resources.graphqlApi.httpsUrl'))
### Save smart contract info
read -A smart_contract_arn < <(echo $(echo $uni_info | jq -r '.nodes | sort_by(.name) | .[].resources.smartContracts.aws_Role'))
### Save websocket url info
read -A websocket_url < <(echo $(echo $uni_info | jq -r '.nodes | sort_by(.name) | .[].resources.graphqlApi.websocketUrl'))

### Create api keys for all nodes

echo "Creating API keys for all nodes...."
node_keys=()
for node in $nodes_names
do
        echo 'Creating key for node:' ${node} '...'
        node_keys+=$(share node add-api-key --uni ${uni_name} --node ${node} --name ${node:l}-key --expiry 9999 | awk '{print $3}')
done



# 2. AWS lambda functions

# copy the main.tf.template file, so re-running the script is fine.
cp ./src/terraform/main.tf.template ./src/terraform/main.tf

# Get all configuration information we need
# <vendia-smart-contract-arn> in main.tf needs to be replaced
# <fnman-vendia-smart-contract-arn>
sed -i '' -e "s|<fnman-vendia-smart-contract-arn>|${smart_contract_arn[3]}|g" ./src/terraform/main.tf
if [[ $? -ne 0 ]] 
then
  err "failed to modify terraform main.tf file for fnman smart contract arn."
  exit 1
fi

# <css-vendia-smart-contract-arn>
sed -i '' -e "s|<css-vendia-smart-contract-arn>|${smart_contract_arn[2]}|g" ./src/terraform/main.tf
if [[ $? -ne 0 ]] 
then
  err "failed to modify terraform main.tf file for css smart contract arn."
  exit 1
fi


(cd src/terraform; terraform init; terraform apply -auto-approve)

# 4. Share smart contracts created dependent on step 3)

# Get all lambda arns to create .share.env file
delinquent_lambda_arn=$(cd src/terraform; terraform output --raw lambda_delinquent_output)
upb_lambda_arn=$(cd src/terraform; terraform output --raw lambda_upb_output)
wair_lambda_arn=$(cd src/terraform; terraform output --raw lambda_wair_output)

### Generate .share.env file
### This will not work if in the future order of the returned nodes changes.

echo -e > ./src/.share.env \
"COOP_GQL_URL=${graphqlAPI[1]}
COOP_GQL_APIKEY=${node_keys[1]}
CSS_GQL_URL=${graphqlAPI[2]}
CSS_GQL_APIKEY=${node_keys[2]}
FNMA_GQL_URL=${graphqlAPI[3]}
FNMA_GQL_APIKEY=${node_keys[3]}
JPMC_GQL_URL=${graphqlAPI[4]}
JPMC_GQL_APIKEY=${node_keys[4]}
PHH_GQL_URL=${graphqlAPI[5]}
PHH_GQL_APIKEY=${node_keys[5]}
UPB_LAMBDA_ARN=${upb_lambda_arn}
DELINQUENT_LAMBDA_ARN=${delinquent_lambda_arn}
WAIR_LAMBDA_ARN=${wair_lambda_arn}"


# Run npm to create all the smart contracts

(cd src; npm i; npm run createUpbSmartContract;)
if [[ $? -ne 0 ]] 
then
  err "failed to create upb smart contract."
  exit 1
fi


(cd src; npm run createDelinquentSmartContract;)
if [[ $? -ne 0 ]] 
then
  err "failed to create delingquent smart contract."
  exit 1
fi

(cd src; npm run createWairSmartContract;)
if [[ $? -ne 0 ]] 
then
  err "failed to create wair smart contract."
  exit 1
fi

## Create empty folders for sample data

mkdir data
mkdir data/payments
mkdir data/loans

(cd src; npm run generatePayments;)
(cd src; npm run generateLoans;)

echo "All resources are created!"

# 5. Run Front end app

echo -e > ./src/app/src/__config.tsx \
"import { ClientOptions } from '@vendia/client';

type Config = Record<string, ClientOptions>;

export const config: Config = {
  FNMANode: {
    apiUrl: '${graphqlAPI[3]}',
    websocketUrl:
      '${websocket_url[3]}',
    apiKey: '${node_keys[3]}',
    debug: true,
  },
  COOPServicingNode: {
    apiUrl: '${graphqlAPI[1]}',
    websocketUrl:
      '${websocket_url[1]}',
    apiKey: '${node_keys[1]}',
    debug: true,
  },
  PHHServicingNode: {
    apiUrl: '${graphqlAPI[5]}',
    websocketUrl:
      '${websocket_url[5]}',
    apiKey: '${node_keys[5]}',
    debug: true,
  },
};

export const nodes = Object.keys(config);"

if [[ $? -ne 0 ]] 
then
  err "failed to create __config.tsx file."
  exit 1
fi

## cleanning up hidden folder to avoid incorrect info;
(rm -rf src/app/.vendia;)

## install vendia module and dependencies
(cd src/app; printf "y" | share client:pull --uni $uni_name --node $nodes_names[4];)

if [[ $? -ne 0 ]] 
then
  err "failed to pull vendia dependency."
  exit 1
fi

## install npm dependencies
(cd src/app; npm i;)
if [[ $? -ne 0 ]] 
then
  err "failed to install node dependencies."
  exit 1
fi

## run front end
(cd src/app; npm run dev;)
if [[ $? -ne 0 ]] 
then
  err "failed to run front end app."
  exit 1
fi