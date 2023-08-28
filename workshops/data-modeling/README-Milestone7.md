# Milestone 7 - Define Re-usable Types

## Goal
In this milestone, we will explore `$ref` to allow reuse of our definitions inside our schema.

## Reuse What Can be Reused
Many might have heard phrases such as: "Don't reinvent the wheel", "Build it once and build it right". Once we have written our code, in this case, our schema, we need to do our best to re-use anything that overlaps with other entities. In our previous example, the most obvious reusable piece is probably `passenger`. Let's improve our schema a little bit and let's make `passenger` reusable.

First, we will copy the whole `passenger` section under `Tickets` and modify it a bit and then put it at the root of our schema json file:

```
    "definitions": {
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
            "required": ["firstName", "lastName"]
        }
    }
```

We then change the original passenger section of our schema and make it refer to our new root level definition:

```
    "passenger": {
        "description": "Information about the passenger",
        "$ref": "#/definitions/passenger"
    }
```

And we are done!

## Do it on your own
Say we have to create another entity called `Booking`. And within `Booking`, we need passenger information as well. How do we achieve that by re-using passenger definition made above?

Tips: 
There are 2 parts to this problem. One is that we must create a Booking entity at the same level as Ticket. Two is to create a passenger field that refers to `passenger` we created.

Once done, compare it with our [Schema](./uni_configuration/milestone7-schema.json).


## Key Takeaways

Congratulations. You've successfully reached Milestone 7!

* We can simply make things re-usable by using `$ref` keyword and refer to our definitions

Next up, [Milestone 8](README-Milestone8.md).