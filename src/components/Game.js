import React, { useReducer } from "react";
import Board from "./Board";

function reducerFunction(state, action) {
	switch (action.type) {
		case "JUMP":
			return {
				...state,
				XisNext: action.payload.step % 2 === 0,
				history: state.history.slice(0, action.payload.step + 1),
			};
		case "MOVE":
			return {
				...state,
				XisNext: !state.XisNext,
				history: state.history.concat({
					squares: action.payload.squares,
				}),
			};
		default:
			return state;
	}
}

function Game() {
	const [state, dispatch] = useReducer(reducerFunction, {
		XisNext: true,
		history: [{ squares: Array(9).fill(null) }],
	});
	const { XisNext, history } = state;

	const jumpTo = (step) => {
		dispatch({ type: "JUMP", payload: { step } });
	};
	const handleClick = (i) => {
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		//copy of squares and its nothing but an array.
		const winner = calculateWinner(squares);
		if (winner || squares[i]) {
			return;
		}
		squares[i] = XisNext ? "X" : "O"; //filling the array at a certain position.
		dispatch({ type: "MOVE", payload: { squares } });
	};

	const current = history[history.length - 1];
	const winner = calculateWinner(current.squares);

	const status = winner
		? winner === "D"
			? "Draw"
			: `Winner is ${winner}`
		: "Next player is " + (XisNext ? "X" : "O");

	const moves = history.map((step, move) => {
		const desc = move ? `Go to #${move}` : "Start the game";
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{desc}</button>
			</li>
		);
	});
	return (
		<div className={winner ? "game disabled" : "game"}>
			<div className="game-board">
				<Board onClick={(i) => handleClick(i)} squares={current.squares} />
			</div>
			<div className="game-info">
				<div>{status}</div>
				<ul>{moves}</ul>
			</div>
		</div>
	);
}

export default Game;

function calculateWinner(squares) {
	const winnerLines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	let isDraw = true;

	for (let i = 0; i < winnerLines.length; i++) {
		const [a, b, c] = winnerLines[i];
		if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
			return squares[a];
		}

		if (!squares[a] || !squares[b] || !squares[c]) {
			isDraw = false;
		}
	}

	if (isDraw) return "D";
	return null;
}
