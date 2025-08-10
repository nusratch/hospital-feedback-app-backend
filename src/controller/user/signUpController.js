const userService = require('../../service/userService');
const authorityService = require('../../service/authorityService');

module.exports = async (req, res, next) => {
    try {
        const { value } = req.locals

        if (value.role === 'authority') {
            const AuthorityService = new authorityService();
            const result = await AuthorityService.signUp(value)
            return res.status(200).send(result)
        } else {
            const UserService = new userService();
            const result = await UserService.signUp(value)
            return res.status(200).send(result)
        }

    } catch (error) {
        if (error.code && error.message) {
            return res.status(error.httpCode || 500).send({ code: error.code, message: error.message })
        }
        console.error('error', error.stack)
        res.status(500).send({ message: 'Internan Server error' })
    }
}