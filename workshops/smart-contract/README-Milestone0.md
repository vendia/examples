# Milestone 0 - Getting to Know the Flow

## Goal
Before our first official milestone, let's spend some time to understand the workflow of Vendia Share Smart Contract. In this milestone, let's go through the provided architectural diagram to understand each step of the flow.

## Smart Contract Execution Flow

![Smart Contract Flow](./img/smart-contract.svg)

Above chart is a illustration of all the pieces we need when we put smart contract in use. Note that it is after the creation of a smart contract.

The flow in verbal terms look like this when a smart contract is invoked:
1. Smart Contract gets invoked by upstream activity
2. Input query runs and gets data from Vendia Share
3. Smart contract sends event argument and triggers AWS lambda with the data returned
4. AWS lambda does any logic provided and return a graphql argument json object
5. The returned argument json then is applied to mutation query and the mutation is run

The only "complicated" part of this process is to setup proper access and permission for your AWS Lambda function. We must add proper permissions and policies to AWS lambda so Vendia Smart Contract can invoke it properly. Though lambda access to cloudwatch is optional, it is highly recommended for future debugging effort in case anything goes wrong.

Here's a list of things needed to create a Smart Contract and their Purposes:
* Input Query
    * Input Query is used to get data from Vendia Share. Consider this our way of getting the source data we need.
* Output Mutation
    * Output Mutation is the activity we have to do based on our logic. Based on our business flow, we can use the data and results gather to make meaningful changes to our data with output mutations.
* AWS Lambda Function with Proper Permission & Roles
    * AWS Lambda is where all our business logic, computation, and data manipulation happens.
* Creation of Smart Contract on Vendia Share with ALL ABOVE requirements
    * This is Vendia smart contract offered on Vendia Share. Any activities related to smart contract will be ledgered and available within Vendia Share.

## Quiz

* How does Smart Contrat get invoked?
* Where are we putting and executing the business logic?
* What's the purpose of input query and output mutation?

## Key Takeaways

* We walked through the logic flow of a smart contract execution
* List of requirements to create smart contract
* Purpose of each component in the flow

Next up, [Milestone 1](README-Milestone1.md).