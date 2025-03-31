const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const Config = require('../config/config');

function generatPasswordeHash(password, salt = null) {
    try {
        if (!salt) salt = crypto.randomBytes(16);
        salt = salt.toString('base64');
        const hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        const value = hash.digest('hex');
        return {
            salt: salt,
            hash: value
        };

    } catch (error) {
        console.error(`Error in generatPasswordeHash`, error);
    }
}

function customsAuthTokens(payLoad = {}) {
    const access_token = JWT.sign(payLoad, Config.jwt.secret, { expiresIn: Config.jwt.accessTokenExpiresIn, issuer: Config.jwt.issuer });
    const refresh_token = JWT.sign(payLoad, Config.jwt.secret, { expiresIn: Config.jwt.refreshTokenExpiresIn, issuer: Config.jwt.issuer });
    const accessTokenDecoded = JWT.decode(access_token);

    return ({
        accessToken: access_token,
        refreshToken: refresh_token,
        expirationTime: accessTokenDecoded['exp']
    });
}

function verifyPassword({ hash, salt, password }) {
    if (hash && salt) {
        const passwordDetails = generatPasswordeHash(password, salt);
        if (hash !== passwordDetails.hash) {
            return false
        }
        return true;
    }
    return false
}

function responseFormate(userData, withToken = true) {
    const response = {
        uid: userData._id,
        email: userData.email,
        countryCode: userData.countryCode,
        phoneNumber: userData.phoneNumber,
        name: userData.name,
        address: userData.address ?? {},
    }
    if (withToken) response.authToken = customsAuthTokens({ uid: userData._id })
    return response;
}

function courseResponseFormate(courseData) {
    const response = {
        courseId: courseData._id,
        name: courseData.name,
        price: courseData.price
    }
    return response;
}

function generateOTP(signUpData) {
    const otpData = {
        otp: signUpData?.otp || Math.floor(1000 + Math.random() * 9000)
    }
    if (signUpData) {
        otpData.updatedAt = new Date()
    }
    return otpData;
}

async function httpcall(method, query) {
    try {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        }
        const response = await fetch(`${Config.graphqlUrl}`, options);

        if (!response.ok && !response.statusText.Ok) {
            const data = await response.json()
            console.log("Erros", data)
            throw new Error(data.message || 'Failed to fetch data.');
        }
        const responseData = await response.json()
        return responseData.data[method];
    } catch (error) {
        throw error
    }
};

module.exports = { generatPasswordeHash, responseFormate, verifyPassword, generateOTP, httpcall, courseResponseFormate }