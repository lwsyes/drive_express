const jwt = require('jsonwebtoken')
const { JWTKEY } = require('../config.js')


module.exports = {
    verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token.split(' ')[1], JWTKEY, (err, data) => {
                if (err) return reject(err.message)
                resolve(data)
            })
        })
    },
    sign(info, time = '30s') {
        return new Promise((resolve, reject) => {
            jwt.sign(info, JWTKEY, { expiresIn: time }, (err, data) => {
                if (err) return reject(err.message)

                resolve(data)
            })
        })
    }
}