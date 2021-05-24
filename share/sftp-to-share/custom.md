# Directions Using Route53 with Custom Host and Domain Names

This example assumes that you are using a custom host and domain name.

# Deploying the Serverless Application

## Build

```bash
cd .. # If in the uni_configuration directory
sam build --use-container --template custom-name.yml
```

## Deploy

```bash
sam deploy --guided --template custom-name.yml
```

You will be prompted to enter several pieces of data:

* *sftp-to-share* as the stack name

* *AWS Region* should match the same region as the **Shipper** Vendia Share node

* *ShareGraphqlUrl* from the **Shipper** Vendia Share node

* *ShareGraphqlApiKey* from the **Shipper** Vendia Share node

* *SftpUsername* will default to **sftp-to-share-demo** but you can change it

* *SftpUserPublicKey* to match the **public** SSH key.

* *HostedZoneId* will be driven by your AWS Route53 zone name

* *SftpFqdn* will default to **sftp-to-share.yourdomain.com**.  Update it to reflect your desired hostname and domain name associated with *HostedZoneId*.

Subsequent deployments can use the command `sam deploy`.  The values stored in *samconfig.toml* will be used.

# Testing the Example

Let's go ahead and [test our example out](./README.md/#testing-the-solution).
