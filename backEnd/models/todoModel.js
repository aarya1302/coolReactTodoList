const mongoose = require("mongoose");

// Define the schema for subtasks
const SubTaskSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  todoName: {
    type: String,
    required: true,
  },
  completionTime: {
    type: Number,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Define the schema for today's todos
const TodoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  todoName: {
    type: String,
    required: true,
  },
  completionTime: {
    type: Number,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  subTasks: [SubTaskSchema], // Array of subTasks
});

// Define the schema for daily todo list
const DailyTodoSchema = new mongoose.Schema({
  id: new mongoose.Schema.Types.ObjectId(),
  day: {
    type: String,
    required: true,
  },
  todayTodos: [TodoSchema],
});

// Create the model from the schema
const DailyTodo = mongoose.model("DailyTodo", DailyTodoSchema);

module.exports = DailyTodo;
