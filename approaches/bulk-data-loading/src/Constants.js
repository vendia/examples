export const filename = "../data/large-data-set.csv";

export const inventoryRecordSize = 25000
export const batchSize = 100;
export const clientConcurrency = 64
export const maxInventoryChecks = 10
export const checkDelay = 60

export const columns = [
    "name",
    "identifier",
    "quantity",
    "price",
    "lastUpdated",
    "supplier.name",
    "supplier.identifier"
];

export const parseOptions = {
    delimiter: ",",
    from_line: 2,
    columns: columns,
    cast: true,
    cast_date: true,
    onRecord: (record, context) => {
        let updatedRecord = record;

        updatedRecord['supplier'] = {
            name: record['supplier.name'],
            identifier: record['supplier.identifier']
        }

        delete updatedRecord['supplier.name']
        delete updatedRecord['supplier.identifier']

        return updatedRecord
    }
};





