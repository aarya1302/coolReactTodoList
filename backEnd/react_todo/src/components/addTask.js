import React, { Component, useEffect, useRef, useState } from "react";
var server_address = "http://localhost:3001";
export const AddTask = (props) => {
  var [status, setStatus] = useState(false);

  if (status) {
    return (
      <div id="inputNewTodoDiv">
        <input id="input_todo_name" type="text" placeholder="Add Todo" />

        <button id="confirm_task" className="btn " onClick={props.clickFunc}>
          Add Task
        </button>
        <button
          id="cancel"
          className="btn custom_button"
          onClick={() => setStatus(false)}
        >
          Cancel
        </button>
      </div>
    );
  } else {
    return (
      <button id="addButton" className="btn" onClick={() => setStatus(true)}>
        <span>+</span>Add Task
      </button>
    );
  }
};
