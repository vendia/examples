# Testing the Solution

Ultimately, you need to verify that contact information stored in the Postgres database is reflected in your Salesforce account.

Let's verify there is no data stored in either our Postgres database or Vendia Share Uni.

## Verify Data Stores are Empty

### Postgres

Use the `vagrant ssh` command to connect to your Postgres virtual machine. Run the following commands to list all items in the `account_contact` PostgreSQL table:

```bash
vagrant@postgres-to-salesforce:~$ psql -d vagrant
psql (12.11 (Ubuntu 12.11-0ubuntu0.20.04.1))
Type "help" for help.

vagrant=> SELECT * FROM account_contact;
 contactid | accountnumber | firstname | lastname | email | phone 
-----------+---------------+-----------+----------+-------+-------
(0 rows)

vagrant=> \q
vagrant@postgres-to-salesforce:~$
```

### Universal Application

Execute the following query from the **postgres** GraphQL Explorer in your Vendia Share Uni.

```graphql
query listAccountContacts {
  list_AccountContactItems {
    _AccountContactItems {
      ... on Self_AccountContact {
        contactId
        accountNumber
        firstName
        lastName
        email
        phone
      }
    }
  }
}
```

You should see the following result:

```json
{
  "data": {
    "list_AccountContactItems": {
      "_AccountContactItems": []
    }
  }
}
```

### Salesforce

Log in to your Salesforce instance and confirm the following contacts do _not_ exist in the specified accounts.

* Vikrant Kahlir: University of Arizona

* James Gimourginas: United Oil & Gas Corp

* Francine Klein: Pyramid Construction Inc

## Adding Data to our Data Stores

Let's go ahead and publish data to our PostgreSQL `account_contact` table. We have 3 scripts in the `vagrant` user's home directory `/home/vagrant`. Run the following command from the `postgres-to-salesforce` host:

```bash
vagrant@postgres-to-salesforce:~$ psql -d vagrant < 01-insert-account-contacts.sql 
INSERT 0 1
INSERT 0 1
INSERT 0 1
vagrant@postgres-to-salesforce:~$ 
```

If we connect to the database and run the same `SELECT` query we ran earlier, we should see 3 account contacts have been added.

```bash
vagrant@postgres-to-salesforce:~$ psql -d vagrant
psql (12.11 (Ubuntu 12.11-0ubuntu0.20.04.1))
Type "help" for help.

vagrant=> SELECT * FROM account_contact;
              contactid               | accountnumber | firstname |  lastname   |         email          |     phone      
--------------------------------------+---------------+-----------+-------------+------------------------+----------------
 6952dc5c-994d-42cd-b3e5-cd739f3e22da | CD736025      | Vikrant   | Kahlir      | vikrant_kahlir@uoa.edu | 9085551212
 13663bea-7a7e-4aed-b928-786d2f2b178c | CD355118      | James     | Klein       | jklein@uog.com         | (212) 842-5500
 2d40c8d0-8460-43d7-8464-14c9f38c4280 | CC213425      | Francine  | Gimourginas | francine@pyramid.net   | (014) 427-4427
(3 rows)

vagrant=> \q
vagrant@postgres-to-salesforce:~$ 
```

Let's go ahead and run the same GraphQL query we ran earlier to list account contacts.

```graphql
query listAccountContacts {
  list_AccountContactItems {
    _AccountContactItems {
      ... on Self_AccountContact {
        contactId
        accountNumber
        firstName
        lastName
        email
        phone
      }
    }
  }
}
```

This time, we should have data in our Uni as well. The **contactId**, **accountNumber**, **firstName**, **lastName**, **email**, and **phone** values should match the data we put into our `account_contact` PostgreSQL table.

```json
{
  "data": {
    "list_AccountContactItems": {
      "_AccountContactItems": [
        {
          "contactId": "6952dc5c-994d-42cd-b3e5-cd739f3e22da",
          "accountNumber": "CD736025",
          "firstName": "Vikrant",
          "lastName": "Kahlir",
          "email": "vikrant_kahlir@uoa.edu",
          "phone": "9085551212"
        },
        {
          "contactId": "13663bea-7a7e-4aed-b928-786d2f2b178c",
          "accountNumber": "CD355118",
          "firstName": "James",
          "lastName": "Klein",
          "email": "jklein@uog.com",
          "phone": "(212) 842-5500"
        },
        {
          "contactId": "2d40c8d0-8460-43d7-8464-14c9f38c4280",
          "accountNumber": "CC213425",
          "firstName": "Francine",
          "lastName": "Gimourginas",
          "email": "francine@pyramid.net",
          "phone": "(014) 427-4427"
        }
      ]
    }
  }
}
```

The new Contacts should also be present in Salesforce. Ensure the data in Postgres matches the data in Salesforce. Navigate to the United Oil & Gas Corp, University of Arizona, and Pyramid Construction Inc and confirm the `account_contact` items we added to the Postgres database are reflected as new Account Contacts.

## Updating Data

Let's go ahead and update data in our PostgreSQL `account_contact` table. Run the following command from the `postgres-to-salesforce` host:

```bash
vagrant@postgres-to-salesforce:~$ psql -d vagrant < 02-update-account-contacts.sql 
UPDATE 1
UPDATE 1
UPDATE 1
vagrant@postgres-to-salesforce:~$ 
```

If we connect to the database and run the same `SELECT` query we ran earlier, we should see each email address now contains the string `updated`.

