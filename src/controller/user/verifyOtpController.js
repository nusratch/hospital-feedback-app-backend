const otpService = require('../../service/otpService')

module.exports = async (req, res, next) => {
    try {
        const OtpService = new otpService();
        const { value } = req.locals
        const result = await OtpService.verifyOtp(value)
        return res.status(200).send(result)
    } catch (error) {
        console.error('error', error)
        if (error.code && error.message) {
            return res.status(error.httpCode || 500).send({ code: error.code, message: error.message })
        }
        res.status(500).send({ message: 'Internan Server error' })
    }
}