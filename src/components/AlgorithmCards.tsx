export default function AlgorithmCards() {
  return (
    <section className="panel info-panel">
      <h2>Algorithms Explained</h2>
      <article className="algo-card">
        <h3>Breadth-First Search (BFS)</h3>
        <figure className="algo-figure">
          <svg viewBox="0 0 180 110" aria-hidden="true">
            <rect x="8" y="10" width="164" height="90" fill="#fdfefe" stroke="#c9d5ff" />
            <circle cx="26" cy="56" r="8" fill="#4c8bf5" />
            <circle cx="152" cy="56" r="8" fill="#56c16d" />
            <rect x="54" y="30" width="20" height="20" fill="#d8e6ff" stroke="#b6c8ff" />
            <rect x="54" y="60" width="20" height="20" fill="#d8e6ff" stroke="#b6c8ff" />
            <rect x="86" y="30" width="20" height="20" fill="#bed4ff" stroke="#9bb9ff" />
            <rect x="86" y="60" width="20" height="20" fill="#bed4ff" stroke="#9bb9ff" />
            <rect x="118" y="45" width="20" height="20" fill="#a6c3ff" stroke="#87adff" />
            <polyline points="26,56 64,40 96,40 128,55 152,56" fill="none" stroke="#4c8bf5" strokeWidth="3" />
            <polyline
              points="26,56 64,70 96,70"
              fill="none"
              stroke="#8fb5ff"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </svg>
          <figcaption>
            Wavefront expansion: layers radiate outward; first time the goal is dequeued, the route is optimal.
          </figcaption>
        </figure>
        <p className="muted">
          Explores an unweighted grid in widening “rings.” The queue grows each layer, ensuring the earliest visit to any
          cell is the shallowest possible route.
        </p>
        <p className="muted">
          Correctness: Once a node leaves the queue, no future node can reach it with fewer steps; the goal is optimal
          the moment it is dequeued. Complexity: O(V + E) time, O(V) memory for the queue and visited map.
        </p>
        <p className="muted">
          Strengths: Bulletproof shortest paths on grids and mazes; easy to reason about. Trade-offs: Frontier balloons
          on wide-open spaces, so memory is the main limiter.
        </p>
        <p className="muted">
          In this app: Queue-driven frontier mirrors the original desktop panel — parents freeze on first touch to
          rebuild the path cleanly.
        </p>
      </article>

      <article className="algo-card">
        <h3>Depth-First Search (DFS)</h3>
        <figure className="algo-figure">
          <svg viewBox="0 0 180 110" aria-hidden="true">
            <rect x="8" y="10" width="164" height="90" fill="#fffdf7" stroke="#f0d9b5" />
            <polyline points="26,92 50,68 70,48 90,28 110,44 126,60 140,80" fill="none" stroke="#f29c3f" strokeWidth="4" />
            <circle cx="26" cy="92" r="7" fill="#f29c3f" />
            <circle cx="140" cy="80" r="7" fill="#56c16d" />
            <line x1="90" y1="28" x2="70" y2="48" stroke="#e4b16a" strokeWidth="3" strokeDasharray="3 3" />
            <line x1="70" y1="48" x2="50" y2="68" stroke="#e4b16a" strokeWidth="3" strokeDasharray="3 3" />
            <circle cx="110" cy="44" r="4" fill="#ffdca6" />
            <circle cx="90" cy="28" r="4" fill="#ffdca6" />
            <circle cx="70" cy="48" r="4" fill="#ffdca6" />
          </svg>
          <figcaption>Stack-driven descent: follows one branch deeply, then backtracks along the dashed trail.</figcaption>
        </figure>
        <p className="muted">
          Pursues a single branch to completion before reconsidering alternatives. The explicit stack replaces recursion
          to avoid call-stack overflow on larger grids.
        </p>
        <p className="muted">
          Behavior: Great for quickly finding some path in snaky mazes; poor for shortest-path guarantees because it may
          commit to a long detour before discovering a shortcut.
        </p>
        <p className="muted">
          Complexity: O(V + E) time, but memory is usually near the current branch depth rather than the whole frontier.
          Order of neighbor pushes heavily shapes the route discovered.
        </p>
        <p className="muted">
          In this app: LIFO stack guides expansion; parents are captured when a node is first seen so backtracking can
          recreate the found path.
        </p>
      </article>

      <article className="algo-card">
        <h3>Dijkstra's Algorithm</h3>
        <figure className="algo-figure">
          <svg viewBox="0 0 180 110" aria-hidden="true">
            <rect x="8" y="10" width="164" height="90" fill="#f9fffb" stroke="#cdebd6" />
            <circle cx="24" cy="30" r="7" fill="#2c9c5c" />
            <circle cx="152" cy="78" r="7" fill="#2c9c5c" />
            <rect x="52" y="22" width="26" height="26" fill="#dff6e8" stroke="#bde7cf" />
            <rect x="96" y="38" width="26" height="26" fill="#c7edd9" stroke="#9fd9bf" />
            <rect x="70" y="66" width="26" height="26" fill="#b0e4ca" stroke="#8ed5b3" />
            <rect x="126" y="50" width="26" height="26" fill="#9adbb9" stroke="#7ccca1" />
            <polyline points="24,30 65,35 109,51 138,63 152,78" fill="none" stroke="#2c9c5c" strokeWidth="3" />
            <text x="65" y="31" fontSize="10" fill="#2c9c5c">
              1
            </text>
            <text x="109" y="47" fontSize="10" fill="#2c9c5c">
              2
            </text>
            <text x="138" y="59" fontSize="10" fill="#2c9c5c">
              3
            </text>
          </svg>
          <figcaption>Uniform-cost layers: the queue always pops the smallest distance first, finalizing that node’s cost.</figcaption>
        </figure>
        <p className="muted">
          Treats every move cost as weight 1 and expands nodes in order of best-known distance <code>gCost</code>.
          Relaxation may lower a neighbor’s cost, causing it to bubble earlier in the queue.
        </p>
        <p className="muted">
          Correctness: With non-negative weights, the first time a node is removed from the priority queue its distance
          is optimal. Complexity: O((V + E) log V) using the binary heap style ordering in this implementation.
        </p>
        <p className="muted">
          When to use: Any graph with non-negative edges where optimality matters. Downsides: Explores symmetrically in
          all directions, so it can overvisit when the goal direction is obvious.
        </p>
        <p className="muted">
          In this app: Distances start at infinity, parents update on improvements, and the open set drives steady
          outward growth until the goal leaves the queue.
        </p>
      </article>

      <article className="algo-card">
        <h3>A* Search</h3>
        <figure className="algo-figure">
          <svg viewBox="0 0 180 110" aria-hidden="true">
            <rect x="8" y="10" width="164" height="90" fill="#f7fbff" stroke="#cbe0ff" />
            <circle cx="20" cy="86" r="7" fill="#4c8bf5" />
            <circle cx="156" cy="24" r="7" fill="#56c16d" />
            <rect x="48" y="60" width="22" height="22" fill="#e2edff" stroke="#c8dcff" />
            <rect x="78" y="46" width="22" height="22" fill="#d0e2ff" stroke="#b5d0ff" />
            <rect x="108" y="34" width="22" height="22" fill="#b8d5ff" stroke="#9ec6ff" />
            <polyline points="20,86 59,71 89,57 119,45 156,24" fill="none" stroke="#4c8bf5" strokeWidth="3" />
            <line x1="20" y1="86" x2="156" y2="24" stroke="#ffb347" strokeDasharray="4 3" strokeWidth="2" />
            <text x="64" y="66" fontSize="10" fill="#4c8bf5">
              g
            </text>
            <text x="92" y="53" fontSize="10" fill="#4c8bf5">
              g
            </text>
            <text x="118" y="40" fontSize="10" fill="#4c8bf5">
              g
            </text>
            <text x="134" y="32" fontSize="10" fill="#ff9b33">
              h
            </text>
          </svg>
          <figcaption>
            Goal-directed search: <code>f = g + h</code> follows the gradient of the heuristic while keeping costs exact.
          </figcaption>
        </figure>
        <p className="muted">
          Adds a heuristic <code>hCost</code> (Manhattan distance here) to Dijkstra’s exact cost <code>gCost</code>. The
          queue orders by <code>fCost = g + h</code>, nudging exploration toward the goal without sacrificing optimality
          because the heuristic never overestimates.
        </p>
        <p className="muted">
          Performance: Same worst-case bounds as Dijkstra but usually inspects far fewer cells when the heuristic matches
          the domain. Tie-breaking on lower <code>gCost</code> favors straighter, cheaper prefixes.
        </p>
        <p className="muted">
          Edge cases: If <code>hCost</code> is set to 0, A* degenerates to Dijkstra; if it overestimates, optimality is
          lost but speed can increase (not used here).
        </p>
        <p className="muted">
          In this app: <code>AStarPanel</code>-style bookkeeping tracks <code>gCost</code>, <code>hCost</code>, and
          <code>fCost</code>; the open set requeues nodes when a better route surfaces, converging quickly on the target.
        </p>
      </article>
    </section>
  );
}
