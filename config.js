/* eslint import/extensions: 0 */
import packageJson from "./package.json";

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // Use the CDN in production and localhost for development.
  assetPrefix: isDev ? 'https://protect.oeg.fi.upm.es' : '',
}

export default () => ({
  libraryRepoUrl: packageJson.repository.url,
  demoRepoUrl: packageJson.repository.url,
  copyright: "Copyright 2021 Inrupt, Inc.",
  demoTitle: "SOAP",
  demoDescription: "A Solid ODRL Access Policies editor",
});