/* eslint import/extensions: 0 */
import packageJson from "./package.json";

export default function getConfig() {
  return {
    defaultIdP: "https://broker.pod.inrupt.com",
    libraryRepoUrl: packageJson.repository.url,
    demoRepoUrl: packageJson.repository.url,
    copyright: "Copyright 2021 Inrupt, Inc.",
    demoTitle: "SOAP",
    demoDescription: "A Solid ODRL Access Policies editor",
  };
}
