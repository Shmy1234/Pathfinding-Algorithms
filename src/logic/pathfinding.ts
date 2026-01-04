import { ALGORITHM_NAMES, COLS, ROWS } from "../constants";
import { AlgorithmId, Coordinate, Grid, NodeState } from "../types";

export function createGrid(cols = COLS, rows = ROWS): Grid {
  return Array.from({ length: cols }, (_, col) =>
    Array.from({ length: rows }, (_, row) => createNode(col, row))
  );
}

export function prepareGridForSelections(grid: Grid, selections: Coordinate[]): Grid {
  const next = cloneGrid(grid);
  resetGrid(next);
  applySelections(next, selections);
  return next;
}

export function computePaths(grid: Grid, selections: Coordinate[], algorithm: AlgorithmId): Grid {
  const working = prepareGridForSelections(grid, selections);
  if (selections.length === 0) return working;

  let currentStart = getNode(working, selections[0]);
  if (!currentStart) return working;
  markStart(currentStart);

  for (let i = 1; i < selections.length; i++) {
    const target = getNode(working, selections[i]);
    if (!target) continue;

    markGoal(target);
    clearTransientSearchState(working);

    const path = findPath(working, currentStart, target, algorithm);
    if (path) {
      path.forEach((node) => {
        if (node !== currentStart && node !== target) {
          markPath(node);
        }
      });
    }

    if (i < selections.length - 1) {
      markPath(target);
      currentStart = target;
      markStart(currentStart);
    }
  }

  return working;
}

function createNode(col: number, row: number): NodeState {
  return {
    col,
    row,
    parent: null,
    distance: Infinity,
    gCost: Infinity,
    hCost: Infinity,
    fCost: Infinity,
    start: false,
    goal: false,
    waypoint: false,
    solid: false,
    open: false,
    checked: false,
    path: false,
    baseLabel: "",
  };
}

function cloneGrid(grid: Grid): Grid {
  return grid.map((col) => col.map((node) => ({ ...node, parent: null })));
}

function resetGrid(grid: Grid): void {
  grid.forEach((col) =>
    col.forEach((node) => {
      node.parent = null;
      node.distance = Infinity;
      node.gCost = Infinity;
      node.hCost = Infinity;
      node.fCost = Infinity;
      node.start = false;
      node.goal = false;
      node.waypoint = false;
      node.solid = false;
      node.open = false;
      node.checked = false;
      node.path = false;
      node.baseLabel = "";
    })
  );
}

function applySelections(grid: Grid, selections: Coordinate[]): void {
  selections.forEach((coord, idx) => {
    const node = getNode(grid, coord);
    if (!node) return;
    if (idx === 0) {
      markStart(node);
    } else {
      markWaypoint(node, idx);
    }
  });
}

function clearTransientSearchState(grid: Grid): void {
  grid.forEach((col) =>
    col.forEach((node) => {
      node.parent = null;
      node.distance = Infinity;
      node.gCost = Infinity;
      node.hCost = Infinity;
      node.fCost = Infinity;
      node.open = false;
      node.checked = false;
      if (!node.start && !node.goal && !node.solid && !node.path && !node.waypoint) {
        node.baseLabel = "";
      }
    })
  );
}

function markStart(node: NodeState): void {
  node.start = true;
  node.goal = false;
  node.waypoint = false;
  node.path = false;
  node.baseLabel = "";
}

function markGoal(node: NodeState): void {
  node.goal = true;
  node.start = false;
  node.baseLabel = "G";
}

function markWaypoint(node: NodeState, idx: number): void {
  node.waypoint = true;
  node.start = false;
  node.goal = false;
  node.path = false;
  node.baseLabel = `W${idx}`;
}

function markPath(node: NodeState): void {
  node.path = true;
  node.start = false;
  node.goal = false;
  node.waypoint = false;
  node.baseLabel = "P";
}

function isWalkable(node: NodeState | null): node is NodeState {
  return Boolean(node) && !node.solid;
}

function getNode(grid: Grid, coord: Coordinate): NodeState | null {
  if (coord.col < 0 || coord.col >= grid.length) return null;
  if (coord.row < 0 || coord.row >= grid[0].length) return null;
  return grid[coord.col][coord.row];
}

