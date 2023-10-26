const Keycloak = require("keycloak-connect");

const keycloakConfig = {
  realm: "your-realm-name",
  "auth-server-url": "https://your-keycloak-server/auth",
  "ssl-required": "external",
  resource: "your-client-id",
  "bearer-only": true,
};

const keycloak = new Keycloak({ store: true }, keycloakConfig);

module.exports = keycloak;
