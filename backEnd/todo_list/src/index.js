import React, { Component, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import $, { event } from "jquery";
import axios from "axios";

import DefaultDisplay from "./components /DefaultDisplay";
import AddButton from "./components /AddButton";
import EditWin from "./components /EditWin";
//function for
var server_address = "http://localhost:3000";

// edit window for subtasks

//getting the day
var toDate = new Date();
var daysArray = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
var today = "saturday";
console.log("this is today : " + today);
console.log("this is toDate : " + toDate.getDay());

// component to get the todos
var GetTodos = (props) => {
  var daysFormat = {
    long: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    med: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    short: ["M", "T", "W", "T", "F", "S", "S"],
  };

  // hooks
  const [todosOfDay, setTodos] = useState({ todos: [] });
  const [date, setDate] = useState(today);
  const [edit, setEdit] = useState({
    state: false,
    id: null,
    subTasks: [],
    day: null,
    todoName: "",
  });

  var [width, setWidth] = useState($(window).width());

  const items = [];

  // removing the editwindow
  var handleLess = () => {
    setEdit({ state: false, id: null, subTasks: [], day: null });
  };

  // clearing dones
  function clearDone() {
    let req = new XMLHttpRequest();
    req.open("POST", server_address + "/clear/" + date, true);
    req.send();
    req.onload = () => {
      setTodos({ todos: JSON.parse(req.responseText) });
    };
  }
  //function for addin new todos
  function handleAdd() {
    let req = new XMLHttpRequest();
    let input = document.getElementById("input_todo_name").value;

    req.open("POST", server_address + "/todoName/" + date + "/" + input, true);
    req.send();
    req.onload = () => {
      document.getElementById("input_todo_name").value = "";
      setTodos({ todos: JSON.parse(req.responseText) });
    };
  }

  // Function to send the delete request
  function deleteDoneReq(id, reqId) {
    let req = new XMLHttpRequest();
    req.open("POST", server_address + "/" + reqId + date + "/" + id, true);
    req.send();
    req.onload = () => {
      setTodos({ todos: JSON.parse(req.responseText) });
    };
  }
  //function handle edit
  var todoNameEdit;

  function handleEdit(id, day) {
    var req = new XMLHttpRequest();
    if (edit.state && id === edit.id) {
      setEdit({ state: false, id: null, day: null, todoName: "" });
    } else if (edit.state && id !== edit.id) {
      req.open("GET", server_address + "/getThisTodo/" + day + "/" + id, true);
      req.send();

      req.onload = () => {
        var json = JSON.parse(req.responseText);
        todoNameEdit = json.todoName;

        setEdit({
          state: true,
          id: id,
          day: day,
          subTasks: json.subTasks,
          todoName: todoNameEdit,
        });

        document.getElementById("todoChange").value = json.todoName;
      };
    } else {
      req.open("GET", server_address + "/getThisTodo/" + day + "/" + id, true);
      req.send();
      req.onload = () => {
        var json = JSON.parse(req.responseText);
        todoNameEdit = json.todoName;
        setEdit({
          state: true,
          id: id,
          day: day,
          subTasks: json.subTasks,
          todoName: todoNameEdit,
        });
        document.getElementById("todoChange").value = json.todoName;
      };
      setEdit({ state: true, id: id, day: day });
    }
  }

  //Function to change order
  function handleDay(theDay) {
    document.getElementById(date).classList.remove("current");
    document.getElementById(theDay).classList.add("current");

    setDate(theDay);

    let req = new XMLHttpRequest();

    req.open("GET", server_address + "/getTodos/" + theDay, true);
    req.send();
    req.onload = () => {
      setEdit({ state: false, id: null, subTasks: [], day: null });
      setTodos({ todos: JSON.parse(req.responseText) });
    };
  }

  var handleSubAdd = () => {
    var stepName = document.getElementById("stepAdd").value;
    var req = new XMLHttpRequest();
    req.open(
      "POST",
      server_address + "/getSteps/" + edit.day + "/" + edit.id + "/" + stepName,
      true
    );
    req.send();
    req.onload = () => {
      setEdit({
        subTasks: JSON.parse(req.responseText),
        day: edit.day,
        id: edit.id,
        state: true,
        todoName: edit.todoName,
      });
      document.getElementById("stepAdd").value = "";
    };
  };

  var deleteDoneReqSub = (reqName, subName, todoID) => {
    console.log("work");
    let req = new XMLHttpRequest();
    req.open(
      "POST",
      server_address + "/" + reqName + date + "/" + todoID + "/" + subName,
      true
    );
    req.send();
    req.onload = () => {
      console.log(req.responseText);
      setEdit({
        state: true,
        id: todoID,
        subTasks: JSON.parse(req.responseText),
        todoName: edit.todoName,
        day: edit.day,
      });
    };
  };

  var arrayOfDays = [];

  //Getting the first todos
  let req = new XMLHttpRequest();
  req.open("GET", server_address + "/getTodos/" + date, true);

  // useEffect
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // Ensure you remove the event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(
    function onUpdate() {
      window.addEventListener("resize", () => {
        setWidth($(window).width());
      });

      $("#" + today).addClass("current");

      req.send();
      var json;
      req.onload = () => {
        json = JSON.parse(req.responseText);

        setTodos({ todos: json });
      };
    },
    [props.myProps]
  );

  var arrayOfSubTasksEditNotDone = [];
  var arrayOfSubTasksEditDone = [];

  if (edit.subTasks) {
    edit.subTasks.forEach((element) => {
      if (element.done) {
        arrayOfSubTasksEditDone.push(
          <div
            className="subTask done"
            onClick={() =>
              deleteDoneReqSub("doneSub/", element.stepName, edit.id)
            }
          >
            <p className="stepName">
              <s>{element.stepName}</s>
            </p>
          </div>
        );
      } else {
        arrayOfSubTasksEditNotDone.push(
          <div className="subTask">
            <input
              type="checkbox"
              onClick={() =>
                deleteDoneReqSub("doneSub/", element.stepName, edit.id)
              }
            ></input>
            <p className="stepName">{element.stepName}</p>
          </div>
        );
      }
    });
  }
  var handleClearWeek = () => {
    var req = new XMLHttpRequest();
    req.open("POST", server_address + "/clearWeek", true);
    req.send();
    setTodos({ todos: [] });
  };

  var info = {
    address: server_address,
    date: date,
    todos: todosOfDay.todoss,
  };

  var arrayOfDoneTodos = [];
  var arrayOfPendingTodos = todosOfDay.todos.map((doc) => {
    if (doc.done) {
      arrayOfDoneTodos.push(
        <div className="todo_div done " id={doc._id}>
          <button className="btn">
            <s onClick={() => deleteDoneReq(doc._id, "done/")}>
              {" "}
              {doc.todoName}
            </s>
          </button>
          <button
            className="btn delete_button"
            onClick={() => {
              deleteDoneReq(doc._id, "delete/");
            }}
          >
            <img
              src="data:image/png;base64,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"
              className="icon"
            ></img>
          </button>
        </div>
      );
    } else {
      return (
        <div className="todo_div" id={doc._id}>
          <input
            className="check"
            type="checkbox"
            onClick={() => {
              deleteDoneReq(doc._id, "done/");
            }}
          />{" "}
          <div onClick={() => handleEdit(doc._id, date)}>{doc.todoName}</div>
          <button
            className="btn delete_button"
            onClick={() => {
              deleteDoneReq(doc._id, "delete/");
            }}
          >
            <img
              alt="del"
              src="data:image/png;base64,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"
              className="icon"
            ></img>
          </button>
        </div>
      );
    }
  });

  var todos = { pending: arrayOfPendingTodos, done: arrayOfDoneTodos };

  console.log("this is todos of day " + todosOfDay);
  console.log("this is the date" + date);

  var handleWeekResize = () => {
    if (document.getElementById("todoChange")) {
      document.getElementById("todoChange").value = edit.todoName;
    }
    if ($(window).width() <= 700 && $(window).width() > 500) {
      var count = 0;
      daysArray.forEach((element) => {
        arrayOfDays.push(
          <div
            class="day"
            id={element}
            onClick={() => {
              handleDay(element);
            }}
          >
            {daysFormat.med[count]}
          </div>
        );
        count++;
      });
    } else if ($(window).width() <= 500) {
      var count = 0;
      daysArray.forEach((element) => {
        arrayOfDays.push(
          <div
            class="day"
            id={element}
            onClick={() => {
              handleDay(element);
            }}
          >
            {daysFormat.short[count]}
          </div>
        );
        count++;
      });
    } else {
      var count = 0;
      daysArray.forEach((element) => {
        arrayOfDays.push(
          <div
            class="day"
            id={element}
            onClick={() => {
              handleDay(element);
            }}
          >
            {daysFormat.long[count]}
          </div>
        );
        count++;
      });
    }
  };

  handleWeekResize();

  return (
    <div>
      <div className="daysOfWeek">{arrayOfDays}</div>
      <div className={edit.state ? "containerEdit" : "containerNoEdit"}>
        <DefaultDisplay
          arrayOfDays={arrayOfDays}
          handleAdd={handleAdd}
          clearDone={clearDone}
          handleClearWeek={handleClearWeek}
          todos={todos}
          handleDay={handleDay}
          handleWeekResize={handleWeekResize}
          arrayOfPendingTodos={arrayOfPendingTodos}
          edit={edit.state}
        />
        {edit.state ? (
          <EditWin
            arrayOfSubs={[arrayOfSubTasksEditNotDone, arrayOfSubTasksEditDone]}
            addStep={handleSubAdd}
            handleLessFunc={handleLess}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
//rendering Todos
class DisplayingDateTodos extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main">
        <GetTodos />
      </div>
    );
  }
}

ReactDOM.render(<DisplayingDateTodos />, document.getElementById("root"));
