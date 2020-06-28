import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

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
      history: [{
        squares: Array(9).fill(null),
      }],
      isWinner: Array(9).fill(false),
      stepNumber: 0,
      xIsNext: true,
      reverseOrder: false,
    };
  }
 
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coords: coords(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
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
    const history = this.state.history;
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

/* col,row */
function coords(i) {
  return `${i % 3},${Math.floor(i / 3)}`;
}
