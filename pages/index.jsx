/**
 * Copyright 2021 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useRef} from 'react';
import Select from 'react-select';
import { useSession } from "@inrupt/solid-ui-react";
import { Button } from "@inrupt/prism-react-components";
import { createSolidDataset, createThing, setThing, addUrl, saveSolidDatasetAt } from "@inrupt/solid-client";
import { RDF, ACL, ODRL } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";
import * as d3 from "d3";

export default function Home() {
  const { session } = useSession();

  var treeData = [
    {
      "name": "Top Level",
      "parent": "null",
      "children": [
        {
          "name": "Level 2: A",
          "parent": "Top Level",
          "children": [
            {
              "name": "Son of A",
              "parent": "Level 2: A"
            },
            {
              "name": "Daughter of A",
              "parent": "Level 2: A"
            }
          ]
        },
        {
          "name": "Level 2: B",
          "parent": "Top Level"
        }
      ]
    }
  ];

  // ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
width = 960 - margin.right - margin.left,
height = 500 - margin.top - margin.bottom;

var i = 0,
duration = 750,
root;

var tree = d3.layout.tree()
.size([height, width]);

var diagonal = d3.svg.diagonal()
.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;

update(root);

d3.select(self.frameElement).style("height", "500px");

function update(source) {

// Compute the new tree layout.
var nodes = tree.nodes(root).reverse(),
  links = tree.links(nodes);

// Normalize for fixed-depth.
nodes.forEach(function(d) { d.y = d.depth * 180; });

// Update the nodes…
var node = svg.selectAll("g.node")
  .data(nodes, function(d) { return d.id || (d.id = ++i); });

// Enter any new nodes at the parent's previous position.
var nodeEnter = node.enter().append("g")
  .attr("class", "node")
  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
  .on("click", click);

nodeEnter.append("circle")
  .attr("r", 1e-6)
  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

nodeEnter.append("text")
  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
  .attr("dy", ".35em")
  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
  .text(function(d) { return d.name; })
  .style("fill-opacity", 1e-6);

// Transition nodes to their new position.
var nodeUpdate = node.transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

nodeUpdate.select("circle")
  .attr("r", 10)
  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

nodeUpdate.select("text")
  .style("fill-opacity", 1);

// Transition exiting nodes to the parent's new position.
var nodeExit = node.exit().transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
  .remove();

nodeExit.select("circle")
  .attr("r", 1e-6);

nodeExit.select("text")
  .style("fill-opacity", 1e-6);

// Update the links…
var link = svg.selectAll("path.link")
  .data(links, function(d) { return d.target.id; });

// Enter any new links at the parent's previous position.
link.enter().insert("path", "g")
  .attr("class", "link")
  .attr("d", function(d) {
  var o = {x: source.x0, y: source.y0};
  return diagonal({source: o, target: o});
  });

// Transition links to their new position.
link.transition()
  .duration(duration)
  .attr("d", diagonal);

// Transition exiting nodes to the parent's new position.
link.exit().transition()
  .duration(duration)
  .attr("d", function(d) {
  var o = {x: source.x, y: source.y};
  return diagonal({source: o, target: o});
  })
  .remove();

// Stash the old positions for transition.
nodes.forEach(function(d) {
d.x0 = d.x;
d.y0 = d.y;
});
}

// Toggle children on click.
function click(d) {
if (d.children) {
d._children = d.children;
d.children = null;
} else {
d.children = d._children;
d._children = null;
}
update(d);
}

  let chosenPolicy = ''
  const policyTypes = [
    { value: 'permission', label: 'Permission' },
    { value: 'prohibition', label: 'Prohibition' }
  ]
  const handlePolicyType = (selectedOption) => {
    chosenPolicy = selectedOption.value;
  }

  let selectedPD = ''
  const personalData = [
    { value: 'FinancialAccount', label: 'Financial Account' },
    { value: 'PhysicalCharacteristic', label: 'Physical Characteristic' },
    { value: 'Contact', label: 'Contact' },
    { value: 'SocialNetwork', label: 'Social Network' }
  ]
  const handlePersonalData = (selectedOption) => {
    selectedPD = selectedOption.value;
  }

  let selectedPurpose = ''
  const purpose = [
    { value: 'LegalCompliance', label: 'Legal Compliance' },
    { value: 'ResearchAndDevelopment', label: 'Research And Development' },
    { value: 'ServiceProvision', label: 'Service Provision' }
  ]
  const handlePurpose = (selectedOption) => {
    selectedPurpose = selectedOption.value
  }

  const generatePolicyBtn= useRef(null);
  const generatePolicy = () => {
    console.log(selectedPD + ', ' + selectedPurpose);
   let newPolicy = createSolidDataset();

    const dpv = "http://www.w3.org/ns/dpv#";
    const dpvPurpose = dpv + "Purpose";

    const odrl = "http://www.w3.org/ns/odrl/2/";
    const odrlPolicyType = odrl + chosenPolicy;

    let policy = createThing({name: "policy1"});
    let policyType = createThing({name: chosenPolicy+"1"});
    policy = addUrl(policy, RDF.type, ODRL.Policy);
    policy = addUrl(policy, odrlPolicyType, policyType);
    newPolicy = setThing(newPolicy, policy);

    let purposeConstraint = createThing({name: "purposeConstraint"});
    policyType = addUrl(policyType, ODRL.target, dpv+selectedPD);
    policyType = addUrl(policyType, ODRL.action, ACL.Read);
    policyType = addUrl(policyType, ODRL.constraint, purposeConstraint);
    newPolicy = setThing(newPolicy, policyType);

    purposeConstraint = addUrl(purposeConstraint, ODRL.leftOperand, dpvPurpose);
    purposeConstraint = addUrl(purposeConstraint, ODRL.operator, ODRL.isA);
    purposeConstraint = addUrl(purposeConstraint, ODRL.rightOperand, dpv+selectedPurpose);
    newPolicy = setThing(newPolicy, purposeConstraint);

    try {
      // Save the SolidDataset
      saveSolidDatasetAt("https://pod.inrupt.com/besteves/odrl_policies/"+ selectedPD + selectedPurpose, 
      newPolicy, { fetch: fetch });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {session.info.isLoggedIn &&
        <div>
          <div class="container">
            <div class="center">
              <p>Chooose type of policy:</p>
              <Select id="policyType" label="Policy Type" options={policyTypes} onChange={handlePolicyType}></Select>
            </div>
          </div>
          <div class="container">
            <div class="">
              <p>Chooose type of personal data:</p>
              <Select id="personalData" label="Personal Data" options={personalData} onChange={handlePersonalData}></Select>
            </div>
            <div class="">
              <p>Chooose purpose:</p>
              <Select id="purpose" label="Purpose" options={purpose} onChange={handlePurpose}></Select>
            </div>
          </div>
          <div class="container">
            <div class="center">
              <p>Generate policy:</p>
              <Button variant="small" value="permission" onClick={generatePolicy} ref={generatePolicyBtn}>Generate</Button>
            </div>
          </div>
        </div>        
      }
    </div>
  );
}
