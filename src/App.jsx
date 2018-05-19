import React from 'react';
import styles from './App.css';
import { ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal, Grid, Row, Col } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import Media from "react-media";
import BootstrapTable from 'react-bootstrap-table-next';

import drills from '../data/data_private.json';
import { AppNavbar } from './AppNavbar.jsx';
import { Board } from './Board.jsx';

import { startResults, emptyResults, nextIndex, randomIndex, updateResults } from "./helpers.jsx";

const TR = () => <div>Row</div>;

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

export class AnswerWindow extends React.Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    const data = this.props.data;
    const linkBoard = "https://lichess.org/editor?fen=" + data.fen;
    const linkAnalysis = "https://lichess.org/analysis/" + data.fen;

    return (<div>
      <div>{ data.answer } </div>
      <div><a target="_blank" href={linkBoard}>Lichess board editor</a></div>
      <div><a target="_blank" href={linkAnalysis}>Lichess analysis board</a></div>
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

