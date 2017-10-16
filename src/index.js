import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.winner ? 'winner square' : 'square'} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i].value}
        winner={this.props.squares[i].isWinner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: new Array(9).fill({
          value: '',
          isWinner: false
        })
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i].value) {
      return;
    }

    squares[i] =  {
      value: this.state.xIsNext ? 'X' : 'O',
      isWinner: false
    };
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let currentSquares = current.squares;
    const winner = calculateWinner(currentSquares);

    const moves = history.map((step, move) => {
      const desc = move ? `Move #${move}` : 'Game start';
      return (<li key={move}>
        <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
      </li>);
    });

    let status;
    if (winner) {
      status = `Winner: ${winner.player}`;
      currentSquares = currentSquares.map((sq, i) => {
        return {
          value: sq.value,
          isWinner: winner.squares.includes(i)
        }
      });
    } else {
      status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a].value
      && squares[a].value === squares[b].value
      && squares[a].value === squares[c].value) {
      return {
        player: squares[a].value,
        squares: lines[i]
      };
    }
  }
  return null;
}
