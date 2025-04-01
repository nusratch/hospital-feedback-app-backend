
const feedbackReqDB = require('../db/feedback/feedback.db.proccessor');
const userDB = require('../db/user/user.db.proccessor');

class feedbackService {
    constructor() {
        this.feedbackReqDb = new feedbackReqDB()
        this.userDB = new userDB()
    }

    async feedback(feedbackData) {
        try {

            const userData = await this.userDB.get(feedbackData.uid);
            if (!userData) throw { httpCode: 404, code: 'user-not-found', message: `Invalid User` }

            const dbFeedbackData = (await this.feedbackReqDb.getByquery({ uid: feedbackData.uid }))?.[0];

            if (dbFeedbackData) {
                const findRequest = dbFeedbackData.feedback.find((item) => item.userToken == feedbackData.userToken);

                if (findRequest) throw { httpCode: 400, code: 'request-already-found', message: `Feedback is already submited` };

                dbFeedbackData.feedback.push(
                    {
                        userToken: feedbackData.userToken,
                        message: feedbackData.userToken,
                        // typePositive: ''

                    }
                );

                await this.feedbackReqDb.update(dbFeedbackData._id, { feedback: dbFeedbackData.feedback });
            } else {

                let newFeedBackData = {
                    uid: feedbackData.uid,
                    feedback: [
                        {
                            userToken: feedbackData.userToken,
                            message: feedbackData.userToken,
                            // typePositive: ''

                        }
                    ]
                };
                await this.feedbackReqDb.create(newFeedBackData)
            };

            return { message: 'Thank you for your feedback' };

        } catch (error) {
            throw error
        }
    }

    async feedbackList(data) {
        try {
            const dbFeedbackData = (await this.feedbackReqDb.getByquery({ uid: data.uid }))?.[0];
            return { uid: data.uid, feedback: dbFeedbackData?.feedback || [] }

        } catch (error) {
            throw error
        }
    }
}

module.exports = feedbackService;