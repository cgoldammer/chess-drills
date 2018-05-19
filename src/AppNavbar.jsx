import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

export const appName = "Chess Drills";

export class AppNavbar extends React.Component {
  constructor(props){
    super(props);
  }
  render = () => {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            {appName}
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    )
  }
}
