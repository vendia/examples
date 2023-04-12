# Milestone 2 - Choose Appropriate Formats

## Goal
We talked about in most cases, `string` can be used as a type. But having a `string` by itself does not help with data consistency. The good news is that `format` is available to support `string` inputs. For this milestone, we will try out `format` with existing `string` to ensure we only get inputs we are looking for.

## Available formats in JSON Schema
Luckily, there are many useful built-in formats within JSON Schema. So we don't have to rebuild these wheels. For a comprehensive list of available JSON Schema formats, refer to [JSON Schema Formats](https://json-schema.org/understanding-json-schema/reference/string.html#built-in-formats). 

For the purpose of this workshop, we will only pick couple formats that we need for our ticketing system:
* `email` - Format as per [RFC 5321, section 4.1.2](http://tools.ietf.org/html/rfc5321#section-4.1.2)
* `date` - Format in YYYY-MM-DD

For one of the field that we had previously:

```
    "dateOfIssue": {
        "type": "string",
        "description": "The date and time this ticket was issued, in the format YYYY-MM-DD"
    }
```

With our new knowledge, we can add restriction to `dateOfIssue` to ensure we are in fact getting `date` information. All we have to do is to add a `format` field like below:
```
    "dateOfIssue": {
        "type": "string",
        "description": "The date and time this ticket was issued, in the format YYYY-MM-DD",
        "format": "date"  <---- Added here
    }
```

## Do it on your own

In our previous milestone, we have a `object` called `passenger`. Take a look at your schema's passenger section. Then add 2 additional fields:  `birthDate` and `email`. Remember to use `email` and `date` as their `formats` correspondingly.

Once done, compare it with our [Schema](./uni_configuration/milestone2-schema.json).

## Key Takeaways

Congratulations. You've successfully reached Milestone n!

* We can use JSON Schema built-in formats to manage our string data to ensure data consistency
* `format` can be added to `string` type only
* Many popular formats are already available and we don't have to re-write them

Next up, [Milestone 3](README-Milestone3.md).