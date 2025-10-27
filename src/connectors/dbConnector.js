const mongoose = require('mongoose');
const config = require("../config/config");

const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    retryWrites: true,
    w: 'majority'
};

async function connectWithRetry(retries = 3, delayMs = 500) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            await mongoose.connect(config.dbUrl, options);
            console.log('DB Connected!');
            return;
        } catch (error) {
            console.log("Error in DB connect", error);
            if (attempt < retries) {
                await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
                continue;
            }
            throw error;
        }
    }
}

connectWithRetry().catch(() => {});

module.exports = mongoose