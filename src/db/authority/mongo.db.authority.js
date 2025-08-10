const Authority = require('../../modal/authorityModal');
const { errorHandler } = require('../../util/errorHandling');

class AuthorityDB {

    static async createAuthority(authorityData) {
        // authorityData = {
        //     "name": "Dr. Nusrat Ali",
        //     "email": "DR.DIRECTOR@HOSPITAL.COM",
        //     "phoneNumber": "9876543210",
        //     "department": "Doctor",
        //     "createdBy": "68752409e60ae16407fd24dc",
        //     "updatedBy": "68752409e60ae16407fd24dc",
        //     "isActive": true,
        //     "role": ["super_admin"],
        //     "otpData": {
        //         "countryCode": "+91",
        //         "otp": "123456",
        //         "createdAt": "2025-07-29T12:00:00.000Z",
        //         "updatedAt": "2025-07-29T12:00:00.000Z"
        //     }
        // };
        const authority = new Authority(authorityData);
        return await authority.save();
    }


    static async getByQuery(query) {
        return await Authority.find(query);
    }

    static async getAuthorityById(id, filter = { isActive: true }) {
        try {
            return await Authority.findById(id, filter).populate('createdBy updatedBy', 'name email');
        } catch (error) {
            throw errorHandler(error, 'Error fetching authority by ID');
        }
    }

    static async getAllAuthorities(filter = { isActive: true }) {
        try {
            return await Authority.find(filter)
                .populate('createdBy updatedBy', 'name email department role')
                .sort({ createdAt: -1 });
        } catch (error) {
            throw errorHandler(error, 'Error fetching authorities');
        }
    }

    static async updateAuthority(id, updateData) {
        try {
            return await Authority.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate('updatedBy', 'name email');
        } catch (error) {
            throw error;
        }
    }

    static async deleteAuthority(id) {
        try {
            return await Authority.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );
        } catch (error) {
            throw errorHandler(error, 'Error deleting authority');
        }
    }
}

module.exports = AuthorityDB;
