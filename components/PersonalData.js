import { useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
    <div className="row">
        <DndProvider backend={HTML5Backend}>
			{session.info.webId}
		</DndProvider>
    </div>
    );
}
