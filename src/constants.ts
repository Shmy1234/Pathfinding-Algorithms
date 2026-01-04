import { AlgorithmId } from "./types";

export const COLS = 16;
export const ROWS = 12;

export const ALGORITHM_NAMES: Record<AlgorithmId, string> = {
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
  dijkstra: "Dijkstra",
  astar: "A* Search",
};
