# Milestone 4 - Vendia & GraphQL

In the previous section, we went over the basics of GraphQL in Vendia, covering how to query and how to add and modify data. In this section, we'll go a bit further, outlining how Vendia uses GraphQL to help you share data more effectively. We will be picking up where we left off in the Supplier and Distributor example, and cover how to think about Data Freshness and File Sharing.

## Caching and Data Freshness

Because data is first written to a Node by a contributor and only then shared with the other Nodes and the World State, there exist situations where the data you query may differ between Nodes. Vendia offers different modifiers to your query to differentiate between these cases.

Lets run a query in the Distributor Node GraphQL Explorer to illustrate this. Select the Rocky Road Ice Cream from the previous milestone, and run the following query with its ID. (Reminder: you can fetch the ID by using the Entity Explorer, or by running a query to match the name.)

```
query getIceCream {
  get_Product(id: [YOUR ID HERE], readMode: CACHED) {
    ... on Self_Product {
      name
      category
      description
    }
  }
}

```

In this query, we fetch the product info of the Rocky Road Ice Cream, with one change: We set our readMode to `CACHED`. 

The readMode allows us to read data from different sources of truth; while difficult to illustrate in a simple, two-Node Uni with a dozen transactions per day, there are cases where a Node may differ from the World State because the mutations need to propagate throughout the Node network. For this reason, Vendia allows you to define what your readmode is; what our source of truth is for this specific query. The different readmodes, and how they compare to each other, is included below. 

| Consistency Type | Dirty Reads | Operational Latency | Consistency Guarantees |
| ----------- | ----------- | ----------- | ----------- |
| `CACHED` | Likely | Fastest | Written to local cache on Node |
| `NODE_COMMITTED` | Possible | Fast | Written to Node World State |
| `NODE_LEDGERED` | No | Slow | Written to Uni World State and to original Node Ledger |
| `UNI_LEDGERED` | No | Slowest | Written to Uni World State and all Node Ledgers |

In this table, _"Dirty Reads"_ refers to reading from a Node's queue, before all of the other transactions (originating from the original Node, or any other with Write permissions) have been applied to the object. For this reason, these happen most often with `CACHED` changes, and are outright eliminated once the Node's World state has caught up with all outstanding changes in the `NODE_LEDGERED` state.

## Sharing Files

Vendia supports working with all the standard JSON Schema scalar types as well as formatting extensions for specialized string types. However, multi-media files such as images and videos, large data files such as machine learning training sets, and other objects cannot be easily represented as any of these scalar types, nor can they be cost effectively stored in a database - even a serverless and NoSQL database.

To address this, Vendia provides full, built-in support for working with these objects, known as "files". The files themselves are stored in the cloud service provider object storage service (Amazon S3 on AWS, e.g.), while metadata representing the object, including its provenance, is stored in the blockchain database. Despite the differences in storage technologies used, Vendia ensures that all data appears "on chain", including a full, consistent history, built in tamperproofing, and ownership tracking.

### __Uploading Files__

For this exercise, switch to the File Explorer (accessible the same way you access the GraphQL explorer) of the Supplier node. These are the steps to upload a new file:

- From the File Explorer of the SupplierNode
- Click on the + Upload file button in the upper-right of the All Files view
- Select the chips.pdf from the product_material folder
  - Copy strategy - Select Always
  - Read Access - Select All
  - Write Strategy - Select SupplierNode only
    - This prevents a Distributor from inadvertently updating the file
- Click on the Create button to upload the file
- Now repeat the steps above for the feta.pdf file from the product_material folder

Just like transactional data, a file is versioned and its full history is preserved on the Share ledger.

### __Associate Files with Products__
You can now reference the file path in the `promotionalContent` field of each product.

* From the `Entity Explorer` view of the **SupplierNode**
* Update the `Sheep's Milk Feta` product, setting `promotionalContent` to `feta.pdf`
* Update the `Blue Corn Tortillas Chips` product, setting `promotionalContent` to `chips.pdf`

The association made allows, for example, an application capable of displaying file content to retrieve both the product data and promotional file from the same Vendia Share GraphQL interface.

### __Adding Files Programmatically__

Files can also be added via a GraphQL mutation, though this requires multiple steps and an external AWS S3 Bucket. 

The first step is getting your Vendia Account Name, which can be found via executing the following query and extracing the `accountId` value.

```
query getNodeAccountInfo {
  getVendia_UniInfo {
    localNodeName
    name
    nodes {
      name
      vendiaAccount {
        accountId
        csp
      }
    }
  }
}
```

With the account ID in hand, copy the following into your IAM policy, noting your ID. The `/*` resource can be scoped to whatever directory of the bucket your media resides, such as `/media/photos`.

```
{
  "Version": "2012-10-17",
  "Id": "AllowVendiaToReadFiles",
  "Statement": [{
      "Sid": "AllowBucketInfoRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::[YOUR NODE ACCOUNT ID]:root"
      },
      "Action": [
        "s3:GetBucketLocation",
        "s3:GetBucketVersioning"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name-here"
    },
    {
      "Sid": "AllowObjectRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::[YOUR NODE ACCOUNT ID]:root"
      },
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name-here/*"
    }
  ]
}
```

Finally, with the bucket policy set up, you can run the following mutation to fetch photos from the bucket (and the scope) defined above. 

```
addVendia_File(
  input: {
    sourceBucket: <bucket>,
    sourceKey: <key>,
    sourceRegion: <region>,
    destinationKey: <key>,
    copyStrategy: <strategy>,
    read: [List of Nodes],
    write: [List of Nodes]
  },
  syncMode: ASYNC
) { transaction { _id } }
```

A more in-depth look at the File API and what the features and limits are can be found in the [Vendia Docs](https://www.vendia.com/docs/share/file-api), including how to set up directories inside of Vendia.

Onward to [Milestone 5](README-Milestone5.md), where we'll provide some advanced use cases and their corresponding API requests.
