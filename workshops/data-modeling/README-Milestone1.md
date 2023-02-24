# Milestone 1 - Choose Appropriate Types

## Goal
For our first milestone, let's understand and try to use as many types as possible. Then understand when to use each type.

## JSON schema types

Here's a list of all available JSON schema types:
* string - a piece of text
* integer - whole number
* number - real number
* object - a more complex entity that could include multiple of other types.
* array - a list of any types.
* boolean - Yes or No
* null - It is a specific value that represents empty. For easiness of this milestone, let's treate it as a unique value that can't be used.

For programmatic definition of these types, refer to [JSON Schema types](https://json-schema.org/understanding-json-schema/reference/type.html#type-specific-keywords).

To build a ticketing system, we first need ticket object in our data model. So, let's first have tickets defined in our schema with below fields. 

* passenger name record code (string)
* passenger (object)
* airline code (string)
* ticket number (string)
* date of issue (string)
* price (number)
* payments (array)
* confirmed (boolean)

These are opinioned ways of defining these field types. You can, in fact define everything as string. Each team has their own data practice so we will not dive deep into that.


Let's start putting above fields we want into below template.
```
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Data Model Workshop milestone 1",
    "description": "This schema is for data model workshop milestone 1",
    "type": "object",
    "properties": {
        "Ticket": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    // to be filled
                }
            }
        }
    }
}
```

The english translation of the above json snippet is: There is an array of `Tickets`. Each `Ticket` item is an `object` with properties: `// to be filled`.

Now let's put in our first property `passenger name record code`:

```
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Data Model Workshop milestone 1",
    "description": "This schema is for data model workshop milestone 1",
    "type": "object",
    "properties": {
        "Ticket": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "passengerNameRecordCode": {
                        "type": "string",
                        "description": "A unique passenger record, represented by a 6-digit alphanumeric value"
                    }
                }
            }
        }
    }
}
```

The filled in snippet:
```
"passengerNameRecordCode": {
    "type": "string",
    "description": "A unique passenger record, represented by a 6-digit alphanumeric value"
}
```
Translates into English: There is a property called `passengerNameRecordCode` in each ticket item, and its type is `string`.

## Do it on your own
Spend some time to fill in the rest of the fields. Bonus for filling `passenger` and `payments` field. Once done, compare it with our [Schema](./uni_configuration/milestone1-schema.json).

## Key Takeaways

Congratulations. You've successfully reached Milestone 1!

* Json schema has 7 data types: `string`, `integer`, `number`, `object`, `array`, `boolean`, `null`
* String can be used in most of the type. But it is recommended to thoughtfully define types according to what they are.

Next up, [Milestone 2](README-Milestone2.md).