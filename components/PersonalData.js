import { useSession } from "@inrupt/solid-ui-react";
// import ForceLayout from "./ForceLayout";
import dynamic from "next/dynamic";

const ForceLayout = dynamic(() => import("../components/ForceLayout"), {
  ssr: false,
});

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div className="row">
      <div className="App">
        <h1>{session.info.webId}</h1>
        <ForceLayout />
        {/* <ForceLayout width={400} height={330} /> */}
      </div>
    </div>
  );
}
