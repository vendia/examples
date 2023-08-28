# Milestone 9 - Additional Pre-requisites

## Goal
Starting this milestone, we will talk about how to manage resources needed for our smart contract using terraform.

## Using Terraform
It might already be apparent that the manual steps we did previously was not scalable and hard to manage once we have 100+ smart contracts. So we will need better ways to do it. Terraform is a infrastructure as code tool that can help us manage all our cloud resources. So we don't have to manually create everything like we did in the milestones.

## Pre-requisites
Here are the things you need to get started:
* Basic knowledge of AWS (This guide will not go through how to create creddentials)
* [Install terraform](https://developer.hashicorp.com/terraform/downloads)
* [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* Necessary IAM credentials as environment variables:
  * AWS_ACCESS_KEY_ID
  * AWS_SECRET_ACCESS_KEY


One we have these dependencies ready, let's starting creating our resources using terraform.

## Key Takeaways

* Terraform can be used to manage our AWS resources
* Manual creation is not scalable

Next up, [Milestone 10](README-Milestone10.md).