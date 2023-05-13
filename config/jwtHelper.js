const jwt = require('jsonwebtoken');
const createError = require('http-errors');
require('dotenv').config();

const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId };
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: process.env.ACCESS_TOKEN_LIFE,
            issuer: process.env.ISS,
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(createError.InternalServerError());
            }
            resolve(token);
        });
    });
}


const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId };
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: process.env.REFRESH_TOKEN_LIFE,
            issuer: process.env.ISS,
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(createError.InternalServerError());
            }
            resolve(token);
        });
    });
}

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) return reject(createError.Unauthorized());
            const accountId = payload.userId;
            resolve(accountId);
        });
    });
}

const verifyAccessToken = (accessToken) => {    
    return new Promise((resolve, reject) => {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) return reject(createError.Unauthorized());
            const accountId = payload.userId;
            resolve(accountId);
        });
    });
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessToken
};