from datetime import datetime, timedelta
import json
import random
import time

from bson import json_util
from kafka import KafkaProducer
from faker import Faker


fake = Faker()

producer = KafkaProducer(bootstrap_servers='localhost:9092')

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
    producer.send('orders', json.dumps(payload, default=json_util.default).encode('utf-8'))

    time.sleep(5)
