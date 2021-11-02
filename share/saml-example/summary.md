# Summary

In this example, we demonstrated how SAML federation can be used to authenticate requests to Vendia Share. This means that you can leverage IT investments you may have already made when authenticating requests to Vendia Share. You do not need to shoe-horn 

## Cleanup

When you are done with this example, you can run the following command to destroy your Uni.

**NOTE:** This action is destructive and will result in data loss.

```bash
% export UNI_NAME="your-uni-name"
% share uni delete --uni ${UNI_NAME} --force
```
