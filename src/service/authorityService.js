const AuthorityDB = require('../db/authority/mongo.db.authority');
const util = require('../util/util');
const { sendOTP } = require('./smsService');
const { sendEmail } = require('./mailService');
const { generateOtpEmail } = require('../templates/otpMail');
const feedbackReqDB = require('../db/feedback/feedback.db.proccessor');
const { areAllNotificationsResolved } = require('../util/util');
const HospitalTokenDB = require('../db/hospital-token/mongo.db.hostpital-token');
const { dateFormat } = require('../util/util');

class AuthorityService {
    constructor() {
        this.authorityDB = AuthorityDB;
        this.feedbackReqDb = new feedbackReqDB()

    }

    async createAuthority(authorityData) {
        try {

            const isExist = await this.authorityDB.getByQuery({ email: authorityData.email });

            if (isExist?.length) return ({
                success: false,
                message: `${authorityData.email} email is already exist`
            })

            const authority = await this.authorityDB.createAuthority(authorityData);

            const groupedAuthorities = {
                [authority.role]: {
                    name: authority.name,
                    email: authority.email,
                    phoneNumber: authority.phoneNumber,
                    department: authority.department,
                    role: authority.role.toString(),
                }
            }
            return {
                success: true,
                data: groupedAuthorities,
                message: 'Authority created successfully'
            };
        } catch (error) {
            throw error;

        }
    }

    async getAuthority(id) {
        try {
            const authority = await this.authorityDB.getAuthorityById(id, { isActive: true });
            if (!authority) {
                throw { httpCode: 404, message: 'Authority not found' };
            }
            const groupedAuthorities = {
                [authority.role]: {
                    name: authority.name,
                    email: authority.email,
                    phoneNumber: authority.phoneNumber,
                    department: authority.department,
                    role: authority.role.toString(),
                }
            }
            return {
                success: true,
                data: groupedAuthorities
            };
        } catch (error) {
            throw error;

        }
    }

    async getAllAuthorities(filter = {}) {
        try {
            const authorities = await this.authorityDB.getAllAuthorities({ ...filter });
            const groupedAuthorities = authorities.reduce((acc, authority) => {
                return {
                    ...acc,
                    [authority.role]: {
                        name: authority.name,
                        email: authority.email,
                        phoneNumber: authority.phoneNumber,
                        department: authority.department,
                        role: authority.role.toString(),
                    }
                }
            }, {})

            return {
                success: true,
                data: groupedAuthorities
            };
        } catch (error) {
            throw error;
        }
    }

