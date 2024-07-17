import Keycloak from 'keycloak-js'

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
  url: import.meta.env.VITE_APP_KEYCLOAK_URL,
  realm: 'master',
  clientId: 'frontend',
})

export default keycloak
