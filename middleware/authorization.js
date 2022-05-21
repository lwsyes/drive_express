const { verify } = require('../jwt')
const { WHITE_LIST } = require('../config')

// 白名单允许跳过验证的API
function whiteFilter(currentUrl) {
    for (const value of WHITE_LIST) {
        let result = currentUrl.startsWith(value)
        if (result) return result
    }
}


module.exports = {
    async author(req, res, next) {
        let { authorization } = req.headers
        if (req.method == 'OPTIONS' || req.url.includes('/login')) {
            return next()
        }
        if (whiteFilter(req.url)) {
            if (authorization) {
                verify(authorization).then(data => {
                    req.author = data
                    next()
                })
                    .catch(() => res.sendStatus(403))
            } else {
                res.sendStatus(403)
            }
        } else {
            next()
        }
    }
}