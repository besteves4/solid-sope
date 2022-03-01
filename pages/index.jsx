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

import Tree from "./Tree";

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
          <Tree />
        </div>        
      }
    </div>
  );
}
