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
import { createSolidDataset, createThing, setThing, addUrl, saveSolidDatasetAt, getPodUrlAll } from "@inrupt/solid-client";
import { RDF, ACL, ODRL } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";

import personalData from "./personaldata.json";
import purpose from "./purpose.json";

export default function Home() {
  const { session } = useSession();

  let chosenPolicy = ''
  const policyTypes = [
    { value: 'permission', label: 'Permission' },
    { value: 'prohibition', label: 'Prohibition' }
  ]
  const handlePolicyType = (selectedOption) => {
    chosenPolicy = selectedOption.value;
  }
  
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

  let filenameSave = '';
  const generatePolicyBtn= useRef(null);
  const generatePolicy = () => {
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

    for (var i = 0; i < selectedPD.length; i++) {
      var pd = selectedPD[i];
      policyType = addUrl(policyType, ODRL.target, dpv+pd);
    }

    policyType = addUrl(policyType, ODRL.action, ACL.Read);
    policyType = addUrl(policyType, ODRL.constraint, purposeConstraint);
    newPolicy = setThing(newPolicy, policyType);

    purposeConstraint = addUrl(purposeConstraint, ODRL.leftOperand, dpvPurpose);
    purposeConstraint = addUrl(purposeConstraint, ODRL.operator, ODRL.isA);

    for (var i = 0; i < selectedPurpose.length; i++) {
      var purp = selectedPurpose[i];
      purposeConstraint = addUrl(purposeConstraint, ODRL.rightOperand, dpv+purp);
    }

    newPolicy = setThing(newPolicy, purposeConstraint);

    getPodUrlAll(session.info.webId).then(response => {
      const podRoot = response[0];
      filenameSave = `${podRoot}private/odrl_policies/${chosenPolicy}${selectedPD[0]}${selectedPurpose[0]}`;

      try {
        // Save the SolidDataset
        saveSolidDatasetAt(filenameSave,
            newPolicy, { fetch: fetch });
      } catch (error) {
        console.log(error);
      }
    })
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
            <div class="center">
              <p>Chooose type of personal data:</p>
              <DropdownTreeSelect data={personalData} onChange={handlePersonalData} className="tree-select"/>
            </div>
          </div>
          <div class="container">
            <div class="center">
              <p>Chooose purpose:</p>
              <DropdownTreeSelect data={purpose} onChange={handlePurpose} className="tree-select"/>
            </div>
          </div>
          <div class="container">
            <div class="center">
              <p>Generate policy:</p>
              <Button variant="small" value="permission" onClick={generatePolicy} ref={generatePolicyBtn}>Generate</Button>
            </div>
{/*             <div>
              <p>Saved at: {filenameSave}</p>
            </div> */}
          </div>
        </div>        
      }
    </div>
  );
}
