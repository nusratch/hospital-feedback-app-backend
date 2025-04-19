const feedbackReqDB = require('../db/feedback/feedback.db.proccessor');


class dmssService {
    constructor() {
        this.feedbackReqDb = new feedbackReqDB()
        // Define authorities responsible for each field
        this.fieldAuthorities = {
            'doctorBehavior': 'medical_director',
            'nursingStaff': 'nursing_head',
            'waitingTime': 'operations_manager',
            'cleanliness': 'housekeeping_manager',
            'foodQuality': 'catering_manager',
            'medicationAvailability': 'pharmacy_head',
            'registrationProcess': 'front_desk_manager',
            'hospitalFacilities': 'facilities_manager',
            'costOfTreatment': 'finance_manager',
            'overallExperience': 'hospital_administrator'
        };
    }

    async dmss(dmssData, uid, hospitalToken) {
        try {
            // Extract relevant data from the input
            const { feedbackType, problematicFields, averageRating, commentSentiment } = dmssData;

            let responseMessage = '';
            let notificationsToSend = [];

            // Handle positive feedback
            if (feedbackType === 'positive') {
                responseMessage = "Thank you for your valuable feedback. We appreciate your positive review of our services.";

                // Check if there are still problematic fields despite positive overall feedback
                if (problematicFields && problematicFields.length > 0) {
                    responseMessage += ` However, we've noted concerns about ${this.formatFieldsList(problematicFields)}. We'll work on improving these areas.`;

                    // Create notifications for respective authorities
                    notificationsToSend = this.createNotifications(problematicFields, averageRating, commentSentiment);
                }
            }
            // Handle negative feedback
            else if (feedbackType === 'negative') {
                // Create apologetic response mentioning the problematic fields
                responseMessage = `We sincerely regret that your experience was not satisfactory. We apologize for the issues you encountered with ${this.formatFieldsList(problematicFields)}. We'll take immediate steps to address these concerns and improve our services.`;

                // Create notifications for respective authorities
                notificationsToSend = this.createNotifications(problematicFields, averageRating, commentSentiment);
            }

            // Send notifications to respective authorities
            await this.sendNotifications(notificationsToSend);

            // Store feedback data in database
            await this.storeFeedbackData(dmssData, responseMessage, notificationsToSend, uid, hospitalToken);

            return {
                message: responseMessage,
                notificationsSent: notificationsToSend.length,
                status: 'success'
            };

        } catch (error) {
            console.error('Error in DMSS processing:', error);
            return false;
        }
    }

    // Format list of fields for readable output
    formatFieldsList(fields) {
        if (!fields || fields.length === 0) return '';

        if (fields.length === 1) {
            return this.formatFieldName(fields[0]);
        }

        const lastField = fields.pop();
        const formattedFields = fields.map(field => this.formatFieldName(field));
        return `${formattedFields.join(', ')} and ${this.formatFieldName(lastField)}`;
    }

    // Format field name for readability (convert camelCase to spaces)
    formatFieldName(field) {
        return field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }

    // Create notification messages for each authority
    createNotifications(problematicFields, rating, sentiment) {
        const notifications = [];

        problematicFields.forEach(field => {
            if (this.fieldAuthorities[field]) {
                const authority = this.fieldAuthorities[field];
                const sentimentScore = sentiment?.vader?.compound || 0;
                const urgencyLevel = this.calculateUrgency(rating, sentimentScore);

                notifications.push({
                    authority,
                    field,
                    message: `[${urgencyLevel}] Action required: Feedback indicates issues with ${this.formatFieldName(field)}. Average rating: ${rating}/5. Please review and take appropriate action.`,
                    urgency: urgencyLevel
                });
            }
        });

        return notifications;
    }

    // Calculate urgency based on rating and sentiment
    calculateUrgency(rating, sentimentScore) {
        if (rating <= 1 || sentimentScore < -0.6) return 'HIGH';
        if (rating <= 2 || sentimentScore < -0.3) return 'MEDIUM';
        return 'LOW';
    }

    // Send notifications to respective authorities
    async sendNotifications(notifications) {
        // In a real implementation, this would send emails, SMS, or push notifications
        // For now, we'll just log the notifications
        for (const notification of notifications) {
            console.log(`Sending notification to ${notification.authority}: ${notification.message}`);
            // Here you would call your notification service
            // await notificationService.send(notification.authority, notification.message, notification.urgency);
        }
        return true;
    }

    // Store feedback data and response in database
    async storeFeedbackData(dmssData, response, notifications, uid, hospitalToken) {
        // Store the feedback data, response, and notification info in the database
        // This is a placeholder for the actual database operation
        const feedbackRecord = {
            originalFeedback: dmssData,
            systemResponse: response,
            notificationsSent: notifications,
            timestamp: new Date()
        };

        // In a real implementation, you would save this to your database
        // await this.signUpReqDb.storeFeedback(feedbackRecord);
        console.log('Feedback data stored:', feedbackRecord);

        const dbFeedbackData = (await this.feedbackReqDb.getByquery({ uid: uid }))?.[0];

        if (dbFeedbackData) {
            const index = dbFeedbackData.feedback.findIndex((item) => item.hospitalToken == hospitalToken);

            if (!(index > -1)) throw { httpCode: 400, code: 'request-not-found', message: `Feedback request not found` };

            dbFeedbackData.feedback[index] = {
                ...dbFeedbackData.feedback[index],
                dssmData: feedbackRecord
            };

            await this.feedbackReqDb.update(dbFeedbackData._id, { feedback: dbFeedbackData.feedback });
        } else {
            throw { httpCode: 400, code: 'request-not-found', message: `Feedback request not found` };
        }

        return true;
    }
}



module.exports = dmssService;