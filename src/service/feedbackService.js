
const feedbackReqDB = require('../db/feedback/feedback.db.proccessor');
const userDB = require('../db/user/user.db.proccessor');
const { httpcall, dateFormat } = require('../util/util');
const dmssService = require('./dmssService')
const HospitalTokenDB = require('../db/hospital-token/mongo.db.hostpital-token')

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

            const hospitalTokenData = (await HospitalTokenDB.getByQuery({ token: feedbackData.hospitalToken }))[0];
            if (!hospitalTokenData) throw { httpCode: 404, code: 'hospital-token-not-found', message: `Invalid Hospital Token` }

            const feedback = {
                hospitalToken: feedbackData.hospitalToken,
                additionalComments: feedbackData.ratings.additionalComments,
                timestamp: new Date(),
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

            // const dbFeedbackData = (await this.feedbackReqDb.getByquery({
            //     uid: feedbackData.uid,
            //     feedback: {
            //         hospitalToken: feedbackData.hospitalToken
            //     }
            // }))?.[0];

            
            const dbFeedbackData = (await this.feedbackReqDb.getByquery({
                uid: feedbackData.uid,
                "feedback.hospitalToken": feedbackData.hospitalToken
            }))?.[0];


            if (dbFeedbackData) {
                throw { httpCode: 400, code: 'request-already-found', message: `Feedback is already submited` };

            } else {

                let newFeedBackData = {
                    uid: feedbackData.uid,
                    feedback: feedback
                };

                await this.feedbackReqDb.create(newFeedBackData)
            };

            const predictData = {
                additionalComments: feedback.additionalComments,
                ...feedback.ratings
            };

            httpcall('post', predictData, 'http://0.0.0.0:8000/api/predict').then(async (data) => {

                console.log("data for DMSS", data);

                await this.dmssService.dmss(data, userData, feedbackData.hospitalToken)
            }).catch((error) => { });

            return { message: 'Thank you for your feedback' };

        } catch (error) {
            throw error
        }
    }

    async feedbackList(data) {
        try {
            const dbFeedbackData = await this.feedbackReqDb.getByquery({ uid: data.uid });
            return {
                uid: data.uid,
                feedback: dbFeedbackData.map((item) => ({
                    id: item.feedback.hospitalToken,
                    hospitalName: 'City General Hospital',
                    averageRating: item.feedback.ratings.averageRating,
                    date: dateFormat(item.feedback.timestamp),
                    status: item.feedback.status || ''
                })) || []
            }

        } catch (error) {
            throw error
        }
    }
}

module.exports = feedbackService;