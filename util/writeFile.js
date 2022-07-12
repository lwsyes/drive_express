const { appendFileSync } = require('fs')
const { join } = require('path')

module.exports = function (str) {
    appendFileSync(join(process.cwd(), 'yiyan/index.txt'), `${str}\n`, 'utf8')
}