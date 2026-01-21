import { useMemo, useState } from "react";
import GridPanel from "./components/GridPanel";
import { COLS, ROWS } from "./constants";
import { computePaths, createGrid, prepareGridForSelections } from "./logic/pathfinding";
import { AlgorithmId, Coordinate, Grid } from "./types";

type PanelState = {
  id: number;
  cols: number;
  rows: number;
  grid: Grid;
  selections: Coordinate[];
  algorithm: AlgorithmId;
  showCoords: boolean;
  lastRunMs: number | null;
};

const createPanel = (id: number): PanelState => ({
  id,
  cols: COLS,
  rows: ROWS,
  grid: createGrid(COLS, ROWS),
  selections: [],
  algorithm: "bfs",
  showCoords: false,
  lastRunMs: null,
});

export default function App() {
  const [panels, setPanels] = useState<PanelState[]>(() => [createPanel(1)]);
  const [nextId, setNextId] = useState(2);

  const handleCellClick = (id: number, coord: Coordinate) => {
    setPanels((prev) =>
      prev.map((panel) => {
        if (panel.id !== id) return panel;
        if (panel.selections.some((p) => p.col === coord.col && p.row === coord.row)) return panel;
        const nextSelections = [...panel.selections, coord];
        return {
          ...panel,
          selections: nextSelections,
          grid: prepareGridForSelections(panel.grid, nextSelections),
        };
      })
    );
  };

  const handleUndo = (id: number) => {
    setPanels((prev) =>
      prev.map((panel) => {
        if (panel.id !== id) return panel;
        if (panel.selections.length === 0) return panel;
        const nextSelections = panel.selections.slice(0, -1);
        return {
          ...panel,
          selections: nextSelections,
          grid: prepareGridForSelections(panel.grid, nextSelections),
        };
      })
    );
  };

  const handleReset = (id: number) => {
    setPanels((prev) =>
      prev.map((panel) => {
        if (panel.id !== id) return panel;
        return {
          ...panel,
          selections: [],
          grid: createGrid(panel.cols, panel.rows),
          lastRunMs: null,
        };
      })
    );
  };

  const handleRun = (id: number) => {
    setPanels((prev) =>
      prev.map((panel) => {
        if (panel.id !== id) return panel;
        const start = performance.now();
        const next = computePaths(panel.grid, panel.selections, panel.algorithm);
        const elapsed = performance.now() - start;
        return {
          ...panel,
          grid: next,
          lastRunMs: elapsed,
        };
      })
    );
  };

  const handleToggleCoords = (id: number) => {
    setPanels((prev) =>
      prev.map((panel) => (panel.id === id ? { ...panel, showCoords: !panel.showCoords } : panel))
    );
  };

  const handleAlgorithmChange = (id: number, algo: AlgorithmId) => {
    setPanels((prev) =>
      prev.map((panel) => {
        if (panel.id !== id) return panel;
        return {
          ...panel,
          algorithm: algo,
          grid: prepareGridForSelections(panel.grid, panel.selections),
        };
      })
    );
  };

  const handleGridSizeChange = (id: number, cols: number, rows: number) => {
    setPanels((prev) =>
      prev.map((panel) => {
        if (panel.id !== id) return panel;
        return {
          ...panel,
          cols,
          rows,
          selections: [],
          grid: createGrid(cols, rows),
          lastRunMs: null,
        };
      })
    );
  };

  const handleAddCanvas = () => {
    setPanels((prev) => [...prev, createPanel(nextId)]);
    setNextId((prev) => prev + 1);
  };

  const fastestPanel = useMemo(() => {
    const candidates = panels.filter((panel) => panel.lastRunMs !== null);
    if (candidates.length === 0) return null;
    return candidates.reduce((fastest, panel) =>
      panel.lastRunMs! < fastest.lastRunMs! ? panel : fastest
    );
  }, [panels]);

  return (
    <main className="page">
      <section className="panel panel-toolbar">
        <div>
          <h1 className="app-title">Pathfinder Mastery</h1>
          <p className="muted">
            {fastestPanel
              ? `Fastest: Canvas ${fastestPanel.id} (${fastestPanel.lastRunMs!.toFixed(2)} ms)`
              : "Run a canvas to compare speeds."}
          </p>
        </div>
        <button className="btn primary" onClick={handleAddCanvas}>
          Add Canvas
        </button>
      </section>
      <div className="panel-stack">
        {panels.map((panel) => (
          <GridPanel
            key={panel.id}
            title={`Canvas ${panel.id}`}
            grid={panel.grid}
            algorithm={panel.algorithm}
            cols={panel.cols}
            rows={panel.rows}
            showCoords={panel.showCoords}
            lastRunMs={panel.lastRunMs}
            onAlgorithmChange={(algo) => handleAlgorithmChange(panel.id, algo)}
            onGridSizeChange={(cols, rows) => handleGridSizeChange(panel.id, cols, rows)}
            onRun={() => handleRun(panel.id)}
            onUndo={() => handleUndo(panel.id)}
            onReset={() => handleReset(panel.id)}
            onToggleCoords={() => handleToggleCoords(panel.id)}
            onCellClick={(coord) => handleCellClick(panel.id, coord)}
          />
        ))}
      </div>
    </main>
  );
}
