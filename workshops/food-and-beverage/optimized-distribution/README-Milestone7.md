# Milestone 7 - Create a Cross-Account Uni
In the previous sections, you've:

* Create a Supplier-Only Uni
* Added and Updated a Product Inventory
* Invited a Distributor to the Uni
* Collaborated using a Shared Source of Truth
* Enabled Event-Driven Notifications
* Used a Custom GraphQL Client

In this section, you will work with a partner to repeat the steps above in a more realistic fashion.

* One person should act as the Supplier, the other as the Distributor
* Milestones 1 and 2 will be largely the same
* In Milestone 3, the partner acting as the Supplier should invite the other partner acting as the Distributor
* In Milestones 4-6, each partner should act out only the steps for their assigned participant (Supplier or Distributor)  

Before getting started on this section, both you and your partner should destroy your existing Uni to avoid the [Starter plan limits](https://www.vendia.net/pricing#comparePlans).

* Executing this command from the Share CLI will delete your previously created Uni
```
share uni delete --uni <your_uni_name>
```

* Wait for the Uni to be fully deleted before proceding

```
share uni get --uni <your_uni_name>
```

Now you're ready to find a partner and get started!

## Key Takeaways
If you've made it this far, you've successfully reached Milestone 7!

In this section you:

* Embarked on a more realistic use of Vendia Share, one that involves multiple participants collaborating in real time across Vendia Share accounts and AWS regions
