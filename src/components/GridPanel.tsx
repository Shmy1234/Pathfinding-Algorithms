import { useMemo } from "react";
import { ALGORITHM_NAMES } from "../constants";
import { algorithmOptions, nodeLabel } from "../logic/pathfinding";
import { AlgorithmId, Coordinate, Grid } from "../types";

interface GridPanelProps {
  title: string;
  grid: Grid;
  algorithm: AlgorithmId;
  cols: number;
  rows: number;
  showCoords: boolean;
  lastRunMs: number | null;
  onAlgorithmChange: (algorithm: AlgorithmId) => void;
  onGridSizeChange: (cols: number, rows: number) => void;
  onRun: () => void;
  onUndo: () => void;
  onReset: () => void;
  onToggleCoords: () => void;
  onCellClick: (coord: Coordinate) => void;
}

export default function GridPanel({
  title,
  grid,
  algorithm,
  cols,
  rows,
  showCoords,
  lastRunMs,
  onAlgorithmChange,
  onGridSizeChange,
  onRun,
  onUndo,
  onReset,
  onToggleCoords,
  onCellClick,
}: GridPanelProps) {
  const algorithmLabel = ALGORITHM_NAMES[algorithm];
  const formattedTime = lastRunMs === null ? "—" : `${lastRunMs.toFixed(2)} ms`;
  const clampSize = (value: number) => {
    const safe = Number.isFinite(value) ? value : 0;
    return Math.max(1, Math.min(50, safe));
  };
  const gridWrapStyle = {
    aspectRatio: "3 / 2",
  } as const;
  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <p className="label">{title}</p>
          <h2 id="algo-label">{algorithmLabel}</h2>
          <p className="muted">Grid: {cols} x {rows}</p>
        </div>
        <div className="header-actions">
          <div className="size-controls">
            <label className="size-field">
              X
              <input
                aria-label="Grid columns"
                type="number"
                min={1}
                max={50}
                value={cols}
                onChange={(e) => onGridSizeChange(clampSize(Number(e.target.value)), rows)}
              />
            </label>
            <label className="size-field">
              Y
              <input
                aria-label="Grid rows"
                type="number"
                min={1}
                max={50}
                value={rows}
                onChange={(e) => onGridSizeChange(cols, clampSize(Number(e.target.value)))}
              />
            </label>
          </div>
          <select id="algo-select" value={algorithm} onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmId)}>
            {algorithmOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="layout">
        <div className="controls">
          <div className="controls-row">
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
          </div>
          <p className="muted">Last Run Time: {formattedTime}</p>
        </div>
        <div className="grid-wrap" style={gridWrapStyle}>
          <GridBoard
            grid={grid}
            cols={cols}
            rows={rows}
            showCoords={showCoords}
            onCellClick={onCellClick}
          />
        </div>
      </div>
    </section>
  );
}

interface GridBoardProps {
  grid: Grid;
  cols: number;
  rows: number;
  showCoords: boolean;
  onCellClick: (coord: Coordinate) => void;
}

function GridBoard({ grid, cols, rows, showCoords, onCellClick }: GridBoardProps) {
  const cells = useMemo(() => {
    const elements: JSX.Element[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
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
        elements.push(
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
    }
    return elements;
  }, [grid, cols, rows, showCoords, onCellClick]);

  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    width: "100%",
    height: "100%",
  } as const;
  return (
    <div className="grid" style={gridStyle}>
      {cells}
    </div>
  );
}
