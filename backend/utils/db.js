const { MongoClient, ObjectId } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "ass2";

async function find(
    colName,
    query = {},
    options = {},
    sort = { _id: 1 },
    limit = 0,
    skip = 0
) {
    const db = client.db(dbName);
    const collection = db.collection(colName);
    try {
        if (query._id) {
            query._id = ObjectId(query._id);
        }
    } catch (error) {
        throw "_Id error";
    }

    let result;
    if (limit == 0) {
        result = await collection
            .find(query, options)
            .sort(sort)
            .skip(skip)
            .toArray();
    } else {
        result = await collection
            .find(query, options)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .toArray();
    }
    console.log("Found documents =>", result);

    return result;
}

async function update(colName, query, updateContent, updateOptions = {}) {
    const db = client.db(dbName);
    const collection = db.collection(colName);
    if (query._id) {
        query._id = ObjectId(query._id);
    }
    let result;
    if (updateOptions.length != {}) {
        result = await collection.updateOne(query, {
            $set: updateContent
        },updateOptions);
    } else {
        result = await collection.updateOne(query, {
            $set: updateContent,
        });
    }

    console.log("Updated =>", result);

    return result;
}
async function updateComment(colName, query, updateContent) {
    const db = client.db(dbName);
    const collection = db.collection(colName);
    if (query._id) {
        query._id = ObjectId(query._id);
    }
    let result;
    result = await collection.updateOne(query, updateContent);
    console.log("Updated =>", result);
    return result;
}
async function findAndModify(colName, query, updateContent) {
    const db = client.db(dbName);
    const collection = db.collection(colName);
    if (query._id) {
        query._id = ObjectId(query._id);
    }
    const result = await db.command({
        findAndModify: colName,
        query: query,
        update: { $set: updateContent },
    });
    console.log("Updated =>", result);

    return result;
}
async function findbest(){
    const db = client.db(dbName);
    const collection = db.collection("phonelisting");
    let result = await collection.aggregate([
        {$match: {'reviews.1':{"$exists": true},'disabled':false}},
        {$unwind: { path:"$reviews"}},
        {$group: {
            _id: "$_id",
            "avgrating": {
              $avg: "$reviews.rating"
            }
        }},
        {$sort: {avgrating : -1}},
        {$limit : 5},
        {$lookup: {
            from: 'phonelisting',
            localField: '_id',
            foreignField: '_id',
            as: 'data'
        }},
    ]).toArray();
    for await(const doc of result){
        console.log(doc);
    }
    return result;
}
async function insert(colName, insertContent) {
    const db = client.db(dbName);
    const collection = db.collection(colName);

    const result = await collection.insertMany([insertContent]);
    console.log("Inserted result =>", result);

    return result;
}
async function deleteItem(colName, deleteQuery) {
    const db = client.db(dbName);
    const collection = db.collection(colName);

    if (deleteQuery._id) {
        deleteQuery._id = ObjectId(deleteQuery._id);
    }

    const result = await collection.deleteMany(deleteQuery);
    console.log("Deleted documents =>", result);

    return result;
}

async function getBrand() {
    const db = client.db(dbName);
    const collection = db.collection("phonelisting");

    result = await collection.distinct("brand");
    console.log("getBrand documents =>", result);

    return result;
}

module.exports = {
    find,
    findbest,
    update,
    updateComment,
    findAndModify,
    insert,
    deleteItem,
    getBrand,
    client,
};
