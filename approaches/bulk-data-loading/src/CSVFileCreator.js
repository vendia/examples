import fs from 'fs';
import { stringify } from 'csv-stringify';
import { faker } from '@faker-js/faker';
import {columns, inventoryRecordSize} from './Constants.js'


const filename = "../data/large-data-set.csv";
const writableStream = fs.createWriteStream(filename);

const stringifier = stringify({
    header: true,
    columns: columns,
    cast: {
        date: function (value) {
            return value.toISOString();
        }
    }
});

for (let count = 0; count < inventoryRecordSize; count++) {
    console.log("Adding record ", count);

    stringifier.write({
        name: faker.commerce.productName(),
        number: faker.random.alphaNumeric(10),
        quantity: faker.random.numeric(5),
        price: faker.commerce.price(1, 999, 2),
        lastUpdated: faker.date.recent()
    })
}

stringifier.pipe(writableStream);

console.log("File is complete");
