import fs from 'fs';
import { stringify } from 'csv-stringify';
import { faker } from '@faker-js/faker';
import {columns, filename, inventoryRecordSize} from './Constants.js'

export class CSVFileCreator {

    constructor() {
        this.stringifier = stringify({
            header: true,
            columns: columns,
            cast: {
                date: function (value) {
                    return value.toISOString();
                }
            }
        });
    }

    async createFile() {
        let writableStream = fs.createWriteStream(filename);
        for (let count = 0; count < inventoryRecordSize; count++) {
            console.log("Adding record ", count);

            this.stringifier.write({
                name: faker.commerce.productName(),
                number: faker.random.alphaNumeric(10),
                quantity: faker.random.numeric(5),
                price: faker.commerce.price(1, 999, 2),
                lastUpdated: faker.date.recent()
            })
        }

        this.stringifier.pipe(writableStream);

        console.log("File created");
    }

}
