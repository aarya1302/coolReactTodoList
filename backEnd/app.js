// setting up stuff
var express = require("express");
var bodyParser = require("body-parser");
var db = require("./db");

var cors = require("cors");
const { resolve, dirname } = require("path");
const { rejects } = require("assert");
const { SSL_OP_EPHEMERAL_RSA } = require("constants");
const path = require('path')
let collection_name = "todos";
var mime = require("mime-types");
const fs = require("fs");
const { ObjectID } = require("bson");
const { getPrimaryKey } = require("./db");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

var __dirname = "/Users/aarya/Desktop/dev/crud project/Todo_list/"

//sending of the present day
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.static(process.cwd() + "/react_todo/build"))
app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/react_todo/build/index.html")
})
app.post("/clearWeek", (req, res) => {
    db.getDB().collection(collection_name).updateMany({}, { $set: { todayTodos: [] } })
})
app.get("/getTodos/:day", function (req, res) {
    console.log("got message");

    db.getDB().collection(collection_name).findOne({ day: req.params.day }, (err, documents) => {
        if (err) {
            console.log(err)
        } else {
            console.log(documents);
            res.json(documents.todayTodos)
        }
    })
});

//updating data base
app.post("/todoName/:day/:value", (req, res) => {
    var todo_name = req.params.value;
    console.log("Got your todo: " + todo_name);
    const collection = db.getDB().collection(collection_name);
    collection.updateOne({ day: req.params.day }, { $push: { todayTodos: { _id: (ObjectID() + ""), todoName: todo_name, completionTime: 25, done: false, subTasks: [] } } }, (err, document) => {
        if (err) {
            console.log(err)
        } else {
            collection.findOne({ day: req.params.day }, (err, documents) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(documents.todayTodos)
                }
            })
        }
    })
})

//deleting todos
app.post("/delete/:day/:id", (req, res) => {
    console.log("got delete req")
    var id = req.params.id;
    const collection = db.getDB().collection(collection_name);
    collection.findOne({ day: req.params.day }, (err, documents) => {
        if (err) {
            console.log(err);
        } else {
            documents.todayTodos.find((element) => {

                if ((element._id + "") === id) {
                    collection.updateOne({ day: req.params.day }, { $pull: { todayTodos: { _id: id } } }, (err, doc) => {
                        if (err) {
                            console.log(err)
                        } else {
                            collection.findOne({ day: req.params.day }, (err, docs) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.json(docs.todayTodos);
                                }
                            })
                        }
                    });

                }
            })
        }
    })

})
app.post("/doneSub/:day/:id/:subName", function (req, res) {
    var collection = db.getDB().collection(collection_name);
    console.log("here")
    collection.findOne({ day: req.params.day }, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            docs.todayTodos.forEach(element => {

                if ((element._id + "") === req.params.id) {
                    element.subTasks.forEach(sub => {
                        if (sub.stepName === req.params.subName) {

                            var newVal = (sub.done) ? false : true;

                            collection.updateOne({ day: req.params.day }, { $set: { "todayTodos.$[elem].subTasks.$[subName].done": newVal } }, { arrayFilters: [{ "elem._id": req.params.id }, { "subName.stepName": req.params.subName }] },
                                (err, Docs) => {
                                    collection.findOne({ day: req.params.day }, (err, newDoc) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            newDoc.todayTodos.forEach(element => {
                                                if ((element._id + "") === req.params.id) {
                                                    console.log(element.subTasks)
                                                    res.json(element.subTasks);
                                                }
                                            })
                                        }
                                    })
                                });
                        }
                    })

                }
            })
        }
    })

})

