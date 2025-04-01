const feedbackService = require('../../service/feedbackService')

module.exports = async (req, res, next) => {
    try {
        const FeedbackService = new feedbackService();
        const { value } = req.locals
        const result = await FeedbackService.feedback(value)
        return res.status(200).send(result)
    } catch (error) {
        if (error.code && error.message) {
            return res.status(400).send({ code: error.code, message: error.message })
        }
        console.error('error', error.stack)
        res.status(500).send({ message: 'Internan Server error' })
    }
}