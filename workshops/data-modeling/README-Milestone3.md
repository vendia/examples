# Milestone 3 - Define Required Fields

## Goal
More often than not, there will be some required fields in a Data Model. Fields that acts as primary key, business requirement, or even data needed as part of critical calculation are needed in an entity. In this milestone, we will define required fields in our data model.

## Required Properties
Luckily, it's very straight forward to define required fields in JSON Schema. Here's the [official documentation](https://json-schema.org/understanding-json-schema/reference/object.html#required-properties).

To define required fields, we simply add `required` field in a `object`.
Let's use the `passenger` object as an example again:

```
"passenger": {
    "description": "Information about the passenger",
    "type": "object",
    "properties": {
        "firstName": {
            "description": "Passenger's first name",
            "type": "string"
        },
        "lastName": {
            "description": "Passenger's last name",
            "type": "string"
        },
        "birthDate": {
            "description": "Passenger's birthday",
            "type": "string",
            "format": "date"
        },
        "email": {
            "description": "Passenger's email address",
            "type": "string",
            "format": "email"
        }
    },
    "required": ["firstName", "lastName"] <---- added here
}
```

Note that `required` field is at the same level as `type` field itself.

## Do it on your own
From our previous schema, define `passenger` and `ticketNumber` as required fields. 
Once done, compare it with our [Schema](./uni_configuration/milestone3-schema.json).

## Key Takeaways

Congratulations. You've successfully reached Milestone 3!

* we can ensure certain fields are provided by defining required fields in JSON schema

Next up, [Milestone 4](README-Milestone4.md).