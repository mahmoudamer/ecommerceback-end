const USER = require('./../models/user');
const createError = require('http-errors');


module.exports = async (req, res, next) => {
    try {
        const { authorization: token } = req.headers;
        if (!token) throw new Error('token required')
        req.user = await USER.getUserByToken(token)
        next();
    } catch (err) {
        next(createError(401, 'not-authenticated'))
    }
}