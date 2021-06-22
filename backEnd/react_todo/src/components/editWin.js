import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import $, { event } from "jquery";

export const EditWin = (props) => {
  console.log(props.arrayOfSubs);
  if ($(window).width() < 1000) {
    $("#bodyOfTodosEdit").removeClass("editWinBigScreens");
    return (
      <div className="wrapper">
        <div className="overlay" />
        <div id="editDivPop" className="container">
          <button
            onClick={props.removeEditWinFunc}
            className="btn custom_button"
          >
            hide
          </button>
          <div id="containerOfSubs" className="container">
            <div id="editTodoName">
              <input id="todoChange" />
            </div>
            {props.arrayOfSubs[0]}
            {props.arrayOfSubs[1]}
            <div className="inputStepDiv">
              <input
                id="stepAdd"
                placeholder="add step"
                onInput={() => {
                  $("#addSubButton").addClass("active");
                  console.log("hello");
                }}
              />
              <button id="addSubButton" onClick={props.addStep}>
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
        <button onClick={props.removeEditWinFunc} className="btn custom_button">
          hide
        </button>
        <div id="containerOfSubs" className="container">
          <div id="editTodoName">
            <input id="todoChange" />
          </div>

          {props.arrayOfSubs[0]}
          {props.arrayOfSubs[1]}
          <div className="inputStepDiv">
            <input
              id="stepAdd"
              placeholder="add step"
              onInput={() => {
                $("#addSubButton").addClass("active");
                console.log("hello");
              }}
            />
            <button id="addSubButton" onClick={props.addStep}>
              add
            </button>
          </div>
        </div>
      </div>
    );
  }
};
