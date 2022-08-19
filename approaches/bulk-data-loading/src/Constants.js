export const columns = [
    "name",
    "number",
    "quantity",
    "price",
    "lastUpdated"
];

export const inventoryRecordSize = 10000
export const maxInventoryChecks = 10
export const checkDelay = 60

export const filename = "../data/large-data-set.csv";

export const parseOptions = {
    delimiter: ",",
    from_line: 2,
    columns: columns,
    cast: true,
    cast_date: true
};

export const batchSize = 100;


