const mongoDb_feedbackReq = require("./mongo.db.feedback")

class signUpReqDb {

    constructor() {
        this.feedback = new mongoDb_feedbackReq()
    }

    async get(id) {
        return await this.feedback.findById(id)
    }

    async getByquery(query) {
        return await this.feedback.getByquery(query)
    }

    async create(createData) {
        return await this.feedback.create(createData)
    }

    async update(id, updateData) {

        return await this.feedback.update(id, updateData);
    }

    async delete(id) {
        return await this.feedback.delete(id);
    }
}

module.exports = signUpReqDb