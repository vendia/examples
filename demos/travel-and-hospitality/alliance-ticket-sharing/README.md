# Vendia Share Demo - A Real-Time Alliance Ticket Share

[Vendia Share](https://www.vendia.net) is the real-time data cloud for rapidly building applications that securely share data across departments, companies, clouds, and regions.  

## Demo Overview

* __Level__
    * Intermediate
* __Highlighted Features__
    * Fine-grained data access controls
    * Participant invite flow
    * GraphQL

This demo highlights the purpose and ease of creating data access controls for multi-party data sharing solutions, using the Vendia Share platform, as applied to the Travel and Hospitality industry. 

## Demo Context
Specifically, this demo explores an [alliance partnership](https://www.aa.com/i18n/travel-info/partner-airlines/iberia.jsp) where two airlines (American Airlines and Iberia Airlines) use Vendia Share to exchange ticket information in real-time.  Prior to using Vendia Share, the airlines often struggled to maintain a consistent, shared source of truth for tickets.   Since adopting Vendia Share, they dramatically decreased the time and resource spent on data reconciliation between their isolated ticket databases, increased visibility into each other's ticket activities, and improved their collective AI/ML algorithms using a larger, more accurate ticket data set.

## Demo Pre-Requisites
This demo heavily uses the Share CLI and the GraphQL Explorer so all pre-reqs listed are required.

* [Vendia Share Account](https://share.vendia.net/signup)
* [Git Client](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [Vendia Share CLI](https://vendia.net/docs/share/cli)

In addition, you'll also need to clone this repository.

<details>
<summary>Instructions for cloning the repository</summary>

### Clone with SSH

```bash
git clone git@github.com:vendia/examples.git
```

### Clone with HTTPS

```bash
git clone https://github.com/vendia/examples.git
```

</details>

## Step 1 - Create a Multi-Party Uni
To create a Uni using the [Share CLI]((https://vendia.net/docs/share/cli).

1. Change directories to `uni_configuration`
    1. `cd uni_configuration`
1. Create your own copy of the `registration.json.sample` file, removing the `.sample` suffix
    1. `cp registration.json.sample registration.json`
1. Edit the `registration.json` file changing
    1. `name` - keep the `test-` prefix but make the remainder of the name unique
    1. `userId` - on both nodes should match your Vendia Share `userId` (i.e. your email address)
1. Create the Uni
    1. `share uni create --config registration.json`

Wait about 5 minutes for the Uni to reach a `Running` state.

## Step 2 - Add Tickets as American Airlines
To make tickets available to Iberia Airlines, American Airlines must first add tickets to the Uni.

### Add Tickets as American Airlines
As American Airlines, add several Tickets to the Uni using a set of GraphQL mutations, each with Access Control List (ACL) information that defines the read and write access to the tickets from all other nodes in the Uni.

1. Open the GraphQL Explorer of the __AmericanNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [american-tickets.gql](resources/american-tickets.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __AmericanNode__
1. Monitor the progress modal in the lower-right to confirm the tickets are added successfully 

### Confirm Tickets as American Airlines

#### Using GraphQL Explorer
You can view the newly added Tickets through the GraphQL Explorer view of the Vendia Share web app.

1. Open the GraphQL Explorer of the __AmericanNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents below into the GraphQL Editor
    ```graphql
    query listMyTickets {
        list_TicketItems {
            _TicketItems {
                ... on Self_Ticket {
                    _id
                    _owner
                    ticketNumber
                    airlineCode
                    commissions {
                        commissionType
                        rate
                        value {
                            amount
                            currency
                            precision
                        }
                    }
                    coupons {
                        additionalServicesAttributeGroup
                        baggage {
                            allowance
                            overAllowanceQualifier
                            quantity
                            rate {
                                amount
                                currency
                                precision
                            }
                        }
                        classOfService
                        conjunctionCompanionTicketIndicator
                        couponNumber
                        operatingAirlineDesignator
                        remarks
                        soldAirlineDesignator
                        soldDestinationCityCode
                        soldFlightDepartureDateTime
                        soldFlightNumber
                        soldOriginCityCode
                        soldReservationBookingDesignator
                        soldReservationStatusCode
                        stopoverCode
                        ticketDesignator
                        ticketNumber
                        ticketingDateOfIssue
                        useIndicator
                        value {
                            amount
                            currency
                            precision
                        }
                    }
                    dateOfIssue
                    fees {
                        code
                        subCode
                        value {
                            amount
                            currency
                            precision
                        }
                    }
                    passenger {
                        dateOfBirth
                        firstName
                        frequentFlyerInformation {
                            airlineCode
                            frequentFlyerNumber
                        }
                        lastName
                    }
                    passengerNameRecordCode
                    payments {
                        paymentType
                        paymentValue {
                            amount
                            currency
                            precision
                        }
                    }
                    prices {
                        baseFareAmount {
                            amount
                            currency
                            precision
                        }
                        equivalentFarePaid {
                            amount
                            currency
                            precision
                        }
                    }
                    taxes {
                        code
                        subCode
                        value {
                            amount
                            currency
                            precision
                        }
                    }
                    ticketDocumentInfo {
                        attributeGroup
                        attributeSubGroup
                        documentType
                        endorsementRestriction
                        fareBasis
                        fareCalculationArea
                        fareCalculationModeIndicator
                        fareCalculationPricingIndicator
                        internationalSaleIndicator
                        primaryDocumentNumber
                    }
    
                    bookingAgentId
                    remarks
                }
            }
        }
    }
    
    ```

1. Click the `>` button to submit the request to the __AmericanNode__
1. View the results.  Notice that all fields from the prior mutations are populated, including the `ticketDocumentInfo.fareBasis` and `ticketDocumentInfo.fareCalculationArea` fields.

#### Using Entity Explorer
You can view the newly added Tickets through the Entity Explorer view of the Vendia Share web app.  

1. Select the `Entity Explorer` view of the __AmericanNode__
1. Click the `_id` field of one of the Ticket entries listed in the table
1. View the results. Notice that all fields from the prior mutations are populated, including the `ticketDocumentInfo.fareBasis` and `ticketDocumentInfo.fareCalculationArea` fields.

### Confirm Products as Iberia Airlines
You can also confirm the existence of the newly added Tickets by executing this GraphQL query from the GraphQL Explorer of the __IberiaNode__

#### Using GraphQL Explorer
You can view the newly added Tickets through the GraphQL Explorer view of the Vendia Share web app.

1. Open the GraphQL Explorer of the __IberiaNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents below into the GraphQL Editor
    ```graphql
    query listPartnerTickets {
      list_TicketItems {
        _TicketItems {
          ... on Self_Ticket_Partial_ {
            _id
            _owner
            ticketNumber
            airlineCode
            commissions {
              commissionType
              rate
              value {
                amount
                currency
                precision
              }
            }
            coupons {
              additionalServicesAttributeGroup
              baggage {
                allowance
                overAllowanceQualifier
                quantity
                rate {
                  amount
                  currency
                  precision
                }
              }
              classOfService
              conjunctionCompanionTicketIndicator
              couponNumber
              operatingAirlineDesignator
              remarks
              soldAirlineDesignator
              soldDestinationCityCode
              soldFlightDepartureDateTime
              soldFlightNumber
              soldOriginCityCode
              soldReservationBookingDesignator
              soldReservationStatusCode
              stopoverCode
              ticketDesignator
              ticketNumber
              ticketingDateOfIssue
              useIndicator
              value {
                amount
                currency
                precision
              }
            }
            dateOfIssue
            fees {
              code
              subCode
              value {
                amount
                currency
                precision
              }
            }
            passenger {
              dateOfBirth
              firstName
              frequentFlyerInformation {
                airlineCode
                frequentFlyerNumber
              }
              lastName
            }
            passengerNameRecordCode
            payments {
              paymentType
              paymentValue {
                amount
                currency
                precision
              }
            }
            prices {
              baseFareAmount {
                amount
                currency
                precision
              }
              equivalentFarePaid {
                amount
                currency
                precision
              }
            }
            taxes {
              code
              subCode
              value {
                amount
                currency
                precision
              }
            }
            ticketDocumentInfo {
              attributeGroup
              attributeSubGroup
              documentType
              endorsementRestriction
              fareBasis
              fareCalculationArea
              fareCalculationModeIndicator
              fareCalculationPricingIndicator
              internationalSaleIndicator
              primaryDocumentNumber
            }
            
            bookingAgentId
            remarks
          }
        }
      }
    }
    
    ```

1. Click the `>` button to submit the request to the __IberiaNode__
1. View the results.  Notice that most of fields from the prior mutations are populated, except for the `ticketDocumentInfo.fareBasis` and `ticketDocumentInfo.fareCalculationArea` fields.

#### Using Entity Explorer
You can view the newly added Tickets through the Entity Explorer view of the Vendia Share web app.

1. Select the `Entity Explorer` view of the __IberiaNode__
1. Click the `_id` field of one of the Ticket entries listed in the table
1. View the results.  Notice that most of fields from the prior mutations are populated, except for the `ticketDocumentInfo.fareBasis` and `ticketDocumentInfo.fareCalculationArea` fields.

#### Explanation
The ACL appended to the first ticket prevented that ticket from reaching the __IberiaNode__.  The ACL appended to the second ticket allowed it to reach the __IberiaNode__ but excluded the `fareBasis` and `fareCalculationArea` from being transmitted.

## Step 3 - Add Tickets as Iberia Airlines
To make tickets available to American Airlines, Iberia Airlines must first add tickets to the Uni.

### Add Tickets as Iberia Airlines
As Iberia Airlines, add several Tickets to the Uni using a set of GraphQL mutations, each with Access Control List (ACL) information that defines the read and write access to the tickets from all other nodes in the Uni.

1. Open the GraphQL Explorer of the __IberiaNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents of [iberia-tickets.gql](resources/iberia-tickets.gql) into the GraphQL Editor
1. Click the `>` button to submit the request to the __IberiaNode__
1. Monitor the progress modal in the lower-right to confirm the tickets are added successfully

### Confirm Tickets as Iberia Airlines

#### Using GraphQL Explorer
You can view the newly added Tickets through the GraphQL Explorer view of the Vendia Share web app.

1. Open the GraphQL Explorer of the __IberiaNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents below into the GraphQL Editor
    ```graphql
    query listMyTickets {
      list_TicketItems {
        _TicketItems {
          ... on Self_Ticket {
            _id
            _owner
            ticketNumber
            airlineCode
            commissions {
              commissionType
              rate
              value {
                amount
                currency
                precision
              }
            }
            coupons {
              additionalServicesAttributeGroup
              baggage {
                allowance
                overAllowanceQualifier
                quantity
                rate {
                  amount
                  currency
                  precision
                }
              }
              classOfService
              conjunctionCompanionTicketIndicator
              couponNumber
              operatingAirlineDesignator
              remarks
              soldAirlineDesignator
              soldDestinationCityCode
              soldFlightDepartureDateTime
              soldFlightNumber
              soldOriginCityCode
              soldReservationBookingDesignator
              soldReservationStatusCode
              stopoverCode
              ticketDesignator
              ticketNumber
              ticketingDateOfIssue
              useIndicator
              value {
                amount
                currency
                precision
              }
            }
            dateOfIssue
            fees {
              code
              subCode
              value {
                amount
                currency
                precision
              }
            }
            passenger {
              dateOfBirth
              firstName
              frequentFlyerInformation {
                airlineCode
                frequentFlyerNumber
              }
              lastName
            }
            passengerNameRecordCode
            payments {
              paymentType
              paymentValue {
                amount
                currency
                precision
              }
            }
            prices {
              baseFareAmount {
                amount
                currency
                precision
              }
              equivalentFarePaid {
                amount
                currency
                precision
              }
            }
            taxes {
              code
              subCode
              value {
                amount
                currency
                precision
              }
            }
            ticketDocumentInfo {
              attributeGroup
              attributeSubGroup
              documentType
              endorsementRestriction
              fareBasis
              fareCalculationArea
              fareCalculationModeIndicator
              fareCalculationPricingIndicator
              internationalSaleIndicator
              primaryDocumentNumber
            }
            
            bookingAgentId
            remarks
          }
        }
      }
    }
    
    ```

1. Click the `>` button to submit the request to the __IberiaNode__
1. View the results.  Notice that all fields from the prior mutations are populated, including the `ticketDocumentInfo.fareBasis` and `ticketDocumentInfo.fareCalculationArea` fields.

#### Using Entity Explorer
You can view the newly added Tickets through the Entity Explorer view of the Vendia Share web app.

1. Select the `Entity Explorer` view of the __IberiaNode__
1. Click the `_id` field of one of the Ticket entries listed in the table
1. View the results. Notice that all fields from the prior mutations are populated, including the `ticketDocumentInfo.fareBasis` and `ticketDocumentInfo.fareCalculationArea` fields.

### Confirm Products as American Airlines
You can also confirm the existence of the newly added Tickets by executing this GraphQL query from the GraphQL Explorer of the __AmericanNode__

#### Using GraphQL Explorer
You can view the newly added Tickets through the GraphQL Explorer view of the Vendia Share web app.

1. Open the GraphQL Explorer of the __AmericanNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents below into the GraphQL Editor
    ```graphql
    query listPartnerTickets {
      list_TicketItems {
        _TicketItems {
          ... on Self_Ticket_Partial_ {
            _id
            _owner
            ticketNumber
            airlineCode
            commissions {
              commissionType
              rate
              value {
                amount
                currency
                precision
              }
            }
            coupons {
              additionalServicesAttributeGroup
              baggage {
                allowance
                overAllowanceQualifier
                quantity
                rate {
                  amount
                  currency
                  precision
                }
              }
              classOfService
              conjunctionCompanionTicketIndicator
              couponNumber
              operatingAirlineDesignator
              remarks
              soldAirlineDesignator
              soldDestinationCityCode
              soldFlightDepartureDateTime
              soldFlightNumber
              soldOriginCityCode
              soldReservationBookingDesignator
              soldReservationStatusCode
              stopoverCode
              ticketDesignator
              ticketNumber
              ticketingDateOfIssue
              useIndicator
              value {
                amount
                currency
                precision
              }
            }
            dateOfIssue
            fees {
              code
              subCode
              value {
                amount
                currency
                precision
              }
            }
            passenger {
              dateOfBirth
              firstName
              frequentFlyerInformation {
                airlineCode
                frequentFlyerNumber
              }
              lastName
            }
            passengerNameRecordCode
            payments {
              paymentType
              paymentValue {
                amount
                currency
                precision
              }
            }
            prices {
              baseFareAmount {
                amount
                currency
                precision
              }
              equivalentFarePaid {
                amount
                currency
                precision
              }
            }
            taxes {
              code
              subCode
              value {
                amount
                currency
                precision
              }
            }
            ticketDocumentInfo {
              attributeGroup
              attributeSubGroup
              documentType
              endorsementRestriction
              fareBasis
              fareCalculationArea
              fareCalculationModeIndicator
              fareCalculationPricingIndicator
              internationalSaleIndicator
              primaryDocumentNumber
            }
            
            bookingAgentId
            remarks
          }
        }
      }
    }
    
    ```

1. Click the `>` button to submit the request to the __AmericanNode__
1. View the results.  Notice that most of fields from the prior mutations are populated, except for the `ticketDocumentInfo.fareBasis` and `ticketDocumentInfo.fareCalculationArea` fields.

#### Using Entity Explorer
You can view the newly added Tickets through the Entity Explorer view of the Vendia Share web app.

1. Select the `Entity Explorer` view of the __AmericanNode__
1. Click the `_id` field of one of the Ticket entries listed in the table
1. View the results.  Notice that most of fields from the prior mutations are populated, except for the `ticketDocumentInfo.fareBasis` and `ticketDocumentInfo.fareCalculationArea` fields.

#### Explanation
The ACL appended to the first ticket prevented that ticket from reaching the __AmericanNode__.  The ACL appended to the second ticket allowed it to reach the __AmericanNode__ but excluded the `fareBasis` and `fareCalculationArea` from being transmitted.

## Step 4 - Add Alaska Airlines to the Uni
Now imagine that American Airlines wants to onboard another [alliance partner](https://www.aa.com/i18n/aadvantage-program/miles/partners/partner-airlines.jsp), say Alaska Airlines.  

### Invite Alaska Airlines to the Uni
From the Share web app, navigate to the Uni details view for your Uni.  Click the `Invite participant` button and provide the email address associated with your Share account. Click the `Send uni invite` button to finalize the invitation.

### Accept the Invite as Alaska Airlines
Check your email for an invitation link to your Uni.  Complete the form provided:

1. Set `Node name` to `AlaskaNode`
1. Set `Cloud Service Provider` to `AWS`
1. Set `Node region` to `us-west-2 (Oregon)`
1. Set `Auth option` to `API Key`
1. Click the checkbox to acknowledge use of API Key
1. Click `Register Node`

Wait about 5 minutes for the new __AlaskaNode__ to join the existing Uni.

### Confirm Tickets as Alaska Airlines

#### Using GraphQL Explorer
You can attempt to view all previously added Tickets through the GraphQL Explorer view of the Vendia Share web app.

1. Open the GraphQL Explorer of the __AlaskaNode__
1. Remove all contents in the GraphQL Editor
1. Copy the contents below into the GraphQL Editor
    ```graphql
    query listPartnerTickets {
      list_TicketItems {
        _TicketItems {
          ... on Self_Ticket_Partial_ {
            _id
            _owner
            ticketNumber
            airlineCode
            commissions {
              commissionType
              rate
              value {
                amount
                currency
                precision
              }
            }
            coupons {
              additionalServicesAttributeGroup
              baggage {
                allowance
                overAllowanceQualifier
                quantity
                rate {
                  amount
                  currency
                  precision
                }
              }
              classOfService
              conjunctionCompanionTicketIndicator
              couponNumber
              operatingAirlineDesignator
              remarks
              soldAirlineDesignator
              soldDestinationCityCode
              soldFlightDepartureDateTime
              soldFlightNumber
              soldOriginCityCode
              soldReservationBookingDesignator
              soldReservationStatusCode
              stopoverCode
              ticketDesignator
              ticketNumber
              ticketingDateOfIssue
              useIndicator
              value {
                amount
                currency
                precision
              }
            }
            dateOfIssue
            fees {
              code
              subCode
              value {
                amount
                currency
                precision
              }
            }
            passenger {
              dateOfBirth
              firstName
              frequentFlyerInformation {
                airlineCode
                frequentFlyerNumber
              }
              lastName
            }
            passengerNameRecordCode
            payments {
              paymentType
              paymentValue {
                amount
                currency
                precision
              }
            }
            prices {
              baseFareAmount {
                amount
                currency
                precision
              }
              equivalentFarePaid {
                amount
                currency
                precision
              }
            }
            taxes {
              code
              subCode
              value {
                amount
                currency
                precision
              }
            }
            ticketDocumentInfo {
              attributeGroup
              attributeSubGroup
              documentType
              endorsementRestriction
              fareBasis
              fareCalculationArea
              fareCalculationModeIndicator
              fareCalculationPricingIndicator
              internationalSaleIndicator
              primaryDocumentNumber
            }
            
            bookingAgentId
            remarks
          }
        }
      }
    }
    
    ```

1. Click the `>` button to submit the request to the __AlaskaNode__
1. View the results.  Notice that none of the Tickets added from the __AmericanNode__ or __IberiaNode__ are visible to the __AlaskaNode__. 

#### Using Entity Explorer
You can also attempt to view the previously added Tickets through the Entity Explorer view of the Vendia Share web app.

1. Select the `Entity Explorer` view of the __AlaskaNode__
1. View the results.  Notice that none of the Tickets added from the __AmericanNode__ or __IberiaNode__ are visible to the __AlaskaNode__.

#### Explanation
The ACLs appended to the tickets created on the __AmericanNode__ and __IberiaNode__ prevent the __AlaskaNode__ from access.  This is done intentionally, allowing new participants to join a Uni but without sharing more data with them than intended.

## Demo Conclusion
Through these simple steps, you explored Vendia Share's GraphQL interface, fine-grained data access controls, and Uni invite flow.  

To explore more Share capabilities, please explore additional [demos](../../../demos).
