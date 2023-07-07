import React from "react";
import * as d3 from "d3";
import data from "../data/data.json";

export default class ForceLayout extends React.PureComponent {
  componentDidMount() {
    /*     var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height;

    var simulation = d3.forceSimulation(data.nodes)
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter())
      .force("link", d3.forceLink().links(data.links));
      // .force("link", d3.forceLink(data.links));
      
    simulation
        .on("tick", ticked);

    function ticked() {
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2 + 40);

      context.beginPath();
      data.links.forEach(drawLink);
      context.strokeStyle = "#aaa";
      context.stroke();

      context.beginPath();
      data.nodes.forEach(drawNode);
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      context.restore();
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 6, 0, 2 * Math.PI);
    } */

    var width = 400, height = 300;

    var nodes = [
      {name: 'A'},
      {name: 'B'},
      {name: 'C'},
      {name: 'D'},
      {name: 'E'},
      {name: 'F'},
      {name: 'G'},
      {name: 'H'},
    ]
    
    var links = [
      {source: 0, target: 1},
      {source: 0, target: 2},
      {source: 0, target: 3},
      {source: 1, target: 6},
      {source: 3, target: 4},
      {source: 3, target: 7},
      {source: 4, target: 5},
      {source: 4, target: 7}
    ]

    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links));
    
    simulation.on('tick', ticked);

    function ticked() {
      updateLinks()
      updateNodes()
    }

    function updateLinks() {
      d3.select('.links')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', function(d) {
          return d.source.x
        })
        .attr('y1', function(d) {
          return d.source.y
        })
        .attr('x2', function(d) {
          return d.target.x
        })
        .attr('y2', function(d) {
          return d.target.y
        });
    }

    function updateNodes() {
      d3.select('.nodes')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .append('text')
        .text('A')
        .attr('r', 10)
        .attr('cx', function(d) {
          return d.x
        })
        .attr('cy', function(d) {
          return d.y
        });
    }
    
  }

  render() {
    // return <canvas width="960" height="500"></canvas>;
    return (
      <div id="content">
        <svg width="400" height="300">
          <g className="links"></g>
          <g className="nodes"></g>
        </svg>
      </div>
    );
  }
}
