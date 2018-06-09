import React from "react";
import Chessdiagram from 'react-chessdiagram';

const lightSquareColor = '#f2f2f2'
const darkSquareColor = '#bfbfbf'
const flip = false;
const squareSize = Math.min(60, window.innerWidth/20);

export class Board extends React.Component {
  constructor(props){
    super(props);
  }
  
  render = () => {
    return (
      <Chessdiagram flip={flip} squareSize={squareSize} lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor} fen={this.props.fen}/>
    )
  }
}

