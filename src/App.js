import React, { useState, useCallback, useRef } from "react";
import "./styles.css";
import produce from "immer";

const numRows = 30;
const numCols = 30;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const Simulations = {
  glider: { 10: [10], 11: [11], 12: [9, 10, 11] },
  blinker: { 15: [15, 16, 17] },
  pyramids: {
    13: [15],
    14: [14, 15, 16],
    15: [13, 14, 15, 16, 17],
    20: [13, 14, 15, 16, 17],
    21: [14, 15, 16],
    22: [15]
  },
  diehard: { 15: [15], 16: [9, 10], 17: [10, 14, 15, 16] }
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef();
  runningRef.current = running;
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbor = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbor += g[newI][newJ];
              }
            });
            if (neighbor < 2 || neighbor > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbor === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 500);
  }, []);
  const handleClick = (grid, i, j) => {
    const newGrid = produce(grid, gridCopy => {
      gridCopy[i][j] = grid[i][j] ? 0 : 1;
    });
    setGrid(newGrid);
  };

  const randomSim = value => {
    const sim = Simulations[value];
    setGrid(g => {
      return produce(g, randomGrid => {
        for (let i of Object.keys(sim)) {
          for (let x of sim[i]) {
            randomGrid[i][x] = 1;
          }
        }
      });
    });
  };

  const clear = () => {
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            gridCopy[i][j] = 0;
          }
        }
      });
    });
  };
  return (
    <>
      <div className="container">
        <div className="btn-cont">
          <button
            onClick={() => {
              setRunning(!running);
              if (!running) {
                runningRef.current = true;
                runSimulation();
              }
            }}
            className={running ? "stop" : "start"}
          >
            {running ? "Stop" : "Start"}
          </button>

          <button onClick={() => clear()} className="clear">
            Clear
          </button>
          <div
            style={{
              fontSize: "20px",
              fontFamily: "sans"
            }}
          >
            Random Simulations
          </div>
          <button onClick={() => randomSim("pyramids")} className={"sims"}>
            Pyramids
          </button>
          <button onClick={() => randomSim("diehard")} className={"sims"}>
            DieHard
          </button>
          <button onClick={() => randomSim("glider")} className={"sims"}>
            Glider
          </button>
          <button onClick={() => randomSim("blinker")} className={"sims"}>
            Blinker
          </button>
        </div>
        <div className="grid">
          {grid.map((rows, i) => {
            return rows.map((col, j) => {
              return (
                <div
                  key={`${i}-${j}`}
                  onClick={() => handleClick(grid, i, j)}
                  className="box"
                  style={{
                    backgroundColor: grid[i][j] ? "bisque" : undefined
                  }}
                ></div>
              );
            });
          })}
        </div>
        <div
          className="title"
          style={{
            fontSize: "70px",
            textAlign: "center",
            fontFamily: "'Permanent Marker', cursive"
          }}
        >
          <div>Conway's</div>
          <div>Game</div>
          <div>of</div>
          <div>Life</div>
        </div>
      </div>
    </>
  );
};

export default App;
