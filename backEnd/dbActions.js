const express = require("express");
const router = express.Router();
const DailyTodo = require("./models/todoModel"); // Adjust path as necessary
const mongoose = require("mongoose");
// Clear all todos for the week
router.post("/clearWeek", async (req, res) => {
  try {
    await DailyTodo.updateMany({}, { $set: { todayTodos: [] } });
    res.status(200).send("Week cleared");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get todos for a specific day
router.get("/getTodos/:day", async (req, res) => {
  try {
    document = await DailyTodo.findOne({ day: req.params.day });

    if (!document) {
      document = await new DailyTodo({
        day: req.params.day,
        todayTodos: [],
      });
      document.save();

      await document.save();
    }
    res.json(document.todayTodos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new todo
router.post("/todoName/:day/:value", async (req, res) => {
  try {
    const result = await DailyTodo.updateOne(
      { day: req.params.day },
      {
        $push: {
          todayTodos: {
            _id: new mongoose.Types.ObjectId(),
            todoName: req.params.value,
            completionTime: 25,
            done: false,
            subTasks: [],
          },
        },
      },
      { upsert: true }
    );
    if (result.matchedCount === 0) {
      res.status(404).send("Day not found");
    } else {
      const updatedDocument = await DailyTodo.findOne({ day: req.params.day });
      console.log(updatedDocument);
      res.json(updatedDocument.todayTodos);
    }
  } catch (err) {
    console.log("console.log here unfor");
    res.status(500).json({ error: err.message });
  }
});

// Delete a specific todo
router.post("/delete/:day/:id", async (req, res) => {
  try {
    const result = await DailyTodo.updateOne(
      { day: req.params.day },
      { $pull: { todayTodos: { _id: req.params.id } } }
    );
    if (result.modifiedCount === 0) {
      res.status(404).send("Todo not found or day not found");
    } else {
      const updatedDocument = await DailyTodo.findOne({ day: req.params.day });
      res.json(updatedDocument.todayTodos);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Toggle the completion status of a todo
router.post("/done/:day/:id", async (req, res) => {
  try {
    const document = await DailyTodo.findOne({ day: req.params.day });
    if (!document) {
      return res.status(404).send("Day not found");
    }

    const todo = document.todayTodos.find(
      (todo) => todo._id.toString() === req.params.id
    );
    if (!todo) {
      return res.status(404).send("Todo not found");
    }

    todo.done = !todo.done;
    await document.save();

    res.json(document.todayTodos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear completed todos
router.post("/clear/:day", async (req, res) => {
  try {
    const result = await DailyTodo.updateOne(
      { day: req.params.day },
      { $pull: { todayTodos: { done: true } } }
    );
    if (result.modifiedCount === 0) {
      res.status(404).send("No completed todos or day not found");
    } else {
      const updatedDocument = await DailyTodo.findOne({ day: req.params.day });
      res.json(updatedDocument.todayTodos);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a subtask to a todo
router.post("/getSteps/:day/:id/:step", async (req, res) => {
  try {
    const step_name = req.params.step;
    console.log(step_name);
    const result = await DailyTodo.updateOne(
      { day: req.params.day, "todayTodos._id": req.params.id },
      {
        $push: {
          "todayTodos.$.subTasks": { todoName: step_name, done: false },
        },
      }
    );
    if (result.modifiedCount === 0) {
      res.status(404).send("Todo not found or day not found");
    } else {
      const document = await DailyTodo.findOne({ day: req.params.day });
      const todo = document.todayTodos.find(
        (todo) => todo._id.toString() === req.params.id
      );
      res.json(todo.subTasks);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific todo for editing
router.get("/getThisTodo/:day/:id", async (req, res) => {
  try {
    const document = await DailyTodo.findOne({ day: req.params.day });
    if (!document) {
      return res.status(404).send("Day not found");
    }

    const todo = document.todayTodos.find(
      (todo) => todo._id.toString() === req.params.id
    );
    if (!todo) {
      return res.status(404).send("Todo not found");
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rearrange todos
router.post("/rearrange/:day", async (req, res) => {
  try {
    const updatedDocument = await DailyTodo.findOneAndUpdate(
      { day: req.params.day },
      { $set: { todayTodos: req.body } },
      { new: true }
    );
    if (!updatedDocument) {
      res.status(404).send("Day not found");
    } else {
      res.json(updatedDocument.todayTodos);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle the done status of a subtask
router.post("/doneSub/:day/:id/:subName", async (req, res) => {
  try {
    const document = await DailyTodo.findOne({ day: req.params.day });
    if (!document) {
      return res.status(404).send("Day not found");
    }

    const todo = document.todayTodos.find(
      (todo) => todo._id.toString() === req.params.id
    );
    if (!todo) {
      return res.status(404).send("Todo not found");
    }

    const subTask = todo.subTasks.find(
      (sub) => sub.stepName === req.params.subName
    );
    if (!subTask) {
      return res.status(404).send("Subtask not found");
    }

    // Toggle the done status of the subtask
    subTask.done = !subTask.done;
    await document.save();

    res.json(todo.subTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
