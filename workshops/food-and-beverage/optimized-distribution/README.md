<p align="center">
  <a href="https://vendia.net/">
    <img src="https://share.vendia.net/logo.svg" alt="vendia logo" width="250px">
  </a>
</p>

# Optimized Food and Beverage Distribution Workshop

[Vendia Share](https://www.vendia.net) is the real-time data cloud for rapidly building applications that securely share data across departments, companies, clouds, and regions.  This workshops demonstrates the ease of creating multi-party data sharing solutions using the Share platform.

The scenario you'll explore in this workshop may sound familiar.  A food Supplier and a Distributor currently do not have an effective way to share data in real-time, meaning that they often do not work from a single, shared source of truth.  This results in costly data reconciliation, frequent food waste, and a lack of awareness when deliveries are delayed.  After struggling with this challenge for some time, the Supplier and Distributor agree to pilot a new application.  This application will use the Vendia Share platform to enable real-time data sharing between the Supplier and Distributor, increasing data timeliness, reducing errors and manual intervention, and establishing a shared source of truth between both participants.

In this workshop, you will create your own Universal Application (or "Uni" for short), integrate an existing CLI application with the Uni, invite another participant to join your Uni, and, lastly, interact with that participant in real-time and with control.

# Pre-requisites

To complete this workshop, you'll need the following:

* [Git Client](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [Vendia Share CLI](https://vendia.net/docs/share/cli)
* [Vendia Share Account](https://share.vendia.net/signup)

In addition, you'll also need to clone this respository.

### Clone with SSH

```bash
git clone git@github.com:vendia/examples.git
```

### Clone with HTTPS

```bash
git clone https://github.com/vendia/examples.git
```

# Workshop Milestones
You'll incrementally create a multi-party application through a series of Milestones.  Each Milestone builds on the previous, so they should be executed in order.

## Foundational
* [Milestone 1 - Create a Supplier-Only Uni](README-Milestone1.md)
* [Milestone 2 - Add and Update the Product Inventory](README-Milestone2.md)
* [Milestone 3 - Invite a Distributor to the Uni](README-Milestone3.md)
* [Milestone 4 - Collaborate using a Shared Source of Truth](README-Milestone4.md)

## Advanced
* [Milestone 5 - Enable Event-Driven Notifications](README-Milestone5.md)
* [Milestone 6 - Use a Custom GraphQL Client](README-Milestone6.md)

## Optional
* [Milestone 7 - Create a Cross-Account Uni](README-Milestone7.md)
