const HospitalToken = require('../../modal/hospitalTokenModal');
const { errorHandler } = require('../../util/errorHandling');
const crypto = require('crypto');

class HospitalTokenDB {

    static async createHospitalToken({ token, createdBy }) {
        console.log("::::::::::token", token, createdBy)

        const authority = new HospitalToken({ token, createdBy });
        return await authority.save();
    }

    static async get(id) {
        return await HospitalToken.findById(id)
    }

    static async getByQuery(query) {
        return await HospitalToken.find(query);
    }


    static async getAllHospitalTokens(filter = {}) {
        try {
            return await HospitalToken.find(filter)
                .sort({ createdAt: -1 });
        } catch (error) {
            throw errorHandler(error, 'Error fetching hospital tokens');
        }
    }

    static async deleteHospitalToken(id) {
        try {
            return await HospitalToken.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );
        } catch (error) {
            throw errorHandler(error, 'Error deleting HospitalToken');
        }
    }

    static generateToken(length = 10) {
        return crypto
            .randomBytes(length)
            .toString("base64") // generate random string
            .replace(/[^a-zA-Z0-9]/g, "") // remove non-alphanumeric chars
            .substring(0, length); // cut to required length
    }

    static async generateUniqueToken(length = 10) {
        let token;
        let exists = true;

        while (exists) {
            token = this.generateToken(length);
            const doc = await HospitalToken.findOne({ token }); // check in DB
            if (!doc) {
                exists = false;
            }
        }

        return token;
    }
}

module.exports = HospitalTokenDB;
