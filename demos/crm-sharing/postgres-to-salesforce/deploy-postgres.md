# Deploying the Postgres Database

Now that you've [deployed your Uni](./deploy-uni.md), you will deploy a Postgres database running on a virtual machine. The database will have a similar schema to the Uni. It will store information about account contacts.

Vagrant and Ansible are used to deploy a Docker image with a PostgreSQL database.

**NOTE:** You will need to copy the file `examples/demos/crm-sharing/postgres-to-salesforce/postgres/roles/postgres/vars/main.yml.sample` to `examples/demos/crm-sharing/postgres-to-salesforce/postgres/roles/postgres/vars/main.yml` and update the `share_node_url` and `share_node_api_key` entries in the file `examples/demos/crm-sharing/postgres-to-salesforce/postgres/roles/postgres/vars/main.yml` before running the commands below. Failure to do so will prevent data from being published from the PostgreSQL virtual machine to the **postgres** node in Vendia Share.

**NOTE:** You will need to ensure the `accountnumber` values stored in `examples/demos/crm-sharing/postgres-to-salesforce/postgres/roles/postgres/files/*.sql` are valid Salesforce accounts __before__ creating and provisioning your virtual machine with Vagrant.

```bash
cd postgres # Need to be in the root of the examples/demos/crm-sharing/postgres-to-salesforce/postgres example
vagrant up postgres
```

In a few minutes, a Vagrant virtual machine named `postgres` will be available. You can run the following command to confirm it is up and available.

```bash
vagrant status postgres
```

You can connect to the virtual machine using the following command if you'd like:

```bash
vagrant ssh postgres
```

## What Just Happened?

We used Ansible and Vagrant to:

* Create and start a Docker container running Postgres

* Create a PostgreSQL database `vagrant`

* Create a PostgreSQL database user `vagrant`

* Create a `item` table in the `vagrant` database

* Add the `plpython3u` database extension

* Create PostgreSQL triggers and functions so that GraphQL queries against your Vendia Share **postgres** node are run when data is added, updated, or deleted in the `account_contact` table

* Added 3 SQL scripts to make our data changes easy to run

## Viewing Database Information

Once you have SSHd to the `postgres` virtual machine, you can run the following commands to verify what the Ansible playbook did:

```bash
vagrant@postgres-to-salesforce:~$ psql -d vagrant
psql (12.11 (Ubuntu 12.11-0ubuntu0.20.04.1))
Type "help" for help.

vagrant=> \dt;
              List of relations
 Schema |      Name       | Type  |  Owner   
--------+-----------------+-------+----------
 public | account_contact | table | postgres
(1 row)

vagrant=> \d account_contact
            Table "public.account_contact"
    Column     | Type | Collation | Nullable | Default 
---------------+------+-----------+----------+---------
 contactid     | text |           | not null | 
 accountnumber | text |           |          | 
 firstname     | text |           |          | 
 lastname      | text |           |          | 
 email         | text |           |          | 
 phone         | text |           |          | 
Indexes:
    "account_contact_pkey" PRIMARY KEY, btree (contactid)
Triggers:
    add_to_share AFTER INSERT ON account_contact FOR EACH ROW EXECUTE FUNCTION add_to_share()
    remove_from_share BEFORE DELETE ON account_contact FOR EACH ROW EXECUTE FUNCTION remove_from_share()
    update_in_share BEFORE UPDATE ON account_contact FOR EACH ROW EXECUTE FUNCTION update_in_share()

vagrant=> \q
vagrant@postgres-to-salesforce:~$ 
```

Now that you have your Uni and Postgres database up and running, let's [deploy Salesforce](./deploy-salesforce.md).
