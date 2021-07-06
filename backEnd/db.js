
const { ObjectID } = require("bson");
const { setUncaughtExceptionCaptureCallback } = require("process");
const MongoClient = require('mongodb').MongoClient;
const MongoOptions = require('mongodb').MongoOptions;

let dbname = "cluster0";


var state = {
    db: null
}

var connect = (cb) =>{
    if(state.db)
        cb()
    else{
        MongoClient.connect(uri, MongoOptions, (err, client) => {
            if(err)
                cb(err)
            else{
                state.db = client.db(dbname);
                cb();
            }
        });
    
    }
}

var getDB = () =>{
    return state.db;
}

var getPrimaryKey = (_id) =>{
    return ObjectID(_id);
}
//console.log(getCollection());
/*client.connect(err => {
  const collection = client.db("cluster0").collection("todos");
  console.log(collection);
  // perform actions on the collection object
  client.close();
});*/

module.exports = {getDB, connect, getPrimaryKey}

