#!/bin/zsh

# This script is meant to setup demo environments which includes:
# 1. All Vendia share nodes
# 2. AWS lambda functions and roles
# 3. Share smart contracts created dependent on step

err() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')]: $*" >&2
}

if ! $?; then
  err "Unable to do_something"
  exit 1
fi


# 1. All Vendia share nodes

echo "Getting your username.."
user_name=$(share auth whoami | grep @vendia.net | awk '{print $5}')

if ! $?; then
  err "failed to get user name."
  exit 1
fi

echo "Your username is: " "$user_name" "Your nodes will be created under this username."

echo "Copy sample file and replacing all user ids to above user id."

cp ./uni_configuration/registration.json.sample ./uni_configuration/registration.json
sed -i -e "s/you@vendia.net/$user_name/g" ./uni_configuration/registration.json

if ! $?; then
  err "failed to generate registration files."
  exit 1
fi

share uni create --config ./uni_configuration/registration.json

if ! $?; then
  err "failed to create uni."
  exit 1
fi

## Ensure the uni is ready

uni_name=$(jq -r .name ./uni_configuration/registration.json)

while [ "$uni_status" != "RUNNING" ]
do
    uni_status=$(share uni get --uni "$uni_name" --json | jq -r .status)
    if [ $? -ne 0 ]; then
        err "failed to get uni status."
        exit 1
    fi
    echo "Waiting for uni to be ready... Current status is: " "$uni_status"
    sleep 10
done

echo "uni creation completed!"

## Gather node info for .share.env creation

### Save json output
uni_info=$(share uni get --uni "$uni_name" --json)

### Save node names
read -A nodes_names < <(echo $(echo $uni_info | jq -r '.nodes[] | .name'))
### Save graphql API endpoints
read -A graphqlAPI < <(echo $(echo $uni_info | jq -r '.nodes[].resources.graphqlApi.httpsUrl'))


### Create api keys for all nodes

echo "Creating API keys for all nodes...."
node_keys=()
for node in $nodes_names
do
        echo 'Creating key for node:' ${node} '...'
        node_keys+=$(share node add-api-key --uni ${uni_name} --node ${node} --name ${node:l}-key --expiry 9999 | awk '{print $3}')
done

### Generate .share.env file
### This will not work if in the future order of the returned nodes changes.

echo -e > .share.env \
"JPMC_GQL_URL=${graphqlAPI[1]}
JPMC_GQL_APIKEY=${node_keys[1]}
COOP_GQL_URL=${graphqlAPI[2]}
COOP_GQL_APIKEY=${node_keys[2]}
PHH_GQL_URL=${graphqlAPI[3]}
PHH_GQL_APIKEY=${node_keys[3]}
FNMA_GQL_URL=${graphqlAPI[4]}
FNMA_GQL_APIKEY=${node_keys[4]}
CSS_GQL_URL=${graphqlAPI[5]}
CSS_GQL_APIKEY=${node_keys[5]}"

# 2. AWS lambda functions

# Get all configuration information we need
# <vendia-smart-contract-arn> in main.tf needs to be replaced
# 


# 3. AWS roles that is meant to be attached to lambda functions
# To be filled

# 4. Share smart contracts created dependent on step 3)
# To be filled