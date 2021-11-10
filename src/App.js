import React, { Component } from "react";
import "./App.css";
import AutoComplete from "./AutoComplete";

class App extends Component {
  constructor() {
    super();
    this.state = { data: [] };
  }

  //fetching the data from the API
  returnData = async () => {
    const data = fetch("http://localhost:3030/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
    return data;
  };

  componentDidMount(prevProps) {
    if (prevProps !== this.props) {
      this.returnData().then((data) => {
        this.setState({ data: data.data });
      });
    }
  }

  render() {
    return (
      <div className="wrapper">
        <h2>Choose a Programming Language</h2>
        <AutoComplete data={this.state.data}></AutoComplete>
      </div>
    );
  }
}

export default App;
