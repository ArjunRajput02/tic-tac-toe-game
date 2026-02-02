import { useState } from "react";
import GameBoard from "./Components/GameBoard";
import Players from "./Components/Players";
import Log from "./Components/Log";
import { WINNING_COMBINATIONS, initialGameBoard } from "./utils/constant";

function App() {
  const [activePlayer, setActivePlayer] = useState("X");
  const [gameTurns, setGameTurns] = useState([]);

  const [players, setPlayers] = useState({
    X: "Player 1",
    O: "Player 2",
  });


  let gameBoard = initialGameBoard.map((row) => [...row]);

  for (const turn of gameTurns) {
    const { row, col } = turn.square;
    gameBoard[row][col] = turn.player;
  }

  let winner = null;

  for (const combination of WINNING_COMBINATIONS) {
    const first = gameBoard[combination[0].row][combination[0].column];
    const second = gameBoard[combination[1].row][combination[1].column];
    const third = gameBoard[combination[2].row][combination[2].column];

    if (first && first === second && first === third) {
      winner = first;
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;
  const winnerName = winner ? players[winner] : null;

  function handleSelectSquare(rowIndex, colIndex) {
    if (winner || hasDraw) return;

    setGameTurns((prevTurns) => [
      {
        square: { row: rowIndex, col: colIndex },
        player: activePlayer,
      },
      ...prevTurns,
    ]);

    setActivePlayer((prev) => (prev === "X" ? "O" : "X"));
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [symbol]: newName,
    }));
  }

  function handleRestart() {
    setGameTurns([]);
    setActivePlayer("X");
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Players
            name={players.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Players
            name={players.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>

        {(winner || hasDraw) && (
          <div id="game-over">
            <h2>Game Over!</h2>
            {winner && <p>{winnerName} won!</p>}
            {hasDraw && <p>It’s a draw!</p>}
            <button onClick={handleRestart}>Restart</button>
          </div>
        )}

        <GameBoard onSelectSquare={handleSelectSquare} turns={gameTurns} />
      </div>

      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
