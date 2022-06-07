import calendar
from datetime import datetime, timedelta
import json
import os
import random
import sys
import time

import boto3
from faker import Faker


fake = Faker()

aws_region = os.getenv('AWS_REGION')

try:
    order_stream = sys.argv[1]
except:
    raise Exception(f'Please use the following syntax: {sys.argv[0]} kinesis_stream_name')

client = boto3.client('kinesis', region_name=aws_region)

def put_to_stream(order_date, consignee_name, consignee_address, consignee_city,
    consignee_state, consignee_postal_code, consignee_phone, consignee_email, purchase_order
):
    payload = {
                'orderDate': order_date,
                'consigneeName': consignee_name,
                'consigneeAddress': consignee_address,
                'consigneeCity': consignee_city,
                'consigneeState': consignee_state,
                'consigneePostalCode': consignee_postal_code,
                'consigneePhone': consignee_phone,
                'consigneeEmail': consignee_email,
                'purchaseOrder': purchase_order,
              }

    print(payload)

    put_response = client.put_record(
                        StreamName=order_stream,
                        Data=json.dumps(payload),
                        PartitionKey=purchase_order)

while True:
    states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", 
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ]

    order_date = fake.date_time_between(start_date=datetime.utcnow(), end_date='+3d').strftime('%Y-%m-%dT%H:%M:%SZ')
    consignee_name = fake.company()
    consignee_address = fake.street_address()
    consignee_city = fake.city()
    consignee_state = random.choice(states)
    consignee_postal_code = fake.postcode()
    consignee_phone = fake.phone_number()
    consignee_email = fake.company_email()
    purchase_order = fake.bothify(text='PO ????########')

    put_to_stream(order_date, consignee_name, consignee_address, consignee_city, consignee_state, consignee_postal_code, consignee_phone, consignee_email, purchase_order)

    time.sleep(5)
