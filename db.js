
var mongodb = require('mongodb')
var lastMsg = [];
module.exports.lastMessage = lastMsg;
const connectionString = "mongodb://localhost:27017/chat";
let db;
//let result;

async function DbConnection() {
    await mongodb.MongoClient.connect(connectionString, (err, client) => {
        if (err) {
            return console.log(`connection error is: ${err}`)
        }
        console.log(`connected to mongoDb server`)
        db = client.db('chat')
    })
}
///// FIND and Update /////
async function FindUser(data) {
    let result = await db.collection("user").findOne({ user: data.username });
    console.log(JSON.stringify(result))
    if (result == null) {
        db.collection("user").insertOne({
            user: data.username,
            text: [data.message]
        })
    }
    else {
        if (result.text[9] != null) {
            await db.collection("user").update({ "user": data.username }, { $pop: { "text": -1 } })

        }
        await db.collection("user").update({ "user": data.username }, { $push: { "text": data.message } })

    }
}
////// show last 10 msg ///////
async function finalMsg(data) {
    let result = await db.collection("user").findOne({ user: data });
    return result.text;
    result.text.forEach(element => {
        console.log(`${element}`);
    });
}

module.exports = {
    DbConnection,
    FindUser,
    finalMsg
}

