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
    const secret = payLoad.role === 'user' ? Config.jwt.user.secret : Config.jwt.authority.secret
    const access_token = JWT.sign(payLoad, secret, { expiresIn: Config.jwt.accessTokenExpiresIn, issuer: Config.jwt.issuer });
    const refresh_token = JWT.sign(payLoad, secret, { expiresIn: Config.jwt.refreshTokenExpiresIn, issuer: Config.jwt.issuer });
    const accessTokenDecoded = JWT.decode(access_token);

    return ({
        accessToken: access_token,
        refreshToken: refresh_token,
        expirationTime: accessTokenDecoded['exp']
    });
}

function refreshToken(payLoad = {}, refreshToken = "") {
    const secret = payLoad.role === 'user' ? Config.jwt.user.secret : Config.jwt.authority.secret
    const access_token = JWT.sign(payLoad, secret, { expiresIn: Config.jwt.accessTokenExpiresIn, issuer: Config.jwt.issuer });
    const accessTokenDecoded = JWT.decode(access_token);

    return ({
        accessToken: access_token,
        refreshToken: refreshToken,
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
    if (userData.role) response.role = userData.role
    if (withToken) response.authToken = customsAuthTokens({ uid: userData._id, role: userData.role || 'user' })
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
    const now = new Date();
    let otp = signUpData?.otp;
    const lastUpdated = signUpData?.updatedAt ? new Date(signUpData.updatedAt) : null;

    const timeDiffInMs = lastUpdated ? now.getTime() - lastUpdated.getTime() : Infinity;
    const timeDiffInMinutes = timeDiffInMs / (1000 * 60);

    if (!otp || timeDiffInMinutes >= 5) {
        otp = Math.floor(100000 + Math.random() * 900000); // Generate new 6-digit OTP
    }

    return {
        otp,
        updatedAt: now
    };
}

async function httpcall(method, data, url) {
    try {
        const m = (method || 'POST').toUpperCase();
        const isBodyMethod = m !== 'GET' && m !== 'HEAD';

        const timeoutMs = 10000;
        const retries = 2;

        let lastError;
        for (let attempt = 0; attempt <= retries; attempt++) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetch(`${url}`, {
                    method: m,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: isBodyMethod ? JSON.stringify(data) : undefined,
                    signal: controller.signal
                });
                clearTimeout(timer);

                if (!response.ok) {
                    const text = await response.text().catch(() => '');
                    const error = new Error(`HTTP ${response.status} ${response.statusText} ${text}`.trim());
                    if (response.status >= 500 && attempt < retries) {
                        lastError = error;
                        await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
                        continue;
                    }
                    throw error;
                }

                return await response.json();
            } catch (error) {
                clearTimeout(timer);
                lastError = error;
                const retriable = error.name === 'AbortError' || error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET' || error.code === 'EAI_AGAIN';
                if (retriable && attempt < retries) {
                    await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
                    continue;
                }
                throw error;
            }
        }
        throw lastError;
    } catch (error) {
        console.log(error);
        throw error
    }
};

function dateFormat(mongoDate) {
    const date = mongoDate ? new Date(mongoDate) : new Date();

    const formatted = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);

    return formatted;
}

function areAllNotificationsResolved(doc) {
    if (
      !doc.feedback ||
      !doc.feedback.dssmData ||
      !Array.isArray(doc.feedback.dssmData.notificationsSent) ||
      !doc.reviewers
    ) {
      return false; // Invalid structure
    }
    return doc.feedback.dssmData.notificationsSent.every(notification => {
        const reviewerRole = notification.authority;
        const reviewerInfo = doc.reviewers.get(reviewerRole);
      return reviewerInfo && reviewerInfo.status === "resolved";
    });
  }

module.exports = {
    generatPasswordeHash,
    responseFormate,
    verifyPassword,
    generateOTP,
    httpcall,
    courseResponseFormate,
    refreshToken,
    dateFormat,
    areAllNotificationsResolved
}