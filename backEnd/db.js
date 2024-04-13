const { ObjectID } = require("bson");
const { setUncaughtExceptionCaptureCallback } = require("process");
const MongoClient = require("mongodb").MongoClient;
const MongoOptions = require("mongodb").MongoOptions;
require("dotenv").config({ path: ".env" });
let uri = process.env.MONGO_URI;
let dbname = "cluster0";

var state = {
  db: null,
};

var connect = (cb) => {
  if (state.db) cb();
  else {
    MongoClient.connect("mongodb+srv://aarya_bhorra:Ab1302lsd@cluster0.rkapb.mongodb.net/?retryWrites=true&w=majority", MongoOptions, (err, client) => {
      if (err) cb(err);
      else {
        state.db = client.db(dbname);
        cb();
      }
    });
  }
};

var getDB = () => {
  return state.db;
};

var getPrimaryKey = (_id) => {
  return ObjectID(_id);
};

module.exports = { getDB, connect, getPrimaryKey };
