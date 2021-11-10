import React, { Component } from "react";
import "./App.css";

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.state = {
      suggestions: [],
      currentSuggestionIndex: 0,
      suggestionsVisible: false,
      input: "",
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
}

componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
}

  handleClickOutside = (e) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(e.target)) {
        this.setState({suggestionsVisible:false});
    }
}

  onChange = async (e) => {
    const userInput = e.target.value;
    const data = this.props.data;
    //we filter the data returned from the API to show only the suggestions that have a certain match with the input 
    const filteredSuggestions = data.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({ input: e.target.value });
    this.setState({ suggestions: filteredSuggestions });
    this.setState({ currentSuggestionIndex: 0 });
    this.setState({ suggestionsVisible: true });
  };

  onClick = (e) => {
    this.setState({ input: e.target.innerText });
    this.setState({ suggestions: [] });
    this.setState({ currentSuggestionIndex: 0 });
    this.setState({ suggestionsVisible: false });
  };

  onKeyDown = (e) => {
    // when the key pressed is the Enter key
    if (e.keyCode === 13) {
      this.setState({
        input: this.state.suggestions[this.state.currentSuggestionIndex],
      });
      this.setState({ currentSuggestionIndex: 0 });
      this.setState({ suggestionsVisible: false });
    }
    // when the key pressed is the UP key
    else if (e.keyCode === 38) {
      if (this.state.currentSuggestionIndex === 0) {
        return;
      }

      this.setState({
        currentSuggestionIndex: this.state.currentSuggestionIndex - 1,
      });
    }
    // when the key pressed is the DOWN key
    else if (e.keyCode === 40) {
      if (
        this.state.currentSuggestionIndex - 1 ===
        this.state.suggestions.length
      ) {
        return;
      }

      this.setState({
        currentSuggestionIndex: this.state.currentSuggestionIndex + 1,
      });
    }
  };

  suggestionsListComponent = () => {
    return this.state.suggestions.length ? (
      <ul className="suggestions">
        {this.state.suggestions.map((suggestion, index) => {
        //set the base styling class for suggestions
          let className = "suggestion";

         // give the current suggestion a different bg-color
          if (index === this.state.currentSuggestionIndex) {
            className += " current-suggestion";
          }
         //find out where exactly does the suggestion match the input
          let matchIndex = suggestion
            .toLowerCase()
            .indexOf(this.state.input.toLowerCase());
          //splitting the suggestion string into 3 parts to be able to highlight the part matching the user input
          let firstPart = suggestion.substring(0, matchIndex);
          let secondPart = suggestion.substring(
            matchIndex + this.state.input.length
          );

          return (
            <li className={className} key={suggestion} onClick={this.onClick}>
              {firstPart}
              <b className="highlighted">{this.state.input}</b>
              {secondPart}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="empty">
        <span role="img" aria-label="empty emoji">
          🗅
        </span>{" "}
        <em>nothing matches the search</em>
      </div>
    );
  };

  render() {
    return (
      <div ref={this.wrapperRef}>
        <input
          type="text"
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          value={this.state.input}
        />
        {this.state.suggestionsVisible &&
          this.state.input &&
          this.suggestionsListComponent()}
      </div>
    );
  }
}

export default AutoComplete;
