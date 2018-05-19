import React from 'react';
import styles from './App.css';
import { ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal, Grid, Row, Col } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import Media from "react-media";
import BootstrapTable from 'react-bootstrap-table-next';
import drills from '../data/data_private.json';
import Chessdiagram from 'react-chessdiagram'

import { startResults, emptyResults } from "./helpers.jsx";

const TR = () => <div>Row</div>;
const lightSquareColor = '#f2f2f2'
const darkSquareColor = '#bfbfbf'
const flip = false;
const squareSize = 50;

const board = fen => <Chessdiagram flip={flip} squareSize={squareSize} lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor} fen={fen}/>
const randomIndex = () => Math.floor(Math.random() * drills.length)

export class ResultTable extends React.Component {
  constructor(props){
    super(props);
    this.state = { }
  }
  onRowSelect = (e, row) => {
    this.props.rowSelector(row);
  }

  render = () => {
    const rowEvents = { onClick: this.onRowSelect };
    const columns = [ {dataField: 'id', text: 'Id'}
    , {dataField: 'reference', text: 'Name'}
    , {dataField: 'type', text: 'Material'}
    , {dataField: 'right', text: 'Number right', sort: true}
    , {dataField: 'wrong', text: 'Number wrong', sort: true}
    ];
    const sort = [{dataField: "wrong", order:"desc"}];
  
    return (
      <div>
        <div className={styles.resultTable}>
          <BootstrapTable defaultSorted={sort} keyField="id" data={this.props.data} columns={columns} rowEvents={rowEvents}/>
        </div>
      </div>
    )
  }
}

export class DrillWindow extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      index: randomIndex()
    , showAnswer: false
    , results: startResults(drills)
    , hasAnswered: false}
  }
  getCurrentData = () => drills[this.state.index];
  getCurrentResults = () => this.state.results[this.state.index]
  showAnswer = () => this.setState({showAnswer: true})
  setToIndex = num => this.setState({index: num, showAnswer: false, hasAnswered: false})
  nextIndex = () => {
    // Return a random sample of drills, but exclude drills where the
    // number of right answers strongly exceeds the wrong answers
    const candidate = randomIndex();
    const data = this.state.results[candidate];
    const expectedDiff = 2;
    const skipBecauseGood = (data.right - data.wrong) >= expectedDiff;
    const skipBecauseRepeat = candidate == this.state.index;
    const skip = skipBecauseGood || skipBecauseRepeat;
    if (skip) {
      return this.nextIndex();
    }
    return candidate;
  }
  next = () => this.setToIndex(this.nextIndex())
  gameSelect = (row) => this.setToIndex(row.id);
  resetResults = () => this.setState({results: emptyResults(drills)})
  updateAnswer = (numRight, numWrong) => {
    var data = {}
    console.log(startResults(drills));
    data = Object.assign(this.getCurrentResults(), data);
    console.log("Data");
    console.log(data);
    data.wrong = data.wrong + numWrong;
    data.right = data.right + numRight;
    var allData = this.state.results
    allData[this.state.index] = data;
    window.localStorage.setItem("results", JSON.stringify(allData));
    this.setState({results: allData, hasAnswered: true})
  }
  canAddResult = () => this.state.showAnswer && !this.state.hasAnswered
  canNext = () => this.state.showAnswer && this.state.hasAnswered
  answerRight = () => this.updateAnswer(1, 0);
  answerWrong = () => this.updateAnswer(0, 1);
  render = () => {
    const data = this.getCurrentData();
    const linkBoard = "https://lichess.org/editor?fen=" + data.fen
    const linkAnalysis = "https://lichess.org/analysis/" + data.fen
    var answer = <div/>;
    if (this.state.showAnswer){
      answer = (<div>
        <div>{ data.answer } </div>
        <div><a target="_blank" href={linkBoard}>Lichess board editor</a></div>
        <div><a target="_blank" href={linkAnalysis}>Lichess analysis board</a></div>
      </div>);
    }
    return (
      <div className={styles.app}>
        <Grid fluid>
          <Row>
            <Col xs={6}>
              <Row>
                <div className={styles.title}>{ data.reference }</div>
                <div className={styles.question}>{ data.challenge }</div>
              </Row>
              <div>
                { board(data.fen) }
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
        </Grid>
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
      <DrillWindow/>
		)
	}
}

