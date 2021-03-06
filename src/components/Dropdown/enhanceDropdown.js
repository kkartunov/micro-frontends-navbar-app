import React, { Component } from "react";

const enhanceDropdown = (CompositeComponent) =>
  class extends Component {
    constructor(props) {
      super(props);
      this.state = { isOpen: false };
      this.handleClick = this.handleClick.bind(this);
      this.onClickOutside = this.onClickOutside.bind(this);
      this.onClickOtherDropdown = this.onClickOtherDropdown.bind(this);
      this.refreshEventHandlers = this.refreshEventHandlers.bind(this);
    }

    refreshEventHandlers() {
      if (this.state.isOpen) {
        document.addEventListener("click", this.onClickOutside);
        document.addEventListener("touchstart", this.onClickOutside);
        document.addEventListener("dropdownClicked", this.onClickOtherDropdown);
      } else {
        document.removeEventListener("click", this.onClickOutside);
        document.removeEventListener("touchstart", this.onClickOutside);
        document.removeEventListener(
          "dropdownClicked",
          this.onClickOtherDropdown
        );
      }
    }

    handleClick() {
      const dropdownClicked = document.createEvent("Event");
      dropdownClicked.initEvent("dropdownClicked", true, false);

      document.dispatchEvent(dropdownClicked);

      this.setState({ isOpen: !this.state.isOpen }, () => {
        this.refreshEventHandlers();
      });
    }

    onClickOutside(evt) {
      let currNode = evt.target;
      let isDropdown = false;

      do {
        if (
          currNode.className &&
          currNode.className.indexOf &&
          currNode.className.indexOf("dropdown-wrap") > -1
        ) {
          isDropdown = true;
          break;
        }

        currNode = currNode.parentNode;

        if (!currNode) break;
      } while (currNode.tagName);

      if (!isDropdown) {
        this.setState({ isOpen: false }, () => {
          this.refreshEventHandlers();
        });
      }
    }

    onClickOtherDropdown() {
      this.setState({ isOpen: false }, () => {
        this.refreshEventHandlers();
      });
    }

    componentDidMount() {
      document.removeEventListener("click", this.onClickOutside);
      document.removeEventListener("touchstart", this.onClickOutside);
      document.removeEventListener(
        "dropdownClicked",
        this.onClickOtherDropdown
      );

      if (this.state.isOpen) {
        document.addEventListener("click", this.onClickOutside);
        document.addEventListener("touchstart", this.onClickOutside);
        document.addEventListener("dropdownClicked", this.onClickOtherDropdown);
      }
    }

    componentWillUnmount() {
      document.removeEventListener("click", this.onClickOutside);
      document.removeEventListener("touchstart", this.onClickOutside);
      document.removeEventListener(
        "dropdownClicked",
        this.onClickOtherDropdown
      );
    }

    stopEventPropagation(e) {
      e.stopPropagation();
    }

    render() {
      const { isOpen } = this.state;
      return (
        <div
          onClick={this.stopEventPropagation}
          className="dropdown-wrap"
          role="presentation"
        >
          <CompositeComponent
            {...this.props}
            isOpen={isOpen}
            handleClick={this.handleClick}
          />
        </div>
      );
    }
  };

export default enhanceDropdown;
