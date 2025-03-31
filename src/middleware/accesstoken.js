
const config = require("../config/config")
const { auth } = require('express-oauth2-jwt-bearer');

// decode access token and use issuer and audince config
const jwtCheck = auth({
  audience: config.auth0.audience,
  issuerBaseURL: config.auth0.issuerBaseURL,
  tokenSigningAlg: config.auth0.tokenSigningAlg
});

module.exports = config.databaseType != 'aws' ? jwtCheck : (req, res, next) => { next() }