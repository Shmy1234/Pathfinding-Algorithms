import { useMemo } from "react";
import { ALGORITHM_NAMES, COLS, ROWS } from "../constants";
import { algorithmOptions, nodeLabel } from "../logic/pathfinding";
import { AlgorithmId, Coordinate, Grid } from "../types";

interface GridPanelProps {
  grid: Grid;
  algorithm: AlgorithmId;
  showCoords: boolean;
  onAlgorithmChange: (algorithm: AlgorithmId) => void;
  onRun: () => void;
  onUndo: () => void;
  onReset: () => void;
  onToggleCoords: () => void;
  onHome: () => void;
  onCellClick: (coord: Coordinate) => void;
}

export default function GridPanel({
  grid,
  algorithm,
  showCoords,
  onAlgorithmChange,
  onRun,
  onUndo,
  onReset,
  onToggleCoords,
  onHome,
  onCellClick,
}: GridPanelProps) {
  const algorithmLabel = ALGORITHM_NAMES[algorithm];
  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <p className="label">Algorithm</p>
          <h2 id="algo-label">{algorithmLabel}</h2>
        </div>
        <div className="header-actions">
          <select id="algo-select" value={algorithm} onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmId)}>
            {algorithmOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="btn ghost" id="home-btn" onClick={onHome}>
            Home
          </button>
        </div>
      </header>

      <div className="layout">
        <div className="controls">
          <button className="btn primary" id="run-btn" onClick={onRun}>
            Run
          </button>
          <button className="btn" id="undo-btn" onClick={onUndo}>
            Undo Last
          </button>
          <button className="btn" id="coords-btn" onClick={onToggleCoords}>
            {showCoords ? "Hide Coords" : "Toggle Coords"}
          </button>
          <button className="btn" id="restart-btn" onClick={onReset}>
            Restart
          </button>
          <p className="hint">First click sets start, subsequent clicks add waypoints in order.</p>
        </div>
        <div className="grid-wrap">
          <GridBoard grid={grid} showCoords={showCoords} onCellClick={onCellClick} />
        </div>
      </div>
    </section>
  );
}

interface GridBoardProps {
  grid: Grid;
  showCoords: boolean;
  onCellClick: (coord: Coordinate) => void;
}

function GridBoard({ grid, showCoords, onCellClick }: GridBoardProps) {
  const cells = useMemo(() => {
    const rows: JSX.Element[] = [];
    for (let row = 0; row < ROWS; row++) {
      const cols: JSX.Element[] = [];
      for (let col = 0; col < COLS; col++) {
        const node = grid[col]?.[row];
        if (!node) continue;
        const classes = ["cell"];
        if (node.start) classes.push("start");
        if (node.goal) classes.push("goal");
        if (node.waypoint) classes.push("waypoint");
        if (node.solid) classes.push("solid");
        if (node.open) classes.push("open");
        if (node.checked) classes.push("checked");
        if (node.path) classes.push("path");
        cols.push(
          <button
            key={`${col}-${row}`}
            type="button"
            className={classes.join(" ")}
            onClick={() => onCellClick({ col, row })}
          >
            {nodeLabel(node, showCoords)}
          </button>
        );
      }
      rows.push(cols);
    }
    return rows;
  }, [grid, showCoords, onCellClick]);

  return <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>{cells}</div>;
}
