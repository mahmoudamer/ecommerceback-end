const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const saltRound = process.env.SALT_ROUND || 5;
const secretkey = process.env.SECRET_KEY || 'my-secret-key'
const tokenExpiry = process.env.TOKEN_EXPIRY || '51m';

const schema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            index: { unique: true }
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            index: { unique: true },
            validate: validator.isEmail
        }
    }, {
        collection: 'users',
        toJSON: {
            hidden: ['password', '__v'],
            transform: true
        }

    });

schema.options.toJSON.transform = function (doc, ret, options) {
    if (Array.isArray(options.hidden)) {
        options.hidden.forEach(field => {
            delete ret[field];
        })
    }
    return ret;
}

schema.method('verifyPassword', function (comparedPassword) {
    const user = this;

    return bcrypt.compare(comparedPassword, user.password);
});


schema.method('generateToken', function () {
    const user = this;
    return sign({ _id: user.id }, secretkey, { expiresIn: tokenExpiry })
});

schema.static('getUserByToken', async function (token) {

    const decoded = await verify(token, secretkey);
    const user = await USER.findById(decoded._id);
    if (!user) throw new Error('user not found')
    return user;
});


const hashPassword = password => bcrypt.hash(password, saltRound)

schema.pre('save', async function () {
    const user = this;
    if (user.isNew || user.modifiedPaths().includes('password')) {
        user.password = await hashPassword(user.password);
    }
});





const USER = mongoose.model('USER', schema);

module.exports = USER;