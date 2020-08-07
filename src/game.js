import React from 'react';
import { connect } from 'react-redux';
import { calculateWinner, coords } from './utils';
import { addToHistory } from './store/actions';

function Square(props) {
  const classes = `square ${props.isWinner ? 'winner' : ''}`
  return (
    <button className={classes} onClick={props.onClick}>
      {props.value}
    </button>  
  );
}

class Board extends React.Component {    
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        isWinner={this.props.isWinner[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderCells() {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(j + 3 * i));
      }
      rows.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return rows;
  }
  
  render() {
    return (
      <div>
        {this.renderCells()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWinner: Array(9).fill(false),
      stepNumber: 0,
      xIsNext: true,
      reverseOrder: false,
    };
  }
 
  handleClick(i) {
    const history = this.props.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    this.props.addToHistory({
      item: {
        squares: squares,
        coords: coords(i),
      },
      stepNumber: this.state.stepNumber,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleOrder() {
    this.setState({
      reverseOrder: !this.state.reverseOrder,
    });
  }
  
  render() {
    const history = this.props.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} (${step.coords})` :
        'Go to game start';
      return (
        <li key={move} className={move === this.state.stepNumber ? 'active' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    if (this.state.reverseOrder) {
      moves.reverse();
    }
    
    let status;
    const isWinner = this.state.isWinner.slice(0);
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
      winner.forEach((el) => {
        isWinner[el] = true;
      });
    } else if (!current.squares.includes(null)) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            isWinner={isWinner}
            onClick={(i) => this.handleClick(i)}      
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleOrder()}>Toggle order</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => state,
  { addToHistory },
)(Game);