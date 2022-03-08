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
import DropdownTreeSelect from "react-dropdown-tree-select";
import { useSession } from "@inrupt/solid-ui-react";
import { Button } from "@inrupt/prism-react-components";
import { createSolidDataset, createThing, setThing, addUrl, saveSolidDatasetAt, 
  getPodUrlAll, getSolidDataset, getContainedResourceUrlAll } from "@inrupt/solid-client";
import { RDF, ODRL } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";
import * as d3 from "d3";
import Input from "./input.js";

import personalData from "./personaldata.json";
import purpose from "./purposes.json";

async function getPolicyFilenames(policiesContainer, filename, newPolicy) {
  const myDataset = await getSolidDataset(
    policiesContainer, {
    fetch: fetch
  });
  console.log(myDataset, newPolicy);
  const policyList = getContainedResourceUrlAll(myDataset);
  console.log(filename, policyList);

  const filenameSave = `${policiesContainer}${filename}`;
  if(policyList.includes(filenameSave)){
    alert("There is already a policy with that name, choose another");
  } else {
    try {
      await saveSolidDatasetAt(filenameSave,
        newPolicy, { fetch: fetch });
    } catch (error) {
      console.log(error);
    }
  }
}

export default function Home() {
  const { session } = useSession();

  // d3 tree diagram from https://bl.ocks.org/d3noob/8375092
  /* const treeData = [
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

  update = (source) => {

    // Compute the new tree layout.
    const nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);
  
    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });
  
    // Update the nodes…
    const node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });
  
    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
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
    const nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
    nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
  
    nodeUpdate.select("text")
      .style("fill-opacity", 1);
  
    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();
  
    nodeExit.select("circle")
      .attr("r", 1e-6);
  
    nodeExit.select("text")
      .style("fill-opacity", 1e-6);
  
    // Update the links…
    let link = svg.selectAll("path.link")
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
  click = (d) => {
    if (d.children) {
    d._children = d.children;
    d.children = null;
    } else {
    d.children = d._children;
    d._children = null;
    }
    update(d);
  };

  const margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;
	
  const i = 0, duration = 750;

  const tree = d3.layout.tree()
    .size([height, width]);

  const diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  let root = treeData[0];
  root.x0 = height / 2;
  root.y0 = 0;
    
  update(root);

  d3.select(self.frameElement).style("height", "500px"); */

  let chosenPolicy = ''
  const policyTypes = [
    { value: 'permission', label: 'Permission' },
    { value: 'prohibition', label: 'Prohibition' }
  ]
  const handlePolicyType = (selectedOption) => {
    chosenPolicy = selectedOption.value;
  }
  const customStyles = {
    container: provided => ({
      ...provided,
      width: 200
    })
  };
  
  const assignObjectPaths = (obj, stack) => {
    Object.keys(obj).forEach(k => {
      const node = obj[k];
      if (typeof node === "object") {
        node.path = stack ? `${stack}.${k}` : k;
        assignObjectPaths(node, node.path);
      }
    });
  };

  assignObjectPaths(personalData);
  assignObjectPaths(purpose);

  let selectedPD = []
  const handlePersonalData = (currentNode, selectedNodes) => {
    for (var i = 0; i < selectedNodes.length; i++) {
      //var value = selectedNodes[i].value;
      var label = selectedNodes[i].label;
      selectedPD.push(label);
    }
    console.log(selectedPD);
  };

  let selectedPurpose = []
  const handlePurpose = (currentNode, selectedNodes) => {
    for (var i = 0; i < selectedNodes.length; i++) {
      //var value = selectedNodes[i].value;
      var label = selectedNodes[i].label;
      selectedPurpose.push(label);
    }
    console.log(selectedPurpose);
  };

  const access = [
    { "label": "Read" },
    { "label": "Write" },
    { "label": "Append" }
  ]
  let selectedAccess = []
  const handleAccess = (currentNode, selectedNodes) => {
    for (var i = 0; i < selectedNodes.length; i++) {
      //var value = selectedNodes[i].value;
      var label = selectedNodes[i].label;
      selectedAccess.push(label);
    }
    console.log(selectedAccess);
  };

  const inputValue = useRef();
  const generatePolicyBtn = useRef();
  const generatePolicy = () => {
    // TODO: chosenPolicy/selectedPD/selectedPurpose have to be gathered only when generatePolicy is activated
    let newPolicy = createSolidDataset();

    const dpv = "http://www.w3.org/ns/dpv#";
    const odrl = "http://www.w3.org/ns/odrl/2/";
    const oac = "https://w3id.org/oac/";

    const oacPurpose = `${oac}Purpose`;
    const odrlPolicyType = `${odrl}${chosenPolicy}`;

    let policy = createThing({name: "policy1"});
    let policyType = createThing({name: chosenPolicy+"1"});
    policy = addUrl(policy, RDF.type, ODRL.Policy);
    policy = addUrl(policy, odrlPolicyType, policyType);
    newPolicy = setThing(newPolicy, policy);

    let purposeConstraint = createThing({name: "purposeConstraint"});

    for (var i = 0; i < selectedPD.length; i++) {
      var pd = selectedPD[i];
      policyType = addUrl(policyType, ODRL.target, `${oac}${pd}`);
    }

    for (var i = 0; i < selectedAccess.length; i++) {
      var acc = selectedAccess[i];
      policyType = addUrl(policyType, ODRL.action, `${oac}${acc}`);
    }

    policyType = addUrl(policyType, ODRL.assigner, session.info.webId);
    policyType = addUrl(policyType, ODRL.constraint, purposeConstraint);
    newPolicy = setThing(newPolicy, policyType);

    purposeConstraint = addUrl(purposeConstraint, ODRL.leftOperand, oacPurpose);
    purposeConstraint = addUrl(purposeConstraint, ODRL.operator, ODRL.isA);

    for (var i = 0; i < selectedPurpose.length; i++) {
      var purp = selectedPurpose[i];
      purposeConstraint = addUrl(purposeConstraint, ODRL.rightOperand, `${dpv}${purp}`);
    }

    newPolicy = setThing(newPolicy, purposeConstraint);

    getPodUrlAll(session.info.webId).then(response => {

      if (chosenPolicy === "") {
        alert("Choose a type of policy");
      } else if (selectedPD.length < 1) {
        alert("Choose the categories of personal data of the policy");
      } else if (selectedPurpose.length < 1) {
        alert("Choose the purpose of the policy");
      } else if (selectedAccess.length < 1) {
        alert("Choose the access modes applicable to the policy");
      } else {
        const podRoot = response[0];
        const podPoliciesContainer = `${podRoot}private/odrl_policies/`;
        const filename = inputValue.current.state.value;
        filenameSave = `${podPoliciesContainer}${filename}`
        // getPolicyFilenames(podPoliciesContainer, filename, newPolicy);
        try {
          // Save the SolidDataset
          saveSolidDatasetAt(filenameSave,
              newPolicy, { fetch: fetch });
        } catch (error) {
          console.log(error);
        }
        
      }
    })
  }

  return (
    <div>
      {!session.info.isLoggedIn &&
        <div class="logged-out">
          <p>SOAP is a Solid ODRL Access Policies editor for users of Solid apps.</p>
          <p>
            It allows you to define ODRL policies, based on the <a href='https://w3id.org/oac/'>OAC specification</a>,
            to govern the access to Pod resources and to store them on your Pod.
          </p>
          <p>To get started, log in to your Pod and select the type of policy you want to model.</p>
          <p>Next, you can choose the types of personal data and purposes to which the policy applies.</p>
          <p>Finally, you can generate the ODRL policy's RDF by clicking the "Generate" button and save it in your Pod.</p>
          <p><a href='mailto:beatriz.gesteves@upm.es'>Contact Me</a></p>
        </div>
      }
      {session.info.isLoggedIn &&
        <div>
          <div class="logged-in">
              SOAP allows you to define ODRL policies, based on the <a href='https://w3id.org/oac/'>OAC specification</a>,
              to govern the access to Pod resources and to store them on your Pod.
              Select the type of policy you want to model,
              choose the types of personal data and purposes to which the policy applies,
              generate the ODRL policy's RDF and save it in your Pod by clicking on the "Generate" button.
          </div>
          <div class="container">
            <div class="">
              <p><b>Choose type of policy:</b></p>
              <Select styles={customStyles} id="policyType" label="Policy Type" options={policyTypes} onChange={handlePolicyType}></Select>
            </div>
          </div>
          <div class="container">
            <div class="">
              <p><b>Choose type of personal data:</b></p>
              <DropdownTreeSelect data={personalData} onChange={handlePersonalData} className="tree-select"/>
            </div>
          </div>
          <div class="container">
            <div class="">
              <p><b>Choose purpose:</b></p>
              <DropdownTreeSelect data={purpose} onChange={handlePurpose} className="tree-select"/>
            </div>
          </div>
          <div class="container">
            <div class="">
              <p><b>Choose applicable access modes:</b></p>
              <DropdownTreeSelect data={access} onChange={handleAccess} className="tree-select"/>
            </div>
          </div>
          <div class="container">
            <div class="">
              <p><b>Save as:</b></p>
              <Input ref={inputValue} />
            </div>
            <div class="bottom-container">
              <p><b>Generate policy:</b></p>
              <Button variant="small" value="permission" onClick={generatePolicy} ref={generatePolicyBtn}>Generate</Button>
            </div>
          </div>
        </div>        
      }
    </div>
  );
}
