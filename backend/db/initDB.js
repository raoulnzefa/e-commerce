const { MongoClient } = require("mongodb");
const fs = require("fs");
const { type } = require("os");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "ass2";

function rf2json(str) {
    let url = `./dataset_dev/${str}.json`;
    let rawData = fs.readFileSync(url);
    let parseJson = JSON.parse(rawData);
    return parseJson;
}
async function insert(col, value) {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    // col
    const collection = db.collection(col);
    collection.drop();
    // insert
    const insertResult = await collection.insertMany(value);
    return "done.";
}

async function update(col, query, update){
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);

    const collection = db.collection(col);
    const updateResult = await collection.updateMany(query, update);
}
async function index(col, query, options) {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    // col
    const collection = db.collection(col);
    // index
    const indexName = await collection.createIndex(query, options);
    return "done.";
}
var count = 0;
function main() {
    // phone
    let phonelist = "phonelisting";
    let phonelistJson = ((phonelistJson) => {
        for (const phoneItem of phonelistJson) {
            // phone image;
            // phone disabled;
            phoneItem.image = `dataset_dev/phone_default_images/${phoneItem.brand}.jpeg`;
            if (phoneItem.disabled == undefined && phoneItem.stock > 0)
                phoneItem.disabled = false;
            else phoneItem.disabled = true;
        }
        return phonelistJson;
    })(rf2json(phonelist));
    insert(phonelist, phonelistJson)
        .then((value) => {
            console.log(value);
            count++;
        })
        .catch(console.error);
    // user
    let userlist = "userlist";
    // let userlistJson = ((userlistJson) => {
    //     for (const userItem of userlistJson) {
    //         //delete userItem._id;
    //         userItem.disabled = false;
    //     }
    //     return userlistJson;
    // })(rf2json(userlist));

    update(userlist, {}, {$set:{disable:false}});
    // insert(userlist, userlistJson)
    //     .then((value) => {
    //         console.log(value);
    //         count++;
    //     })
    //     .catch(console.error);

    index(userlist, { email: 1 }, { unique: true })
        .then((value) => {
            console.log(value);
            count++;
        })
        .catch(console.error);
}
main();
var timer = setInterval(function () {
    if (count == 2) {
        console.log("done!");
        process.exit();
    }
}, 1000);
