import { useSession } from "@inrupt/solid-ui-react";
import ForceLayout from "./ForceLayout";

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div className="row">
      <div className="App">
        <h1>{session.info.webId}</h1>
        <ForceLayout width={400} height={330} />
      </div>
    </div>
    );
}