import React from 'react';
import styles from './App.css';
import { ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal, Grid, Row, Col } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import Media from "react-media";

// The main data
import drills from '../data/data_private.json';

import { AppNavbar } from './AppNavbar.jsx';
import { Board } from './Board.jsx';
import { ResultTable } from './ResultTable.jsx';
import { startResults, emptyResults, nextIndex, randomIndex, updateResults } from "./helpers.jsx";

export class AnswerWindow extends React.Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    const data = this.props.data;
    const linkText = type => "https://lichess.org/" + type + "/" + data.fen;
    const linkTypes = [
      {text: 'Board editor', url: 'editor?fen='}
    , {text: 'Analysis board', url: 'analysis'}]

    const button = linkData => (<div key={linkData.url}><a target="_blank" href={linkText(linkData.url)}>{"Lichess " + linkData.text}</a></div>)

    return (<div>
      <div>{ data.answer } </div>
      { linkTypes.map(button) }
    </div>);
  }
}

export class DrillWindow extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      index: randomIndex(drills)
    , showAnswer: false
    , results: startResults(drills)
    , hasAnswered: false}
  }
  getCurrentData = () => drills[this.state.index];
  getCurrentResults = () => this.state.results[this.state.index]
  showAnswer = () => this.setState({showAnswer: true})
  setToIndex = num => this.setState({index: num, showAnswer: false, hasAnswered: false})
  nextIndex = () => nextIndex(this.state.index, drills, this.state.results);
  next = () => this.setToIndex(this.nextIndex())
  gameSelect = (row) => this.setToIndex(row.id);
  resetResults = () => this.setState({results: emptyResults(drills)})
  updateAnswer = (numRight, numWrong) => {
    const newResults = updateResults(this.state.results, this.state.index, numRight, numWrong);
    this.setState({results: newResults, hasAnswered: true})
  }
  canAddResult = () => this.state.showAnswer && !this.state.hasAnswered
  canNext = () => this.state.showAnswer && this.state.hasAnswered
  answerRight = () => this.updateAnswer(1, 0);
  answerWrong = () => this.updateAnswer(0, 1);
  render = () => {
    const data = this.getCurrentData();
    const answer = this.state.showAnswer ? <AnswerWindow data={data}/> : <div/>
    return (
      <div className={styles.app}>
          <Row>
            <Col xs={6}>
              <Row>
                <div className={styles.title}>{ data.reference }</div>
                <div className={styles.question}>{ data.challenge }</div>
              </Row>
              <div>
                <Board fen={data.fen}/>
              </div>
              <div className={styles.answer}>
                <Button disabled={!this.showAnswer} onClick={this.showAnswer}>Show answer</Button>
                <Button disabled={!this.canAddResult()} onClick={this.answerWrong}>Wrong</Button>
                <Button disabled={!this.canAddResult()} onClick={this.answerRight}>Right</Button>
                <Button disabled={!this.canNext()} onClick={this.next}>Next</Button>
              </div>
              <div>
                { answer }
              </div>
            </Col>
            <Col xs={6}>
              <div>
                <ResultTable data={this.state.results} rowSelector={this.gameSelect}/>
              </div>
              <div>
                <Button onClick={this.resetResults}>Reset results</Button>
              </div>
            </Col>
          </Row>
      </div>
    )
  }
}

export class App extends React.Component {
	constructor(props){
		super(props);
	}
	render = () => {
		return (
      <div>
        <AppNavbar/>
        <Grid fluid>
          <DrillWindow/>
        </Grid>
      </div>
		)
	}
}

