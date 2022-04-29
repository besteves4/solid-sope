import { useState, useEffect } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import * as d3 from "d3";

function ForceGraph({ nodes }) {
  const [animatedNodes, setAnimatedNodes] = useState([]);

  // re-create animation every time nodes change
  useEffect(() => {
    const simulation = d3.forceSimulation().force("x", d3.forceX(400)).force("y", d3.forceY(300));

    // update state on every frame
    simulation.on("tick", () => {
      setAnimatedNodes([...simulation.nodes()]);
    });

    // copy nodes into simulation
    simulation.nodes([...nodes]);
    // slow down with a small alpha
    simulation.alpha(0.1).restart();

    // stop simulation on unmount
    return () => simulation.stop();
  }, [nodes]);

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

  const nodes = d3.range(50).map((n) => {
    return { id: n, r: 5 };
  });

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div className="row">
      <div className="App">
        <h1>{session.info.webId}</h1>
        <svg width="800" height="600">
          <ForceGraph nodes={nodes} />
        </svg>
      </div>
    </div>
    );
}