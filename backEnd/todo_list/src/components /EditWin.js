import React from "react";
import $, { event } from "jquery";

var EditWin = ({ handleLessFunc, arrayOfSubs, addStep }) => {
  if ($(window).width() < 1000) {
    $("#bodyOfTodosEdit").removeClass("bodyOfTodosEditFlat");
    return (
      <div className="wrapper">
        <div className="overlay" />
        <div id="editDivPop" className="container">
          <button onClick={handleLessFunc} className="btn custom_button">
            hide
          </button>
          <div id="containerOfSubs" className="container">
            <div id="editTodoName">
              <input id="todoChange" />
            </div>
            {arrayOfSubs[0]}
            {arrayOfSubs[1]}
            <div className="inputStepDiv">
              <input
                id="stepAdd"
                placeholder="add step"
                onInput={() => {
                  $("#addSubButton").addClass("active");
                  console.log("hello");
                }}
              />
              ``
              <button id="addSubButton" onClick={addStep}>
                add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    $("#bodyOfTodosEdit").addClass("bodyOfTodosEditFlat");

    return (
      <div id="editDiv" className="container">
        <button onClick={handleLessFunc} className="btn custom_button">
          hide
        </button>
        <div id="containerOfSubs" className="container">
          <div id="editTodoName">
            <input id="todoChange" />
          </div>

          {arrayOfSubs[0]}
          {arrayOfSubs[1]}
          <div className="inputStepDiv">
            <input
              id="stepAdd"
              placeholder="add step"
              onInput={() => {
                $("#addSubButton").addClass("active");
                console.log("hello");
              }}
            />
            <button id="addSubButton" onClick={addStep}>
              add
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default EditWin;
