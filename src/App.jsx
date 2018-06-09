import React from 'react';
import styles from './App.css';
import { ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal, Grid, Row, Col } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import Select from 'react-select';

import { AppNavbar } from './AppNavbar.jsx';
import { Board } from './Board.jsx';
import { ResultTable } from './ResultTable.jsx';
import { allWarnings, allDrills, startResults, allEmptyResults, nextIndex, randomIndex, updateResults } from "./helpers.jsx";

export class AnswerWindow extends React.Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    const data = this.props.data;
    const linkText = type => "https://lichess.org/" + type + "/" + data.fen;
    const linkTypes = [
      {text: 'Board editor', url: 'editor'}
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
      showAnswer: false
    , hasAnswered: false
    }
  }
  getCurrentData = () => this.props.drills[this.props.index];
  getCurrentResults = () => this.props.results[this.props.index]
  showAnswer = () => this.setState({showAnswer: true})
  setToIndex = num => this.setState({showAnswer: false, hasAnswered: false}, () => this.props.setIndex(num))
  nextIndex = () => nextIndex(this.props.index, this.props.drills, this.props.results);
  next = () => this.setToIndex(this.nextIndex())
  gameSelect = row => this.setToIndex(row.id);
  resetResults = () => this.props.setResults(emptyResults())
  updateAnswer = (numRight, numWrong) => {
    const newResults = updateResults(this.props.activeSet, this.props.results, this.props.index, numRight, numWrong);
    this.setState({hasAnswered: true}, () => this.props.setResults(newResults));
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
            <Col md={6}>
              <Row>
                <div class="text-center">
                  <div className={styles.title}>{ data.reference }</div>
                  <div className={styles.question}>{ data.challenge }</div>
                </div>
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
            <Col md={6}>
              <div>
                <ResultTable data={this.props.results} rowSelector={this.gameSelect}/>
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

export class TypeSelector extends React.Component {
	constructor(props){
		super(props);
	}
  render = () => {
    return (
      <Select valueKey={"value"} labelKey={"label"} value={ this.props.activeSet } onChange={ this.props.onChange } options={ this.props.setOptions }/>
    )
  }
}

const WarningWindow = () => {
  const keys = Object.keys(allWarnings);
  var content = null;
  if (keys.length > 0){
    const nameDiv = key => (<div key={ key }>{ key }: { JSON.stringify(allWarnings[key])}</div>)
    content = (<div>
      <h2>Warnings</h2>
      { Object.keys(allWarnings).map(nameDiv) }
    </div>)
  }
  return content;
}

export class App extends React.Component {
	constructor(props){
		super(props);
    this.state = { 
      activeSet: null
    , index: null
    , results: null};
	}
  setIndex = num => this.setState({index: num})
  setResults = results => this.setState({results: results})
  setActiveSet = set => {
    const newSet = set.value;
    const drills = allDrills[newSet];
    const results = startResults(newSet, drills);
    this.setState({activeSet: newSet, index: randomIndex(drills), results: results});
  }
	render = () => {
    const setOptions = [
      {value: "endgames", label: "Endgames"}
    , {value: "repertoire", label: "Repertoire"}];
    const set = this.state.activeSet;
    const drillWindow = set ? <DrillWindow index={this.state.index} setIndex={this.setIndex} setResults={this.setResults} results={this.state.results} activeSet={set} drills={ allDrills[set] }/> : <div/>;
		return (
      <div>
        <AppNavbar/>
        <WarningWindow/>
        <Grid fluid>
          <TypeSelector setOptions={ setOptions } onChange={ this.setActiveSet }/>
          { drillWindow }
        </Grid>
      </div>
		)
	}
}

