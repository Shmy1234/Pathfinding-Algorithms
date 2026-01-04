export type AlgorithmId = "bfs" | "dfs" | "dijkstra" | "astar";

export interface NodeState {
  col: number;
  row: number;
  parent: NodeState | null;
  distance: number;
  gCost: number;
  hCost: number;
  fCost: number;
  start: boolean;
  goal: boolean;
  waypoint: boolean;
  solid: boolean;
  open: boolean;
  checked: boolean;
  path: boolean;
  baseLabel: string;
}

export interface Coordinate {
  col: number;
  row: number;
}

export type Grid = NodeState[][];