app.post("/deleteSub/:day/:id/:subName", function (req, res) {
    var id = req.params.id;
    const collection = db.getDB().collection(collection_name);
    collection.findOne({ day: req.params.day }, (err, documents) => {
        if (err) {
            console.log(err);
        } else {
            documents.todayTodos.find((element) => {

                if ((element._id + "") === id) {
                    collection.updateOne({ day: req.params.day }, { $pull: { todayTodos: { _id: id } } }, (err, doc) => {
                        if (err) {
                            console.log(err)
                        } else {
                            collection.findOne({ day: req.params.day }, (err, docs) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.json(docs.todayTodos);
                                }
                            })
                        }
                    });

                }
            })
        }
    })


})
// done and notdone request handles
app.post("/done/:day/:id", (req, res) => {
    var collection = db.getDB().collection(collection_name);
    console.log("got done req")
    collection.findOne({ day: req.params.day }, (err, docs) => {
        if (err) {
            console.log(err);
        } else {

            docs.todayTodos.forEach(element => {
                if ((element._id + "") === req.params.id) {
                    var newVal = (element.done) ? false : true;
                    collection.updateOne({ day: req.params.day, todayTodos: { $elemMatch: { _id: req.params.id } } }, { $set: { "todayTodos.$.done": newVal } }, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            collection.findOne({ day: req.params.day }, (err, docs) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    res.json(docs.todayTodos)
                                }
                            })
                        }
                    });
                }
            })
        }
    })


    /* console.log("got done redfq")
    console.log(req.params.id)
    var id = req.params.id;
   
   collection.findOne({day:req.params.day}, (err,documents)=>{
       if(err){
           console.log(err);
       }else{
           documents.todayTodos.find((element)=>{
               if((element._id+"") === id){
                    
                    console.log(newVal);
                    collection.updateOne({todayTodos:{$elemMatch:{_id:id}}}, {$set:{"todayTodos.$.done":newVal}}, (err, doc)=>{
                        if(err){
                            console.log(err)
                        }else{
                            collection.findOne({day:req.params.day}, (err, docs)=>{
                                if(err){
                                    console.log(err);
                                }else{
                                    
                                    res.json(docs.todayTodos)
                                }
                            })
                        }
                    });
                    
               }
           })
       }
   })   */

})


//clearing done

app.post("/clear/:day", function (req, res) {
    console.log("got clear message");

    db.getDB().collection(collection_name).updateOne({ day: req.params.day }, { $pull: { todayTodos: { done: true } } }, (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            db.getDB().collection(collection_name).findOne({}, (err, document) => {
                if (err) {
                    console.log(err)
                } else {
                    res.json(document.todayTodos)
                }
            })
        }
    })
});

//rearrangeing todos
app.post("/rearrange/:day", function (req, res) {
    db.getDB().collection(collection_name).updateOne({ day: req.params.day }, { $set: { todayTodos: req.body } })
    db.getDB().collection(collection_name).findOne({ day: req.params.day }, (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            res.json(doc.todayTodos)
        }
    })
})
//addStep 
app.post("/getSteps/:day/:id/:step", function (req, res) {
    var step_name = req.params.step;
    console.log("Got your todo: " + req.params.step);
    console.log(req.params.day, req.params.id)
    const collection = db.getDB().collection(collection_name);
    collection.updateOne({ day: req.params.day, todayTodos: { $elemMatch: { _id: req.params.id } } }, { $push: { "todayTodos.$.subTasks": { "stepName": step_name, done: false } } },
        (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                collection.findOne({ day: req.params.day }, (err, docs) => {
                    console.log(docs.todayTodos)
                    docs.todayTodos.forEach(element => {
                        if ((element._id + "") === req.params.id) {
                            console.log(element.subTasks)
                            res.json(element.subTasks);
                        }
                    })
                })
            }
        })
})
//send todo for edit
app.get("/getThisTodo/:day/:id", function (req, res) {
    console.log("get req for edit todo")
    db.getDB().collection(collection_name).findOne({ day: req.params.day }, function (err, docs) {
        if (err) {
            console.log(err)
        } else {

            docs.todayTodos.forEach(element => {
                console.log(req.params.id)
                if ((element._id + "") === req.params.id) {
                    res.json(element)
                }
            })
        }
    });
})
//establishing connection
db.connect((err) => {
    if (err) {
        console.log("unable to connect");
    } else {
        app.listen(process.env.PORT || 3000, function () {
            console.log("port working");
        })
    }
})
