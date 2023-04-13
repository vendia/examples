# Milestone 6 - Define Pattern with Regex

## Goal
In this milestone, we will explore a regular expression powered property called `pattern`. If you are not familiar with regular expression, just think it as a pattern that's defined by you for now. It plays a huge role in data consistency.

## Using Regular Expression to Keep Your Data Consisetent
In Milestone 2, we tried out the keyword `format`. It was conveniently provided to us for most commonly used patterns. What if there are other patterns we would like to use that are not so common? Say airline flight patterns, car plates, or some product serial numbers? We can restrict `string` input by writing a `pattern` in regular expression. The pattern value must be a valid JavaScript (EMCA 262) regular expression. A sample looks like this:

```
{
   "type": "string",
   "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
}
```
This matches a simple North American telephone number with an optional area code.

Now let's make our data constraint more realistic. We have a field called `airlineCode` and it's supposed to be only 2 upper case letters. The regex would look like: `"[A-Z]{2}"`. Putting it into our schema it will look like:

```
"airlineCode": {
    "type": "string",
    "description": "The 2-letter code of the issuing airline",
    "pattern": "[A-Z]{2}"
}
```

Now we can ensure nobody can put random `airlineCode` data inside our ledger. 

For a complete explanation of EMCA 262 regular expression, refer to their official documentation [here](https://262.ecma-international.org/5.1/#sec-15.10).

## Do it on your own

We have an property called `ticketNumber`. Disregard it's description. Let's say it is a 13 digit number. What would that regex be? How do you put that in our schema? Take some time and update your schema with a pattern for `ticketNumber`.

Once done, compare it with our [Schema](./uni_configuration/milestone6-schema.json).


## Key Takeaways

Congratulations. You've successfully reached Milestone 6!

* `pattern` can be used with strings
* `pattern` is written in JavaScript (EMCA 262) regular expression

Next up, [Milestone 7](README-Milestone7.md).