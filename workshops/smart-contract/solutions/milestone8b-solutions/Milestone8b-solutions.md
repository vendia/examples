# Milestone 8b - Computation Business Logic in Lambda

## Answer to Questions

* What happens if the returned JSON contains inappropriate data types and being passed down to our output mutation?

  * The lambda function will successfully execute. But our output mutation will not fail. We are able to see it under our Uni's transaction tab. We can find them with the transaction that has mutations keys `ContractTask`. This is currently the only way to debug any failed output mutation.