##Exploring the Default Role of a New Vendia Share User
After creating a new Vendia Share user, we can use the Vendia Share CLI to inspect the Capabilities within that new user's `default` role.

We first authenticate using the CLI using the new user's Vendia Share credentials.
```
share login
```

We can then get information about the `default` role
```
share auth role get default
```

What we'll see is that the `default` role includes just one user Action (`USER_INVITE `) mapped to a Resource (`NameResource(*@*.*.*)`).  This means that, by default, the only user management operation this user is permitted to invoke is the `invite` mutation, which allows this user to invite any other Vendia Share user to join a Uni.

Note: This does not imply the other Vendia Share user will be permitted to join the Uni without some additional Uni permissions being granted, which we'll cover in the next section.
```
Found 1 Role
- "default"
.----------------------------------------------------------.
|                  Role "default" details                  |
|----------------------------------------------------------|
|      Action       |              Resources               |
|-------------------|--------------------------------------|
| UNI_INVITE        | NameResource(james+dev@*.vendia.net) |
| UNI_QUERY         | NameResource(james+dev@*.vendia.net) |
| UNI_RESET         | NameResource(james+dev@*.vendia.net) |
| UNI_DELETE        | NameResource(james+dev@*.vendia.net) |
| UNI_GET           | NameResource(james+dev@*.vendia.net) |
| UNI_JOIN          | UniResource(*.unis.vendia.net#*)     |
| UNI_CREATE        | UniResource(*.unis.vendia.net#*)     |
| UNI_EVOLVE_SCHEMA | NameResource(james+dev@*.vendia.net) |
| UNI_MUTATE        | NameResource(james+dev@*.vendia.net) |
| UNI_DELETE_NODE   | NameResource(james+dev@*.vendia.net) |
| USER_INVITE       | NameResource(*@*.*.*)                |
'----------------------------------------------------------'
```
