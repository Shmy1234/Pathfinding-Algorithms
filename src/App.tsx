import { useState } from "react";
import AlgorithmCards from "./components/AlgorithmCards";
import GridPanel from "./components/GridPanel";
import Home from "./components/Home";
import { COLS, ROWS } from "./constants";
import { computePaths, createGrid, prepareGridForSelections } from "./logic/pathfinding";
import { AlgorithmId, Coordinate, Grid } from "./types";

type View = "home" | "panel";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [grid, setGrid] = useState<Grid>(() => createGrid());
  const [selections, setSelections] = useState<Coordinate[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmId>("bfs");
  const [showCoords, setShowCoords] = useState(false);

  const handleCellClick = (coord: Coordinate) => {
    setSelections((prev) => {
      if (prev.some((p) => p.col === coord.col && p.row === coord.row)) return prev;
      const next = [...prev, coord];
      setGrid((current) => prepareGridForSelections(current, next));
      return next;
    });
  };

  const handleUndo = () => {
    setSelections((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.slice(0, -1);
      setGrid((current) => prepareGridForSelections(current, next));
      return next;
    });
  };

  const handleReset = () => {
    setSelections([]);
    setGrid(createGrid(COLS, ROWS));
  };

  const handleRun = () => {
    setGrid((current) => computePaths(current, selections, algorithm));
  };

  const handleOpenPanel = (algo: AlgorithmId) => {
    setAlgorithm(algo);
    setView("panel");
    setGrid((current) => prepareGridForSelections(current, selections));
  };

  const handleHome = () => setView("home");

  const handleToggleCoords = () => setShowCoords((prev) => !prev);

  const handleAlgorithmChange = (algo: AlgorithmId) => {
    setAlgorithm(algo);
  };

  return (
    <main className="page">
      {view === "home" ? (
        <>
          <Home onOpen={handleOpenPanel} />
          <AlgorithmCards />
        </>
      ) : (
        <GridPanel
          grid={grid}
          algorithm={algorithm}
          showCoords={showCoords}
          onAlgorithmChange={handleAlgorithmChange}
          onRun={handleRun}
          onUndo={handleUndo}
          onReset={handleReset}
          onToggleCoords={handleToggleCoords}
          onHome={handleHome}
          onCellClick={handleCellClick}
        />
      )}
    </main>
  );
}