    async updateAuthority(id, updateData) {
        try {
            if (updateData.role) {
                updateData.role = [updateData.role]
            };

            const isExistRecord = (await this.authorityDB.getByQuery({ role: id }))[0];
            if (!isExistRecord) return ({
                success: false,
                message: `${updateData.role} role is not exist`
            });

            const isExist = await this.authorityDB.getByQuery({ email: updateData.email });

            if (isExist?.length && isExist[0].email !== updateData.email) return ({
                success: false,
                message: `${updateData.email} email is already exist`
            });

            const isExistPhoneNumber = await this.authorityDB.getByQuery({ phoneNumber: updateData.phoneNumber });
            if (isExistPhoneNumber?.length && isExistPhoneNumber[0].phoneNumber !== updateData.phoneNumber) return ({
                success: false,
                message: `${updateData.phoneNumber} phoneNumber is already exist`
            });

            const authority = await this.authorityDB.updateAuthority(isExistRecord._id, updateData);
            if (!authority) {
                throw { httpCode: 404, message: 'Authority not found' };
            }

            const groupedAuthorities = {
                [authority.role]: {
                    name: authority.name,
                    email: authority.email,
                    phoneNumber: authority.phoneNumber,
                    department: authority.department,
                    role: authority.role.toString(),
                }
            }
            return {
                success: true,
                data: groupedAuthorities,
                message: 'Authority updated successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteAuthority(id) {
        try {
            const authority = await this.authorityDB.deleteAuthority(id);
            if (!authority) {
                throw { httpCode: 404, message: 'Authority not found' };
            }
            return {
                success: true,
                message: 'Authority deleted successfully'
            };
        } catch (error) {
            throw error;
        }
    }


    async userLogin(loginData) {
        try {
            let userData
            // TODO: convert email to lower case before db call 
            if (loginData.email) {
                userData = (await this.authorityDB.getByQuery({ email: loginData.email }))?.[0]
            } else if (loginData.phoneNumber) {
                userData = (await this.authorityDB.getByQuery({ phoneNumber: loginData.phoneNumber }))?.[0];
            }
            if (!userData) throw { httpCode: 404, code: 'user-not-found', message: loginData.email ? `This email ${loginData.email}  does not exist` : `This phoneNumber ${loginData.phoneNumber} does not exist` }

            if (loginData.otp !== userData?.otpData?.otp) {
                throw { httpCode: 400, code: 'invalide-otp', message: `Invalid otp` }
            };

            await this.authorityDB.updateAuthority(userData._id, { otpData: null })
            return util.responseFormate(userData);
        } catch (error) {
            throw error
        }
    }

    async signUp(signUpData) {
        try {
            let querData = {}
            if (signUpData.email) {
                querData = { email: signUpData.email }
            } else if (signUpData.phoneNumber) {
                querData = { phoneNumber: signUpData.phoneNumber }
            }

            const userData = (await this.authorityDB.getByQuery(querData))?.[0];
            const otpData = util.generateOTP(signUpData)
            if (userData) {
                await this.authorityDB.updateAuthority(userData._id, { otpData: otpData })
            } else {
                throw { httpCode: 400, code: 'invalide-user', message: `Invalid user` }
            }

            const otpOptions = [];

            if (signUpData.phoneNumber) otpOptions.push(sendOTP(signUpData.countryCode || '+880' + signUpData.phoneNumber, 'login'));
            if (signUpData.email) {
                otpOptions.push(sendEmail({
                    to: signUpData.email,
                    subject: "Login OTP",
                    text: 'Login Otp',
                    html: generateOtpEmail('login', { otpCode: otpData.otp }),
                }))
            }
            await Promise.all(otpOptions)
            return { message: 'Do Register with your otp' };
        } catch (error) {
            throw error
        }
    }

    async updateUser(uid, userData) {
        try {
            // TODO: convert email to lower case before db call 
            const emailData = userData.email && (await this.authorityDB.getByQuery({ email: userData.email }))?.[0]
            if (emailData && emailData.email) {
                if (userData.email != emailData.email) {
                    throw { code: 'duplicate-email', message: `This email is already exist ${userData.email}` }
                } else if (userData.email === emailData.email) {
                    delete userData.email;
                }
            }
            const phoneData = userData.phoneNumber && (await this.authorityDB.getByQuery({ phoneNumber: userData.phoneNumber }))?.[0]
            if (phoneData && phoneData.phoneNumber) {
                if (phoneData.phoneNumber != userData.phoneNumber) {
                    throw { code: 'duplicate-phones-number', message: `This phoneNumber is already exist ${userData.phoneNumber}` }
                } else if (phoneData.phoneNumber === userData.phoneNumber) {
                    delete userData.phoneNumber;
                }
            }

            const updateData = {
                countryCode: userData.countryCode,
                phoneNumber: userData.phoneNumber,
                email: userData.email,
                name: userData.name
            }
            await this.authorityDB.update(uid, JSON.parse(JSON.stringify(updateData)));
            const user = await this.authorityDB.get(uid)
            return util.responseFormate(user);
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async feedbackList(uid) {
        try {
            const result = await this.feedbackReqDb.getByquery({
                "feedback.dssmData.notificationsSent.authority": uid,
                // "feedback.status": "pending"
            });
            const formattedResult = result.map(this.formatFeedbackResponse);
            return formattedResult;
        } catch (error) {
            console.log("::::::::::error2", error)
            throw error;
        }
    }

    formatFeedbackResponse(data) {
        const notification = data.feedback?.dssmData?.notificationsSent?.[0] || {};
        const field = notification.field || '';
        const rating = data.feedback?.dssmData?.originalFeedback?.averageRating || 0;
        const urgency = notification.urgency || 'LOW';

        // Utility to format field name nicely
        const formatFieldName = (name) => {
            if (!name) return '';
            return name.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
        };

        return {
            id: data._id || '',
            authority: notification.authority || '',
            field: field,
            rating: rating,
            message: `[${urgency}] Action required: Feedback indicates issues with ${formatFieldName(field)}. Average rating: ${rating.toFixed(1)}/5. Please review and take appropriate action.`,
            urgency: urgency,
            submittedAt: data.createAt,
            hospitalName: 'City General Hospital',
            status: data.reviewers instanceof Map
                ? data.reviewers.get(notification.authority)?.status || data.feedback?.status || ''
                : data.reviewers?.[notification.authority]?.status || data.feedback?.status || ''
        };
    }

    async updateFeedbackStatus(feedbackId, updateData) {
        try {
            const feedbackData = (await this.feedbackReqDb.getByquery({ _id: feedbackId }))?.[0];
            if (!feedbackData) {
                throw { httpCode: 404, message: 'Feedback not found' };
            }

            const feedbaackStatusData = {
                [`reviewers.${updateData.reviewerRole}`]: {
                    status: updateData.status,
                    reviewerId: updateData.reviewerId,
                },
            };

            if (feedbackData?.feedback?.status == 'pending') {
                feedbaackStatusData['feedback.status'] = 'in_progress';
            }
            await this.feedbackReqDb.update(feedbackId, feedbaackStatusData);

            const UpdatedFeedbackdata = (await this.feedbackReqDb.getByquery({ _id: feedbackId }))?.[0];
            const isFeedResolved = areAllNotificationsResolved(UpdatedFeedbackdata);
            if (isFeedResolved) {
                await this.feedbackReqDb.update(feedbackId, { ['feedback.status']: 'resolved' });
                // mailService.sendEmail({
                //     to: UpdatedFeedbackdata.email,
                //     subject: "Feedback Status Updated",
                //     text: 'Feedback Status Updated',
                //     html: generateOtpEmail('login', { otpCode: UpdatedFeedbackdata.otp }),
                // })
            }
            return {
                success: true,
                message: 'Feedback status updated successfully'
            };
        } catch (error) {
            console.log("::::::::::error", error)
            throw error;
        }
    }

    async addToken(createdBy) {
        try {
            const token = await HospitalTokenDB.generateUniqueToken(6);
            await HospitalTokenDB.createHospitalToken({ token, createdBy });
            return {
                success: true,
                message: 'Token added successfully',
                token
            };
        } catch (error) {
            throw error;
        }
    }

    async getAllToken() {
        try {
            const tokens = await HospitalTokenDB.getAllHospitalTokens();
            return {
                success: true,
                data: tokens
            };
        } catch (error) {
            throw error;
        }
    }

    async feedbackCount() {
        try {
            const dbFeedbackData = await this.feedbackReqDb.getByquery({});

            const formattedData = dbFeedbackData.map((item) => {
                return {
                    id: item._id,
                    hospitalToken: item.feedback.hospitalToken,
                    averageRating: item.feedback.ratings.averageRating,
                    createAt: dateFormat(item.createAt),
                    feedbackType: item.feedback?.dssmData?.originalFeedback?.feedbackType || '',
                    status: item.feedback?.status || 'pending'
                }
            })
            return {
                success: true,
                data: formattedData
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthorityService;
