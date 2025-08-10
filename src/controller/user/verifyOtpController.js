const userService = require('../../service/userService')
const authorityService = require('../../service/authorityService')
module.exports = async (req, res, next) => {
    try {
        const UserService = new userService();
        const { value } = req.locals
        if (value.role === 'authority') {
            const AuthorityService = new authorityService();
            const result = await AuthorityService.userLogin(value)
            return res.status(200).send(result)
        } else {
            const result = await UserService.userLogin(value);
            return res.status(200).send(result)
        }
    } catch (error) {
        console.error('error', error)
        if (error.code && error.message) {
            return res.status(error.httpCode || 500).send({ code: error.code, message: error.message })
        }
        res.status(500).send({ message: 'Internan Server error' })
    }
}