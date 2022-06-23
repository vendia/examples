<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Initial Share Authentication
The [examples](../README.md) in the `access-controls` directory contain custom GraphQL client interactions with Vendia Share.  Those interactions are protected by one or more access control mechanisms, meaning only authorized requests to the targeted GraphQL API will succeed.

Follow these simple steps to authenticate to Vendia Share and enable the custom GraphQL client interactions in the `access-controls` directory.

## Install Dependencies
Install the dependencies for this module using `npm`.

```
npm install
```

## Authenticate to Share
Login to Share in a single command, substituting your Share user account credentials for `<you@domain.com>` and `<password>` in the command below.
```
npm run login -- --username <you@domain.com> --password <password> 
```

**Note:** the command above creates a `.share.env` file with temporary credentials in this directory.  The file will be ignored by Git, thanks to the `.gitignore` file at the top-level of this project.  You may stil want to delete the `.share.env` file when you're done with this section.

**Note:** the authorization tokens and temporary credentials produced by the command above are valid for only a period of time.  You may need to re-authenticate periodically to maintain a valid set of credentials. 
