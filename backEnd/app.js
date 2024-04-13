// setting up stuff
var express = require("express");
var bodyParser = require("body-parser");
//var db = require("./db");

const dbRoutes = require("./dbActions.js");
const cors = require("cors");
const mongoose = require("mongoose");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // Allow this origin to access your server
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.static(process.cwd() + "/todo_list/build"));
app.use(dbRoutes);

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/todo_list/build/index.html");
});

// connection to local db
mongoose.connect("mongodb://localhost:27017/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || 3000, function () {
    console.log("port working");
  });
});

//establishing connection
// db.connect((err) => {
//   if (err) {
//     console.log("unable to connect");
//   } else {
//
//   }
// });
