export const filename = "../data/large-data-set.csv";

export const inventoryRecordSize = 25000
export const batchSize = 100;
export const clientConcurrency = 25
export const maxInventoryChecks = 10
export const checkDelay = 60

export const columns = [
    "name",
    "number",
    "quantity",
    "price",
    "lastUpdated"
];

export const parseOptions = {
    delimiter: ",",
    from_line: 2,
    columns: columns,
    cast: true,
    cast_date: true
};





