import React from 'react'

const Board = (props) => {
  return (
    <div>
    <h1>Connect Four</h1>
      <p>{props.winner ? `Player ${props.winner} wins!` : `Current Turn: Player ${props.currentPlayer}`}</p>
      <div className="board">
        {props.board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell}`}
                onClick={() => props.handleClick(colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      {props.winner && <p className="winner">Player {props.winner} wins!</p>}
      <button onClick={props.resetGame}>Reset Game</button>
    </div>
  )
}

export default Board