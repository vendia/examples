<p align="center">
  <a href="https://vendia.net/">
    <img src="https://www.vendia.net/images/logo/black.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Vendia Share Access Controls

## Overview
A core tenet of [Vendia Share](https://www.vendia.net/product) is _sharing with control_.  That tenet is the basis for a number of access control features that allow participants to gain trust in the Vendia Share platform, and with each other.

Access controls have been built into multiple levels of the Vendia Share architecture.

* [User Management Access Controls](https://www.vendia.net/docs/share/rbac#user-actions) - Protect Vendia Share user account management operations
* [Uni Management Access Controls](https://www.vendia.net/docs/share/rbac#uni-actions) - Protect Vendia Share Uni management operations
* [Node Access Controls](https://www.vendia.net/docs/share/node-access-control) - Protects a node's GraphQL API
* [Data Access Controls](https://www.vendia.net/docs/share/fine-grained-data-permissions) - Protects the data stored in a Uni

<figure>
    <img src="https://user-images.githubusercontent.com/85032783/151488928-76a5b185-329e-424a-af46-17a397868716.png" />
    <figcaption ><b>Figure 1</b> - <i>Vendia Share Access Controls</i></figcaption>
</figure>

As shown in Figure 1, the user and Uni access controls protect the Vendia Share control plane and the node and data access controls protect the Vendia Share data plane.  You can differentiate control and data plane access controls by considering whether the access control protects the Vendia Share platform (if so, it's a _control plane_ protection) or a Uni or node (if so, it's a _data plane_ protection).  The most important point is that multiple access controls exist in each plane of the Vendia Share architecture.  In addition to providing defense-in-depth, the numerous available access controls offer each participant in a Uni the flexibility and control they often need to willingly share data with others.

## Feature Examples
You can explore each access control mechanism by navigating through the examples linked at the bottom of this section.

### Prerequisites
Each example is self-contained so can explore any or all of them in any order you choose.  However, each example has the same prerequisites so you will want to complete these before jumping in.

* [Vendia Share Account](https://share.vendia.net/)
* [Vendia Share CLI](https://vendia.net/docs/share/cli)
* [Share Authentication](share-auth/README.md)
    * Required prior to running any custom GraphQL client invocations in the Examples below

### Examples
* [User Management Access Controls](user-access-controls/README.md)
* [Uni Management Access Controls](uni-access-controls/README.md)
* [Node Access Controls](node-access-controls/README.md)
* [Data Access Controls](data-access-controls/README.md)
