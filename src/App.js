import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board';

const ROWS = 6;
const COLS = 7;

const createEmptyBoard = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
};

const checkWinner = (board, row, col) => {
  const directions = [
    [0, 1], // Horizontal
    [1, 0], // Vertical
    [1, 1], // Diagonal (top-left to bottom-right)
    [-1, 1], // Diagonal (top-right to bottom-left)
  ];

  const player = board[row][col];

  for (const [dx, dy] of directions) {
    let count = 1;

    // Check in one direction
    for (let i = 1; i < 4; i++) {
      const newRow = row + i * dx;
      const newCol = col + i * dy;

      if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === player) {
        count++;
      } else {
        break;
      }
    }

    // Check in the opposite direction
    for (let i = 1; i < 4; i++) {
      const newRow = row - i * dx;
      const newCol = col - i * dy;

      if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === player) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 4) {
      return true;
    }
  }

  return false;
};

const App = () => {
  const [board, setBoard] = useState(() => {
    // Load the board from localStorage or create an empty board
    const savedBoard = JSON.parse(localStorage.getItem('connectFourBoard'));
    return savedBoard || createEmptyBoard();
  });
  const [currentPlayer, setCurrentPlayer] = useState(() => {
    // Load the current player from localStorage or set default value
    return localStorage.getItem('connectFourCurrentPlayer') || 'blue';
  });
  const [winner, setWinner] = useState(null);

  const handleClick = (col) => {
    if (winner || board[0][col]) {
      // If there's a winner or the column is full, do nothing
      return;
    }

    const newBoard = [...board];
    for (let i = ROWS - 1; i >= 0; i--) {
      if (!newBoard[i][col]) {
        newBoard[i][col] = currentPlayer;
        if (checkWinner(newBoard, i, col)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === 'blue' ? 'red' : 'blue');
        }
        break;
      }
    }

    setBoard(newBoard);
  };

  // Will reset the game and it's state
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('blue');
    setWinner(null);
  };

  useEffect(() => {
    // Save the board and current player to localStorage whenever they change
    localStorage.setItem('connectFourBoard', JSON.stringify(board));
    localStorage.setItem('connectFourCurrentPlayer', currentPlayer);
  }, [board, currentPlayer]);

  return (
    <div className="App">
      <Board board={board} winner={winner} currentPlayer={currentPlayer} resetGame={resetGame} handleClick={handleClick}/>
    </div>
  );
};

export default App;
