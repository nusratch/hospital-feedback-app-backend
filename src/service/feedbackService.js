
const feedbackReqDB = require('../db/feedback/feedback.db.proccessor');
const userDB = require('../db/user/user.db.proccessor');
const { httpcall } = require('../util/util');
const dmssService = require('./dmssService')

class feedbackService {
    constructor() {
        this.feedbackReqDb = new feedbackReqDB()
        this.userDB = new userDB()
        this.dmssService = new dmssService()
    }

    async feedback(feedbackData) {
        try {

            const userData = await this.userDB.get(feedbackData.uid);
            if (!userData) throw { httpCode: 404, code: 'user-not-found', message: `Invalid User` }

            const feedback = {
                hospitalToken: feedbackData.hospitalToken,
                additionalComments: feedbackData.ratings.additionalComments,
                ratings: {
                    doctorBehavior: feedbackData.ratings.doctorBehavior,
                    nursingStaff: feedbackData.ratings.nursingStaff,
                    waitingTime: feedbackData.ratings.waitingTime,
                    cleanliness: feedbackData.ratings.cleanliness,
                    foodQuality: feedbackData.ratings.foodQuality,
                    medicationAvailability: feedbackData.ratings.medicationAvailability,
                    registrationProcess: feedbackData.ratings.registrationProcess,
                    hospitalFacilities: feedbackData.ratings.hospitalFacilities,
                    costOfTreatment: feedbackData.ratings.costOfTreatment,
                    overallExperience: feedbackData.ratings.overallExperience,
                    averageRating: feedbackData.ratings.averageRating,
                },
            };

            const dbFeedbackData = (await this.feedbackReqDb.getByquery({ uid: feedbackData.uid }))?.[0];


            if (dbFeedbackData) {
                const findRequest = dbFeedbackData.feedback.find((item) => item.hospitalToken == feedbackData.hospitalToken);

                if (findRequest) throw { httpCode: 400, code: 'request-already-found', message: `Feedback is already submited` };

                dbFeedbackData.feedback.push(feedback);

                await this.feedbackReqDb.update(dbFeedbackData._id, { feedback: dbFeedbackData.feedback });
            } else {

                let newFeedBackData = {
                    uid: feedbackData.uid,
                    feedback: [feedback]
                };

                await this.feedbackReqDb.create(newFeedBackData)
            };

            const predictData = {
                additionalComments: feedback.additionalComments,
                ...feedback.ratings
            };

            httpcall('post', predictData, 'http://0.0.0.0:8000/api/predict').then(async (data) => {

                console.log("data for DMSS", data);

                await this.dmssService.dmss(data, feedbackData.uid, feedbackData.hospitalToken)
            });

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