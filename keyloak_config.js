var session = require("express-session");
var Keycloak = require("keycloak-connect");

let keycloak;

var keycloakConfig = {
  resource: "MicroServiceNodeJs",
  bearerOnly: true,
  "auth-server-url": "http://localhost:8080",
  realm: "MicroService",
  realmPublicKey:
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqWcRWF2SpoQF0QenkjBEEYUlziXFbbY/K2AhL+yGev9e/2cLhU5EmGxLezWE3zmQ9NmeuXqUMSFFbeA4smg/Aut9IwfOHOqv5N4aJuKz7HrWVDGQ64XNJ0Twm7MOa8sJZlOv9wfq7+ylL1nSPxAFfBGJZiH7of04V8lBuQ6cyBEK/X9mldB0v363poh1mHR8CBlJ4rGAi+mj9JQLAV/gNutss7OdnIb4nCN1m/FW+br6Rugf+rMc1yVZWnvxgpd8Rffmo2hrIOjiO9k6vrQ/935P9chwRml2Do+TsKvIFc7EM1a6jeuMHStL+rLyQkz/FU9iTSzyNW/S51F9bg0RGwIDAQAB",
};

function initKeycloak() {
  if (keycloak) {
    console.warn("Trying to init Keycloak again!");
    return _keycloak;
  } else {
    console.log("Initializing Keycloak...");
    var memoryStore = new session.MemoryStore();
    keycloak = new Keycloak(
      { store: memoryStore, secret: "any_key", resave: false },
      keycloakConfig
    );
    return keycloak;
  }
}

function getKeycloak() {
  if (!keycloak) {
    console.error(
      "Keycloak has not been initialized. Please called init first."
    );
  }
  return keycloak;
}

module.exports = {
  initKeycloak,
  
};
