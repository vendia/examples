# Milestone 5 - Create Smart Contraction on Vendia

## Answer to Questions

* What does our input query do? and how are we using the data we got from it?
  * It lists out all the loans filtered by `loanIdentifier` and limited output to whatever value we provide it. We are not using the data we got from it at all because our lambda function never used any data from `event` data.
* If I want my loans to have values based on my input, what changes do I have to make?
  * We will have to replace our lambda's code. Specifically, at object creation, we need to replace the values with other variables.
* What if I invoke my smart contract with different argument values?
  * It doesn't matter how we invoke our smart contracts, the output will be the same.
