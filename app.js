const state = {
  cols: 16,
  rows: 12,
  nodes: [],
  selections: [],
  algorithm: "bfs",
  showCoords: false,
};

const gridEl = document.getElementById("grid");
const homeSection = document.getElementById("home");
const panelSection = document.getElementById("panel");
const algoLabelEl = document.getElementById("algo-label");
const algoSelectEl = document.getElementById("algo-select");

init();

function init() {
  buildGrid();
  wireEvents();
  setAlgorithm("bfs");
  refreshCells();
}

function wireEvents() {
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showPanel(btn.dataset.open);
    });
  });

  document.getElementById("home-btn").addEventListener("click", () => {
    panelSection.classList.add("hidden");
    homeSection.classList.remove("hidden");
  });

  document.getElementById("run-btn").addEventListener("click", computePaths);
  document.getElementById("undo-btn").addEventListener("click", undoLastSelection);
  document.getElementById("restart-btn").addEventListener("click", resetBoard);
  document.getElementById("coords-btn").addEventListener("click", toggleCoords);

  algoSelectEl.addEventListener("change", (e) => {
    setAlgorithm(e.target.value);
    renderSelections();
  });
}

function showPanel(algo) {
  setAlgorithm(algo);
  homeSection.classList.add("hidden");
  panelSection.classList.remove("hidden");
  renderSelections();
}

function setAlgorithm(algo) {
  state.algorithm = algo;
  algoSelectEl.value = algo;
  const names = {
    bfs: "Breadth-First Search",
    dfs: "Depth-First Search",
    dijkstra: "Dijkstra",
    astar: "A* Search",
  };
  algoLabelEl.textContent = names[algo] || algo.toUpperCase();
}

function buildGrid() {
  gridEl.innerHTML = "";
  state.nodes = Array.from({ length: state.cols }, () => Array(state.rows));
  gridEl.style.gridTemplateColumns = `repeat(${state.cols}, minmax(0, 1fr))`;

  for (let row = 0; row < state.rows; row++) {
    for (let col = 0; col < state.cols; col++) {
      const node = createNode(col, row);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.addEventListener("click", () => handleCellClick(node));
      node.el = cell;
      state.nodes[col][row] = node;
      gridEl.appendChild(cell);
    }
  }
}

function createNode(col, row) {
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
    el: null,
  };
}

function handleCellClick(node) {
  if (!node) return;
  const last = state.selections[state.selections.length - 1];
  if (last === node) return;
  state.selections.push(node);
  renderSelections();
}

function renderSelections() {
  clearAllNodes();
  state.selections.forEach((node, idx) => {
    if (idx === 0) {
      markStart(node);
    } else {
      markWaypoint(node, idx);
    }
  });
  refreshCells();
}

function resetBoard() {
  state.selections = [];
  clearAllNodes();
  refreshCells();
}

function undoLastSelection() {
  if (state.selections.length === 0) return;
  state.selections.pop();
  renderSelections();
}

function toggleCoords() {
  state.showCoords = !state.showCoords;
  refreshCells();
}

function clearAllNodes() {
  state.nodes.forEach((col) =>
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

function clearTransientSearchState() {
  state.nodes.forEach((col) =>
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

function refreshCells() {
  state.nodes.forEach((col) =>
    col.forEach((node) => {
      const classes = ["cell"];
      if (node.start) classes.push("start");
      if (node.goal) classes.push("goal");
      if (node.waypoint) classes.push("waypoint");
      if (node.solid) classes.push("solid");
      if (node.open) classes.push("open");
      if (node.checked) classes.push("checked");
      if (node.path) classes.push("path");

      node.el.className = classes.join(" ");
      node.el.textContent = state.showCoords ? `${node.col},${node.row}` : node.baseLabel;
    })
  );
}

function markStart(node) {
  node.start = true;
  node.goal = false;
  node.waypoint = false;
  node.path = false;
  node.baseLabel = "";
}

function markGoal(node) {
  node.goal = true;
  node.start = false;
  node.baseLabel = "G";
}

function markWaypoint(node, idx) {
  node.waypoint = true;
  node.start = false;
  node.goal = false;
  node.path = false;
  node.baseLabel = `W${idx}`;
}

function markPath(node) {
  node.path = true;
  node.start = false;
  node.goal = false;
  node.waypoint = false;
  node.baseLabel = "P";
}

function isWalkable(node) {
  return node && !node.solid;
}

function getNode(col, row) {
  if (col < 0 || col >= state.cols || row < 0 || row >= state.rows) return null;
  return state.nodes[col][row];
}

function neighbors(node) {
  return [
    getNode(node.col, node.row - 1),
    getNode(node.col, node.row + 1),
    getNode(node.col - 1, node.row),
    getNode(node.col + 1, node.row),
  ].filter(Boolean);
}

function reconstructPath(end, start) {
  const path = [];
  let current = end;
  while (current && current !== start) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function manhattan(a, b) {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
}

function computePaths() {
  clearAllNodes();
  if (state.selections.length === 0) {
    refreshCells();
    return;
  }

  let currentStart = state.selections[0];
  markStart(currentStart);

  for (let i = 1; i < state.selections.length; i++) {
    const target = state.selections[i];
    markGoal(target);
    clearTransientSearchState();

    const path = findPath(currentStart, target);
    if (path) {
      path.forEach((step) => {
        if (step !== currentStart && step !== target) {
          markPath(step);
        }
      });
    }

    if (i < state.selections.length - 1) {
      markPath(target);
      currentStart = target;
      markStart(currentStart);
    }
  }
  refreshCells();
}

function findPath(start, goal) {
  switch (state.algorithm) {
    case "dfs":
      return dfs(start, goal);
    case "dijkstra":
      return dijkstra(start, goal);
    case "astar":
      return aStar(start, goal);
    default:
      return bfs(start, goal);
  }
}

function bfs(start, goal) {
  const queue = [start];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const current = queue.shift();
    current.checked = true;
    if (current === goal) {
      return reconstructPath(goal, start);
    }
    for (const neighbor of neighbors(current)) {
      if (!isWalkable(neighbor) || visited.has(neighbor)) continue;
      neighbor.parent = current;
      neighbor.open = true;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }
  return null;
}

function dfs(start, goal) {
  const stack = [start];
  const visited = new Set([start]);

  while (stack.length > 0) {
    const current = stack.pop();
    current.checked = true;
    if (current === goal) {
      return reconstructPath(goal, start);
    }
    for (const neighbor of neighbors(current)) {
      if (!isWalkable(neighbor) || visited.has(neighbor)) continue;
      neighbor.parent = current;
      neighbor.open = true;
      visited.add(neighbor);
      stack.push(neighbor);
    }
  }
  return null;
}

function dijkstra(start, goal) {
  const queue = [start];
  const visited = new Set();
  start.distance = 0;

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    current.checked = true;
    if (current === goal) {
      return reconstructPath(goal, start);
    }
    for (const neighbor of neighbors(current)) {
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

function aStar(start, goal) {
  const open = [start];
  const openSet = new Set([start]);
  const closedSet = new Set();
  start.gCost = 0;
  start.hCost = manhattan(start, goal);
  start.fCost = start.gCost + start.hCost;

  while (open.length > 0) {
    open.sort((a, b) => (a.fCost === b.fCost ? a.gCost - b.gCost : a.fCost - b.fCost));
    const current = open.shift();
    openSet.delete(current);
    current.checked = true;
    closedSet.add(current);
    if (current === goal) {
      return reconstructPath(goal, start);
    }
    for (const neighbor of neighbors(current)) {
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
