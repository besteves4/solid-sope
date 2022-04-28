import { useState, useEffect, useMemo } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import * as d3 from "d3";

function ForceGraph({ nodes }) {
  const [animatedNodes, setAnimatedNodes] = useState([]);

  useEffect(() => {
    const simulation = d3
      .forceSimulation()
      .force("x", d3.forceX(400))
      .force("y", d3.forceY(300))
      .force("charge", d3.forceManyBody().strength(charge))
      .force("collision", d3.forceCollide(5));

    simulation.on("tick", () => {
      setAnimatedNodes([...simulation.nodes()]);
    });

    simulation.nodes([...nodes]);
    simulation.alpha(0.1).restart();

    return () => simulation.stop();
  }, [nodes, charge]);

  return (
    <g>
      {animatedNodes.map((node) => (
        <circle
          cx={node.x}
          cy={node.y}
          r={node.r}
          key={node.id}
          stroke="black"
          fill="transparent"
        />
      ))}
    </g>
  );
}

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();
  const [charge, setCharge] = useState(-3);
  const nodes = useMemo(
    () =>
      d3.range(50).map((n) => {
        return { id: n, r: 5 };
      }),
    []
  );

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div className="row">
      <div className="App">
        <h1>{session.info.webId}</h1>
        <input
          type="range"
          min="-30"
          max="30"
          step="1"
          value={charge}
          onChange={(e) => setCharge(e.target.value)}
        />
        <svg width="800" height="600">
        <ForceGraph nodes={nodes} charge={charge} />
        </svg>
      </div>
    </div>
    );
}
