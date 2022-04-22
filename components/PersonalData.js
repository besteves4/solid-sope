import { useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import DropdownTreeSelect from "react-dropdown-tree-select";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import {
  createSolidDataset,
  createThing,
  setThing,
  addUrl,
  saveSolidDatasetAt,
  getPodUrlAll,
  getSolidDataset,
  getContainedResourceUrlAll,
} from "@inrupt/solid-client";
import { RDF, ODRL } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div className="row">{session.info.webId}</div>
    );
}
