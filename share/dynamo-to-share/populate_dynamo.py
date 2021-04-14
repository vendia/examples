import argparse
import os
import uuid

import boto3
from faker import Faker


fake = Faker()

inventory_table = os.getenv('INVENTORY_TABLE')
aws_region = os.getenv('AWS_REGION')

dynamodb = boto3.resource('dynamodb', region_name=aws_region)
table = dynamodb.Table(inventory_table)



if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Publish random products to dynamo-to-share Inventory table'
    )

    parser.add_argument(
        'count',
        type=int,
        help='Publish a specific count of products'
    )

    args = parser.parse_args()

    for invocation in range(args.count):
        item_name = f'{fake.word().title()} {fake.word().title()}'
        item_number = str(uuid.uuid4())
        quantity = fake.pydecimal(positive=True, left_digits=3, right_digits=0)
        unit_price = fake.pydecimal(positive=True, left_digits=3, right_digits=2)
        tags = [
            f'{fake.word()}',
            f'{fake.word()}',
            f'{fake.word()}'
        ]

        response = table.put_item(
            Item={
                'item_name': item_name,
                'item_number': item_number,
                'quantity': quantity,
                'unit_price': unit_price,
                'tags': tags
            }
        )
        print(response)


