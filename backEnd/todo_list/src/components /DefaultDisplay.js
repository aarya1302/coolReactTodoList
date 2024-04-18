import React from "react";
import AddButton from "./AddButton";

var arrayOfDoneTodos = [];

var DefaultDisplay = ({
  arrayOfDays,
  handleAdd,
  clearDone,
  handleClearWeek,
  todos,
  handleDay,
  handleWeekResize,
  arrayOfPendingTodos,
  edit,
}) => {
  return (
    <div id="bodyOfTodos" className="container">
      <div id="divOfTodos" className="">
        <div className="" id="pendingTodos">
          <p className="section">
            <strong>To-do</strong>
          </p>
          <div className="todosOnly">{arrayOfPendingTodos}</div>

          <AddButton clickFunc={handleAdd} />
        </div>

        <div className="section">
          <strong>Done</strong>
          <button onClick={clearDone} className="btn custom_button">
            clear
          </button>
        </div>
        {todos.done}
      </div>
      <button onClick={handleClearWeek} className="btn clearWeek">
        Clear Week
      </button>
    </div>
  );
};

export default DefaultDisplay;
