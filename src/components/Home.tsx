import { ALGORITHM_NAMES } from "../constants";
import { AlgorithmId } from "../types";

interface HomeProps {
  onOpen: (algorithm: AlgorithmId) => void;
}

export default function Home({ onOpen }: HomeProps) {
  return (
    <section className="panel">
      <h1>Pathfinding Visualizer</h1>
      <p>
        Pick an algorithm to open the interactive grid. Click cells to set a start point and ordered waypoints,
        then run to see the route stitched segment by segment through each waypoint.
      </p>
      <div className="home-buttons">
        {Object.entries(ALGORITHM_NAMES).map(([value, label]) => (
          <button key={value} className="btn" onClick={() => onOpen(value as AlgorithmId)} data-open={value}>
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
