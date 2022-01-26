Exploring the Default Role of a New Vendia Share User
After creating a new Vendia Share user, we can use the Vendia Share CLI to inspect the Capabilities within that new user's `default` role.

We first authenticate using the CLI using the new user's Vendia Share credentials.
```
share login
```

We can then get information about the `default` role
```
share auth role get default
```

What we'll see is that the `default` role includes a large set of Uni management actions, but that those actions are conservatively applied to just that new user.  This means that, by default, the user is permitted to invoke most of the available Uni management operations, provided those operations target a Uni created by that new user.

Note: This user is able to invite any other Vendia Share user to a Uni in which the user owns at least one node (via the `UNI_INVITE` capability).  And this user is able to accept an invitation to join a Uni, provided that Uni resides in the `vendia.net` namespace, which is the default namespace for all Unis.  However, if this new user wants to join an Enterprise tier Uni in the `acme.com` namespace, a role update will be necessary.
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
