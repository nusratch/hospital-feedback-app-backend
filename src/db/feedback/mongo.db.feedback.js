const feedbackReqModal = require("../../modal/feedbackReqModal")

class signUpReqDb {

    async findById(id) {
        return await feedbackReqModal.findById(id)
    }

    async getByquery(query) {
        return await feedbackReqModal.find(query)
    }
    async create(createData) {
        return await feedbackReqModal.create(createData)
    }

    async update(id, updateData) {

        return await feedbackReqModal.updateOne({ _id: id }, { $set: { ...updateData } });
    }

    async delete(id) {
        return await feedbackReqModal.deleteOne(id);
    }
}

module.exports = signUpReqDb