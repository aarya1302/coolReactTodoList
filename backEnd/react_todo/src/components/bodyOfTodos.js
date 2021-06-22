import React, { useEffect, useState } from "react";
import { AddTask } from "./addTask";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

var server_address = "http://localhost:3000";

var handleDragEnd = (results) => {
  todosOfDay.todos.forEach((element) => {
    console.log(element);
    items.push(element);
  });

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
  <div id="bodyOfTodos" className="container editWinBigScreens">
    <div id="divOfTodos">
      <div id="pendingTodos" className="todosContainer container">
        <p className="section">
          <strong>To-do</strong>
        </p>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todosOnly">
            {(provided) => (
              <div
                className="todosOnly"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {arrayOfPendingTodos}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <AddTask clickFunc={handleAdd} />
      </div>

      <div className="container todosContainer">
        <div className="section">
          <strong>Done</strong>
          <button onClick={clearDone} className="btn custom_button">
            clear
          </button>
        </div>
        {arrayOfDoneTodos}
      </div>
    </div>
  </div>;
};
