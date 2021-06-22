import { TransitionGroup } from "react-transition-group"; // ES6

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { GetTodos } from "./components/content";
//function for

//rendering Todos
class DisplayingDateTodos extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main">
        <p>Here's some information about how this works</p>
        <GetTodos />
      </div>
    );
  }
}

ReactDOM.render(<DisplayingDateTodos />, document.getElementById("root"));
