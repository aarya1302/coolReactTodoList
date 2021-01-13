import { TransitionGroup } from 'react-transition-group'; // ES6

import React, { Component, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import $, { event } from "jquery"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { set } from 'mongoose';
//function for 
var server_address = "https://weektodolist.herokuapp.com"
var arrayOfDays = [];
// Adding todos at the start of page 
var AddButton = (props) => {
  var [status, setStatus] = useState(false)

  if (status) {
    return (
      <div id="inputNewTodoDiv">
        <input id="input_todo_name" type="text" placeholder="Add Todo" />

        <button id="confirm_task" className="btn " onClick={props.clickFunc} >Add Task</button>
        <button id="cancel" className="btn custom_button" onClick={() => setStatus(false)} >Cancel</button>
      </div>
    )
  } else {
    return (
      <button id="addButton" className="btn" onClick={() => setStatus(true)} ><span>+</span>Add Task</button>
    )
  }
}
var EditWin = (props) => {
  console.log(props.arrayOfSubs)
  if ($(window).width() < 1000) {
    $("#bodyOfTodosEdit").removeClass("bodyOfTodosEditFlat");
    return (

      <div className="wrapper" >
        <div className="overlay" />
        <div id="editDivPop" className="container" >
          <button onClick={props.handleLessFunc} className="btn custom_button">hide</button>
          <div id="containerOfSubs" className="container">
            <div id="editTodoName"><input id="todoChange" /></div>
            {props.arrayOfSubs[0]}
            {props.arrayOfSubs[1]}
            <div className="inputStepDiv"><input id="stepAdd" placeholder="add step" onInput={() => { $("#addSubButton").addClass("active"); console.log("hello") }} /><button id="addSubButton" onClick={props.addStep}>add</button></div>

          </div>

        </div>
      </div>)
  } else {
    $("#bodyOfTodosEdit").addClass("bodyOfTodosEditFlat")

    return (
      <div id="editDiv" className="container">
        <button onClick={props.handleLessFunc} className="btn custom_button">hide</button>
        <div id="containerOfSubs" className="container">
          <div id="editTodoName"><input id="todoChange" /></div>

          {props.arrayOfSubs[0]}
          {props.arrayOfSubs[1]}
          <div className="inputStepDiv"><input id="stepAdd" placeholder="add step" onInput={() => { $("#addSubButton").addClass("active"); console.log("hello") }} /><button id="addSubButton" onClick={props.addStep}>add</button></div>
        </div>

      </div>
    )
  }
}

var toDate = new Date()
var daysArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
var today = daysArray[toDate.getDay() - 1]



var GetTodos = (props) => {
  var daysFormat = {
    long: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    med: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    short: ["M", "T", "W", "T", "F", "S", "S"]
  }
  const [todosOfDay, setTodos] = useState({ todos: [] })
  const [date, setDate] = useState(today)
  const [edit, setEdit] = useState({ state: false, id: null, subTasks: [], day: null, todoName: "" })
  var [width, setWidth] = useState($(window).width());


  const items = [];
  //function for draggin todos

  var handleLess = () => {
    setEdit({ state: false, id: null, subTasks: [], day: null })
  }
  var handleDragEnd = (results) => {
    todosOfDay.todos.forEach(element => { console.log(element); items.push(element) });
    const [reorderedItem] = items.splice(results.source.index, 1);
    items.splice(results.destination.index, 0, reorderedItem);
    console.log(typeof (items[0]._id))
    let req = new XMLHttpRequest();
    req.open("POST", server_address + "/rearrange/" + date, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(items));
    setTodos({ todos: items })

  }
  function clearDone() {
    let req = new XMLHttpRequest();
    req.open("POST", server_address + "/clear/" + date, true);
    req.send();
    req.onload = () => {
      setTodos({ todos: JSON.parse(req.responseText) });

    }
  }
  //function for addin new todos
  function handleAdd() {
    let req = new XMLHttpRequest();
    let input = document.getElementById("input_todo_name").value

    req.open("POST", server_address + "/todoName/" + date + "/" + input, true);
    req.send();
    req.onload = () => {
      document.getElementById("input_todo_name").value = ""
      setTodos({ todos: JSON.parse(req.responseText) });

    }
  }
  // Function to send the delete request
  function deleteDoneReq(id, reqId) {

    let req = new XMLHttpRequest();
    req.open("POST", server_address + "/" + reqId + date + "/" + id, true);
    req.send()
    req.onload = () => {
      setTodos({ todos: JSON.parse(req.responseText) });
    }
  }
  //function handle edit
  var todoNameEdit;
  function handleEdit(id, day) {
    var req = new XMLHttpRequest();
    if (edit.state && (id === edit.id)) {

      console.log("this is edit", edit)

      setEdit({ state: false, id: null, day: null, todoName: "" })
    }
    else if (edit.state && id !== edit.id) {
      req.open("GET", server_address + "/getThisTodo/" + day + "/" + id, true);
      req.send()

      req.onload = () => {
        var json = JSON.parse(req.responseText);
        todoNameEdit = json.todoName;

        setEdit({ state: true, id: id, day: day, subTasks: json.subTasks, todoName: todoNameEdit });

        document.getElementById("todoChange").value = json.todoName;
      }
    } else {
      req.open("GET", server_address + "/getThisTodo/" + day + "/" + id, true);
      req.send()
      req.onload = () => {

        var json = JSON.parse(req.responseText);
        todoNameEdit = json.todoName;
        setEdit({ state: true, id: id, day: day, subTasks: json.subTasks, todoName: todoNameEdit });
        document.getElementById("todoChange").value = json.todoName;
      }
      setEdit({ state: true, id: id, day: day });
    }


  } console.log($(window).width())
  //Function to change order 
  function handleDay(theDay) {
    console.log(theDay)
    document.getElementById(date).classList.remove("current")
    document.getElementById(theDay).classList.add("current")
    setDate(theDay)
    let req = new XMLHttpRequest();
    req.open("GET", server_address + "/getTodos/" + theDay, true);
    req.send();
    console.log(theDay)
    req.onload = () => {
      setEdit({ state: false, id: null, subTasks: [], day: null })
      setTodos({ todos: JSON.parse(req.responseText) });
    }
  }
  var handleSubAdd = () => {
    var stepName = document.getElementById("stepAdd").value;
    var req = new XMLHttpRequest()
    req.open("POST", server_address + "/getSteps/" + edit.day + "/" + edit.id + "/" + stepName, true)
    req.send()
    req.onload = () => {
      setEdit({ subTasks: JSON.parse(req.responseText), day: edit.day, id: edit.id, state: true, todoName: edit.todoName });
      document.getElementById("stepAdd").value = "";
    }
  }
  var deleteDoneReqSub = (reqName, subName, todoID) => {
    console.log("work")
    let req = new XMLHttpRequest();
    req.open("POST", server_address + "/" + reqName + date + "/" + todoID + "/" + subName, true);
    req.send()
    req.onload = () => {
      console.log(req.responseText);
      setEdit({ state: true, id: todoID, subTasks: JSON.parse(req.responseText), todoName: edit.todoName, day: edit.day })
    }
  }
  var arrayOfDays = [];
  //adding and rendering stuff on Mount 
  let req = new XMLHttpRequest;
  req.open("GET", server_address + "/getTodos/" + date, true)
  useEffect(function onUpdate() {

    window.addEventListener("resize", () => {
      setWidth($(window).width())

    })
    if (edit.state) {
      console.log("here")
      console.log(document.getElementById("todoChange"))
    }
    $("#" + today).addClass("current")

    req.send()
    var json;
    req.onload = () => {
      json = JSON.parse(req.responseText);
      setTodos({ todos: json });
    }
  }, [props.myProps])


  var arrayOfSubTasksEditNotDone = [];
  var arrayOfSubTasksEditDone = [];
  if (edit.subTasks) {
    edit.subTasks.forEach(element => {
      if (element.done) {
        arrayOfSubTasksEditDone.push(<div className="subTask done" onClick={() => deleteDoneReqSub("doneSub/", element.stepName, edit.id)}><p className="stepName"><s>{element.stepName}</s></p></div>)
      } else {
        arrayOfSubTasksEditNotDone.push(<div className="subTask" ><input type="checkbox" onClick={() => deleteDoneReqSub("doneSub/", element.stepName, edit.id)}></input><p className="stepName">{element.stepName}</p></div>)
      }
    })
  }
  var arrayOfDoneTodos = [];
  var arrayOfPendingTodos = todosOfDay.todos.map((doc) => {
    if (doc.done) {

      arrayOfDoneTodos.push(<div className="todo_div done " id={doc._id} >
        <button className="btn"><s onClick={() => deleteDoneReq(doc._id, "done/")}> {doc.todoName}</s></button>
        <button className="btn delete_button" onClick={() => {
          deleteDoneReq(doc._id, "delete/");
        }}><img src="data:image/png;base64,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" className="icon"></img></button>
      </div>);


    } else {

      return (

        <Draggable key={doc._id} draggableId={doc._id} index={todosOfDay.todos.indexOf(doc)}>
          {(provided) => (
            <div className="todo_div" id={doc._id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

              <input className="check" type="checkbox" onClick={() => {
                deleteDoneReq(doc._id, "done/")
              }
              } />  <div onClick={() => handleEdit(doc._id, date)} >{doc.todoName}</div>
              <button className="btn delete_button" onClick={() => {
                deleteDoneReq(doc._id, "delete/");
              }}><img alt="del" src="data:image/png;base64,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" className="icon"></img></button>
            </div>
          )}
        </Draggable>

      )
    }
  }

  )
  var handleClearWeek = () => {
    var req = new XMLHttpRequest;
    req.open("POST", server_address + "/clearWeek", true);
    req.send();
    setTodos({ todos: [] })
  }

  var handleWeekResize = () => {
    if (document.getElementById("todoChange")) {
      document.getElementById("todoChange").value = edit.todoName
    }
    if ($(window).width() <= 700 && $(window).width() > 500) {

      var count = 0
      daysArray.forEach(element => {
        arrayOfDays.push(<div class="day" id={element} onClick={() => { handleDay(element) }}>{daysFormat.med[count]}</div>)
        count++
      });
    } else if ($(window).width() <= 500) {

      var count = 0
      daysArray.forEach(element => {
        arrayOfDays.push(<div class="day" id={element} onClick={() => { handleDay(element) }}>{daysFormat.short[count]}</div>)
        count++
      });
    }
    else {
      var count = 0
      daysArray.forEach(element => {
        arrayOfDays.push(<div class="day" id={element} onClick={() => { handleDay(element) }}>{daysFormat.long[count]}</div>)
        count++
      });
    }
  }
  handleWeekResize()

  if (edit.state) {
    return (


      <div className="containerEdit" >
        <div className="daysOfWeek">
          {arrayOfDays}
          {/* <div class="day" id="monday" onClick={()=>{handleDay("monday")}}>Monday</div>
          <div class="day" id="tuesday" onClick={()=>{handleDay("tuesday")}}>Tuesday</div>
          <div class="day" id="wednesday" onClick={()=>{handleDay("wednesday")}}>Wednesday</div>
          <div class="day" id="thursday" onClick={()=>{handleDay("thursday")}}>Thursday</div>
          <div class="day" id="friday" onClick={()=>{handleDay("friday")}}>Friday</div>
         <div class="day" id="saturday" onClick={()=>{handleDay("saturday")}}>Saturday</div>
        <div class="day" id="sunday" onClick={()=>{handleDay("sunday")}}>Sunday</div> */}
        </div>

        {console.log(arrayOfDays)}

        <div id="bodyOfTodosEdit" className="container bodyOfTodosEditFlat">
          <div id="divOfTodos">
            <div id="pendingTodos" className="todosContainer container">

              <p className="section"><strong>To-do</strong></p>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="todosOnly">
                  {(provided) => (
                    <div className='todosOnly' {...provided.droppableProps} ref={provided.innerRef}>

                      {arrayOfPendingTodos}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <AddButton clickFunc={handleAdd} />

            </div>

            <div className="container todosContainer">
              <div className="section"><strong>Done</strong><button onClick={clearDone} className="btn custom_button">clear</button></div>
              {arrayOfDoneTodos}
            </div>
            <button onClick={handleClearWeek} className="btn clearWeek">Clear Week</button>
          </div>

          <EditWin arrayOfSubs={[arrayOfSubTasksEditNotDone, arrayOfSubTasksEditDone]} addStep={handleSubAdd} handleLessFunc={handleLess} />

          { }
        </div>
      </div>


    )
  } else {
    return (


      <div className="containerNoEdit" >
        <div className="daysOfWeek">
          {arrayOfDays}

        </div>
        <div>

          <div id="bodyOfTodos" className="container">
            <div id="divOfTodos" className="">
              <div className="" id="pendingTodos" >
                {/* <p><strong>Today</strong></p> */}
                <p className="section"><strong>To-do</strong></p>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="todosOnly">
                    {(provided) => (
                      <div className='todosOnly' {...provided.droppableProps} ref={provided.innerRef}>

                        {arrayOfPendingTodos}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <AddButton clickFunc={handleAdd} />

              </div>

              <div className="section"><strong>Done</strong><button onClick={clearDone} className="btn custom_button">clear</button></div>
              {arrayOfDoneTodos}
            </div>
            <button onClick={handleClearWeek} className="btn clearWeek">Clear Week</button>
          </div>
        </div>
      </div>


    )
  }

}

//rendering Todos
class DisplayingDateTodos extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className="main">
        {/* <div id="containerOfTodos">{arrayOfTodos}</div> */}
        <GetTodos />
      </div>
    )

  }


}





ReactDOM.render(<DisplayingDateTodos />, document.getElementById('root'));


