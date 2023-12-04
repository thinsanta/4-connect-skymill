import React, { useState, useEffect, useReducer, useRef } from 'react';
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
  const initialState = useRef({
    moves: JSON.parse(localStorage.getItem('connectFourPreviousMoves')) || [],
  });

  const reducer = (state, action) => {
    switch (action.type) {
      case 'ADD_MOVE':
        return { ...state, moves: [...state.moves, action.payload] };
      case 'UNDO_MOVE':
        return { ...state, moves: state.moves.slice(0, -1) };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState.current);


  const handleClick = (col) => {
    if (winner || board[0][col]) {
      // If there's a winner or the column is full, do nothing
      return;
    }

    // Spreads the array to create a new one and fill it with new input.
    const newBoard = [...board];
    for (let i = ROWS - 1; i >= 0; i--) {
      if (!newBoard[i][col]) {
        const newMove = { board: JSON.parse(JSON.stringify(newBoard)), player: currentPlayer };
        dispatch({ type: 'ADD_MOVE', payload: newMove });
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
    dispatch({ type: 'RESET_MOVES' });
  };

  const handlePreviousMove = () => {
    if (state.moves.length > 0 && !winner) {
      const lastMove = state.moves[state.moves.length - 1];
      setBoard(lastMove.board);
      setCurrentPlayer(lastMove.player);
      dispatch({ type: 'UNDO_MOVE' });
      setWinner(null);
    }
  };

  // Update the state when one of the hooks updates
  useEffect(() => {
    localStorage.setItem('connectFourBoard', JSON.stringify(board));
    localStorage.setItem('connectFourCurrentPlayer', currentPlayer);
    localStorage.setItem('connectFourPreviousMoves', JSON.stringify(state.moves));
  }, [board, currentPlayer, state.moves]);

  return (
    <div className="App">
      <Board board={board} winner={winner} currentPlayer={currentPlayer} resetGame={resetGame} 
      handleClick={handleClick} handlePreviousMove={handlePreviousMove} 
      state={state.moves.length}/>
    </div>
  );
};

export default App;
