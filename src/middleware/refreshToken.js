const Config = require('../config/config');
const userDB = require('../db/user/user.db.proccessor');
const authorityDB = require('../db/authority/mongo.db.authority');
const JWT = require('jsonwebtoken');
const { refreshToken } = require('../util/util');

module.exports = async (request, response, next) => {
  try {
    const refreshtoken = request.headers['authorization']?.split(' ')[1]
    if (!refreshtoken) return response.status(404).send({ code: "refreshtoken required in headers" });
    const refreshTokenDecoded = JWT.decode(refreshtoken);
    const secret = refreshTokenDecoded.role === 'user' ? Config.jwt.user.secret : Config.jwt.authority.secret
    JWT.verify(refreshtoken, secret);
    
     let userData;
    if(refreshTokenDecoded.role === 'user') {
      const userDatabase = new userDB();
      userData = await userDatabase.get(refreshTokenDecoded.uid);
    }
    if(refreshTokenDecoded.role !== 'user') {
      // const authorityDatabase = new authorityDB();
      userData = await authorityDB.get(refreshTokenDecoded.uid);
    }
    
    
      console.log(refreshTokenDecoded)
    // const userData = await userDatabase.get(refreshTokenDecoded.uid);

    console.log(userData)


    if (!userData) return response.status(404).send({ code: "Invalid-refresh-Token" })

    const authTokens = refreshToken({ uid: refreshTokenDecoded.uid, role: refreshTokenDecoded.role }, refreshtoken);

    return response.status(200).send(authTokens);

  } catch (error) {
    console.error(`-- error in verifyrefreshToken in refresh token service: ` + error.stack)
    switch (error.message) {
      case 'invalid token':
      case 'jwt expired':
      case 'jwt malformed':
      case 'jwt not active':
      case 'jwt signature is required':
      case 'invalid signature':
      case 'invalid algorithm':
        console.error(error.message);
        return response.status(401).send({ code: "Invalid-refresh-Token" })
      default:
        return response.status(401).send({ code: "Invalid-refresh-Token" })
    }
  }
}