```bash
vagrant@postgres-to-salesforce:~$ psql -d vagrant
psql (12.11 (Ubuntu 12.11-0ubuntu0.20.04.1))
Type "help" for help.

vagrant=> SELECT * FROM account_contact;
              contactid               | accountnumber | firstname |  lastname   |             email              |     phone      
--------------------------------------+---------------+-----------+-------------+--------------------------------+----------------
 6952dc5c-994d-42cd-b3e5-cd739f3e22da | CD736025      | Vikrant   | Kahlir      | vikrant_kahlir+updated@uoa.edu | 9085551212
 13663bea-7a7e-4aed-b928-786d2f2b178c | CD355118      | James     | Klein       | jklein+updated@uog.com         | (212) 842-5500
 2d40c8d0-8460-43d7-8464-14c9f38c4280 | CC213425      | Francine  | Gimourginas | francine+updated@pyramid.net   | (014) 427-4427
(3 rows)

vagrant=> \q
vagrant@postgres-to-salesforce:~$ 
```

Let's go ahead and run the same GraphQL query we ran earlier to list account contact items.

```graphql
query listAccountContacts {
  list_AccountContactItems {
    _AccountContactItems {
      ... on Self_AccountContact {
        contactId
        accountNumber
        firstName
        lastName
        email
        phone
      }
    }
  }
}
```

The data in our Uni has been updated. The `email` for each account contact should reflect what is present in our Posgres `account_contact` table.

```json
{
  "data": {
    "list_AccountContactItems": {
      "_AccountContactItems": [
        {
          "contactId": "6952dc5c-994d-42cd-b3e5-cd739f3e22da",
          "accountNumber": "CD736025",
          "firstName": "Vikrant",
          "lastName": "Kahlir",
          "email": "vikrant_kahlir+updated@uoa.edu",
          "phone": "9085551212"
        },
        {
          "contactId": "13663bea-7a7e-4aed-b928-786d2f2b178c",
          "accountNumber": "CD355118",
          "firstName": "James",
          "lastName": "Klein",
          "email": "jklein+updated@uog.com",
          "phone": "(212) 842-5500"
        },
        {
          "contactId": "2d40c8d0-8460-43d7-8464-14c9f38c4280",
          "accountNumber": "CC213425",
          "firstName": "Francine",
          "lastName": "Gimourginas",
          "email": "francine+updated@pyramid.net",
          "phone": "(014) 427-4427"
        }
      ]
    }
  }
}
```

The Contacts email addresses should also updated in Salesforce. Ensure the updated email address in Postgres matches the data in Salesforce. Navigate to the United Oil & Gas Corp, University of Arizona, and Pyramid Construction Inc and confirm each of the Contacts now has `+updated` in the user portion of their email addresses.

## Deleting Data

Let's go ahead and remove the records in the PostgreSQL `account_contact` table. Run the following command from the `postgres-to-salesforce` host:

```bash
vagrant@postgres-to-salesforce:~$ psql -d vagrant < 03-remove-account-contacts.sql 
DELETE 1
DELETE 1
vagrant@postgres-to-salesforce:~$
```

If we connect to the database and run the same `SELECT` query we ran earlier, we should see that the account contact information for James Klein and Francine Gimourginas have been removed. Only the information for Vikrant Kahlir remains.

```bash
vagrant@postgres-to-salesforce:~$ psql -d vagrant
psql (12.11 (Ubuntu 12.11-0ubuntu0.20.04.1))
Type "help" for help.

vagrant=> SELECT * FROM account_contact;
              contactid               | accountnumber | firstname | lastname |             email              |   phone    
--------------------------------------+---------------+-----------+----------+--------------------------------+------------
 6952dc5c-994d-42cd-b3e5-cd739f3e22da | CD736025      | Vikrant   | Kahlir   | vikrant_kahlir+updated@uoa.edu | 9085551212
(1 row)

vagrant=> \q
vagrant@postgres-to-salesforce:~$ 
```

Let's go ahead and run the same GraphQL query we ran earlier to list account contact in our Uni.

```graphql
query listAccountContacts {
  list_AccountContactItems {
    _AccountContactItems {
      ... on Self_AccountContact {
        contactId
        accountNumber
        firstName
        lastName
        email
        phone
      }
    }
  }
}
```

The data removal is reflected in our Uni as well. Only account contact information for Vikrant should remain.

```json
{
  "data": {
    "list_AccountContactItems": {
      "_AccountContactItems": [
        {
          "contactId": "6952dc5c-994d-42cd-b3e5-cd739f3e22da",
          "accountNumber": "CD736025",
          "firstName": "Vikrant",
          "lastName": "Kahlir",
          "email": "vikrant_kahlir+updated@uoa.edu",
          "phone": "9085551212"
        }
      ]
    }
  }
}
```

The Contacts for James Gimourginas and Francine Klein will also be removed in Salesforce. Navigate to United Oil & Gas Corp and Pyramid Construction Inc and confirm they have both been deleted. Only Vikrant Kahlir is still present in the Postgres database _and_ Salesforce.

## Summary

In this solution, you have seen how Vendia Share can be used to act as the connective tissue between disparate data stores. Salesforce users have a view of Contacts that is consistent with the organization's system of record. It is possible to take advantage of native programmatic capabilities like Postgres triggers and functions and Salesforce APIs - users of each system continue to use the tools they are already familiar with and use regularly.
