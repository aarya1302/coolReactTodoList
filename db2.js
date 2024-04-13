const mongoose = require("mongoose");
const DailyTodo = require("./Todo"); // Assuming your model is saved in Todo.js

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/tododb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We're connected!");

  // Create a new daily todo list
  // const newDailyTodo = new DailyTodo({
  //   _id: new mongoose.Types.ObjectId(),
  //   day: "Tuesday",
  //   todayTodos: [
  //     {
  //       _id: new mongoose.Types.ObjectId(),
  //       todoName: "something else",
  //       completionTime: 25,
  //       done: false,
  //       subTasks: [],
  //     },
  //     {
  //       _id: new mongoose.Types.ObjectId(),
  //       todoName: "something here",
  //       completionTime: 25,
  //       done: false,
  //       subTasks: [
  //         {
  //           _id: new mongoose.Types.ObjectId(),
  //           todoName: "Subtask 1",
  //           completionTime: 15,
  //           done: false,
  //         },
  //       ],
  //     },
  //     {
  //       _id: new mongoose.Types.ObjectId(),
  //       todoName: "Interview Aarya",
  //       completionTime: 25,
  //       done: false,
  //     },
  //   ],
  // });

  // newDailyTodo
  //   .save()
  //   .then(() => {
  //     console.log("Daily Todo Saved Successfully!");
  //   })
  //   .catch((err) => {
  //     console.error("Error saving Daily Todo:", err);
  //   });
});
