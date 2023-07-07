import React from "react";
import * as d3 from "d3";
import data from "../data/data.json";

export default class ForceLayout extends React.PureComponent {
  componentDidMount() {
    var width = 960, height = 500;

    var nodes = [
      {name: 'Permission'},
      {name: 'Marketing'},
      {name: 'Legal Compliance'},
      {name: 'Social'},
      {name: 'Financial'},
      {name: 'Professional'},
    ]
    
    var links = [
      {source: 0, target: 1},
      {source: 0, target: 2},
      {source: 1, target: 3},
      {source: 2, target: 4},
      {source: 2, target: 5},
    ]

    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))
      .force('link', d3.forceLink().distance(100).links(links));
    
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
        .attr('r', 30)
        .attr('cx', function(d) {
          return d.x
        })
        .attr('cy', function(d) {
          return d.y
        });

      d3.select('.nodes')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text(function(d) {
          return d.name
        })
        .attr('x', function(d) {
          return d.x
        })
        .attr('y', function(d) {
          return d.y
        })
        .attr('dy', function(d) {
          return 5
        });
    }    
  }

  render() {
    return (
      <div id="content">
        <svg width="960" height="500">
          <g className="links"></g>
          <g className="nodes"></g>
        </svg>
      </div>
    );
  }
}