function neighbors(grid: Grid, node: NodeState): NodeState[] {
  return [
    getNode(grid, { col: node.col, row: node.row - 1 }),
    getNode(grid, { col: node.col, row: node.row + 1 }),
    getNode(grid, { col: node.col - 1, row: node.row }),
    getNode(grid, { col: node.col + 1, row: node.row }),
  ].filter(Boolean) as NodeState[];
}

function findPath(grid: Grid, start: NodeState, goal: NodeState, algorithm: AlgorithmId) {
  switch (algorithm) {
    case "dfs":
      return dfs(grid, start, goal);
    case "dijkstra":
      return dijkstra(grid, start, goal);
    case "astar":
      return aStar(grid, start, goal);
    default:
      return bfs(grid, start, goal);
  }
}

function bfs(grid: Grid, start: NodeState, goal: NodeState): NodeState[] | null {
  const queue: NodeState[] = [start];
  const visited = new Set<NodeState>([start]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    current.checked = true;
    if (current === goal) {
      return reconstructPath(goal, start);
    }
    for (const neighbor of neighbors(grid, current)) {
      if (!isWalkable(neighbor) || visited.has(neighbor)) continue;
      neighbor.parent = current;
      neighbor.open = true;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }
  return null;
}

function dfs(grid: Grid, start: NodeState, goal: NodeState): NodeState[] | null {
  const stack: NodeState[] = [start];
  const visited = new Set<NodeState>([start]);

  while (stack.length > 0) {
    const current = stack.pop()!;
    current.checked = true;
    if (current === goal) {
      return reconstructPath(goal, start);
    }
    for (const neighbor of neighbors(grid, current)) {
      if (!isWalkable(neighbor) || visited.has(neighbor)) continue;
      neighbor.parent = current;
      neighbor.open = true;
      visited.add(neighbor);
      stack.push(neighbor);
    }
  }
  return null;
}

function dijkstra(grid: Grid, start: NodeState, goal: NodeState): NodeState[] | null {
  const queue: NodeState[] = [start];
  const visited = new Set<NodeState>();
  start.distance = 0;

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    current.checked = true;
    if (current === goal) {
      return reconstructPath(goal, start);
    }
    for (const neighbor of neighbors(grid, current)) {
      if (!isWalkable(neighbor) || visited.has(neighbor)) continue;
      const tentative = current.distance + 1;
      if (tentative < neighbor.distance) {
        neighbor.distance = tentative;
        neighbor.parent = current;
        neighbor.open = true;
        queue.push(neighbor);
      }
    }
  }
  return null;
}

function aStar(grid: Grid, start: NodeState, goal: NodeState): NodeState[] | null {
  const open: NodeState[] = [start];
  const openSet = new Set<NodeState>([start]);
  const closedSet = new Set<NodeState>();
  start.gCost = 0;
  start.hCost = manhattan(start, goal);
  start.fCost = start.gCost + start.hCost;

  while (open.length > 0) {
    open.sort((a, b) => (a.fCost === b.fCost ? a.gCost - b.gCost : a.fCost - b.fCost));
    const current = open.shift()!;
    openSet.delete(current);
    current.checked = true;
    closedSet.add(current);
    if (current === goal) {
      return reconstructPath(goal, start);
    }
    for (const neighbor of neighbors(grid, current)) {
      if (!isWalkable(neighbor) || closedSet.has(neighbor)) continue;
      const tentativeG = current.gCost + 1;
      const betterPath = tentativeG < neighbor.gCost || !openSet.has(neighbor);
      if (betterPath) {
        neighbor.parent = current;
        neighbor.gCost = tentativeG;
        neighbor.hCost = manhattan(neighbor, goal);
        neighbor.fCost = neighbor.gCost + neighbor.hCost;
        if (!openSet.has(neighbor)) {
          neighbor.open = true;
          openSet.add(neighbor);
          open.push(neighbor);
        }
      }
    }
  }
  return null;
}

function reconstructPath(end: NodeState, start: NodeState): NodeState[] {
  const path: NodeState[] = [];
  let current: NodeState | null = end;
  while (current && current !== start) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function manhattan(a: NodeState, b: NodeState): number {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
}

export function nodeLabel(node: NodeState, showCoords: boolean): string {
  if (showCoords) return `${node.col},${node.row}`;
  return node.baseLabel;
}

export const algorithmOptions = Object.entries(ALGORITHM_NAMES).map(([value, label]) => ({
  value: value as AlgorithmId,
  label,
}));
