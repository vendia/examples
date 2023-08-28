# Milestone 0 - Deploy the Uni
Before we get started, we'll have to spin up a [Uni](https://www.vendia.net/docs/share/dev-and-use-unis) to experiment with. We will be using the Food Supplier and Distributor Uni, which can be found [here](https://github.com/vendia/examples/tree/main/workshops/food-and-beverage/optimized-distribution). 

__If you have already set up this Uni in a previous workshop, feel free to skip this milestone and move on to [Milestone 1](README-Milestone1.md).__

## Explore the uni_configuration directory
The `uni_configuration` directory contains several files that will help you quickly create a new Uni.  Review the contents of each of these files to get a better understanding of their contents.

* __schema.json__ - Specifies the data model for this Uni
* __initial-state.json__ - Seeds the Uni with some initial data
* __registration.json.sample__ - Contains cloud, region, and account information for this Uni

## Create Your First Uni
Now it's time to create a Uni using the files from the previous section.

### Update Your registration.json File
First, rename the `registration.json.sample` to `registration.json`.  

You'll want to update the `name` for your Uni to be unique, but [preserving the `test-` prefix](https://www.vendia.net/docs/share/limits#uni-and-node-names).  By default, all Unis share a common namespace (`unis.vendia.net`) so try your best to avoid naming collisions - here is your chance to get creative!

You'll also want to update the `userId` of the `SupplierNode` to reflect your personal Vendia Share `userId` (i.e. the email address you used to register) before creating the Uni.

### Create the Uni
Next, if not already logged in to the Vendia Share [Command Line Interface (CLI)](https://vendia.net/docs/share/cli), do so by executing the command below and providing your Vendia Share credentials when prompted.

```bash
share login
```

After that, you're ready to create your first Vendia Share Uni.

```bash
cd uni_configuration
share uni create --config registration.json
```

The Uni will take approximately 5 minutes to launch.  You can check its status in the Vendia Share [web application](https://share.vendia.net) or using the Share CLI.

```bash
share get --uni <your_uni_name>
```

**NOTE:** `<your_uni_name>` should match the value of the `name` in `registration.json`

### Explore the Uni and Its Initial Data
Once the Uni is ready, explore its content using the Vendia Share [web application](https://share.vendia.net/).  The Uni has a single node, the **SupplierNode**.  The Share web app provides a number of views to explore the node in more detail.


## Key Takeaways
Congratulations.  You've successfully finished Milestone 0!

In this section you:

* Learned about Vendia Share's schema-first approach and the files necessary to create a Uni 
* Experienced the simplicity of creating a Universal Application, all in about 5 minutes
* Used Vendia Share's Entity Explorer to visualize the initial data loaded in the Uni

Now on to [Milestone 1](README-Milestone1.md), where we'll cover the basics of GraphQL.
