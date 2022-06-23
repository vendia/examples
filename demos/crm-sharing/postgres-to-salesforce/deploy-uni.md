# Deploying the Example Uni

This example will create a Uni to store account contact items. These items, in turn, will be pushed to a Salesforce CRM instance.

If you are not already logged in to the share service you do so by running [`share login`](https://vendia.net/docs/share/cli/commands/login):

```bash
share login
```

The `share uni create` command can be used to deploy our Uni. You will need to copy the file `registration.json.sample` to `registration.json`. Pick a unique `name` for your Uni that begins with `test-` - by default all Unis share a common namespace so here is your chance to get creative. Update the `userId` attribute of each node to reflect your Vendia Share email address.

```bash
cd uni_configuration
share uni create --config registration.json
```

The Uni will take approximately 5 minutes to deploy. We can check on its status in the Vendia Share web application or with the `share` CLI.

**NOTE:** The name of your Uni will be different. Adjust as appropriate.

```bash
share get --uni test-postgres-to-salesforce
```

## Setting Node Variables

Variables will be stored in a file `.env`. A sample file `env.sample` must be copied to `.env` and appropriate details must be filled in for this example to function.

```bash
cp env.sample .env
```

### Node GraphQL URL

The **postgres** and **salesforce** GraphQL URLs can be retrieved programmatically.

```bash
# set variable UNI_NAME
export UNI_NAME=your-uni-name

# postgres node
share get --uni ${UNI_NAME} --json --silent| jq '.nodes[0].resources.graphqlApi.httpsUrl'
```

```bash
# salesforce node
share get --uni ${UNI_NAME} --json --silent | jq '.nodes[1].resources.graphqlApi.httpsUrl'
```

### Node Block Notification Topic

The solution will publish data from the **salesforce** Vendia node to an instance of Salesforce. You will need to capture the `aws_BlockNotifications` and store it in the `.env` file.

```bash
# salesforce node
share get --uni ${UNI_NAME} --json --silent | jq '.nodes[1].resources.aws_BlockNotifications.arn'
```

### Node API Key

Vendia provides two methods for customers to [connect and authenticate to a node](https://www.vendia.net/docs/share/node-authentication):

* API Keys

* JWT Tokens

For the purpose of this example, you will use API Keys. API Keys can be managed in the node settings in `Authentication`. Navigate to the **postgres** and **salesforce** node settings page and generate an API Key. You can set the API Key name to an arbitrary value. Use `postgres_to_salesforce_example` to make the key easier to identify.

**NOTE:** API Key values are visible and available at creation time only. Please store any keys in a secure, durable store.

Store the API Key values in the respective `POSTGRES_GRAPHQL_API_KEY` and `SALESFORCE_GRAPHQL_API_KEY` variables defined in the `.env` file.

Once the Uni is deployed we can deploy our [Postgres virtual machine](./deploy-postgres.md).
