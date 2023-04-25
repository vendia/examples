# Milestone 0 - Getting to Know the Flow

## Quiz Answers

* How does Smart Contrat get invoked?
    * By any upstream activities: user invocation, CMS, cron job, applications, etc.

* Where are we putting and executing the business logic?
    * All logics should be done inside deployed AWS lambda function.
* What's the purpose of input query and output mutation?
    * Input query gathers data we need from Vendia Share.
    * Output mutation is used for any changes needed on Vendia Share based on executed lambda function.
