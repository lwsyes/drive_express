const { appendFile, readFile } = require('fs').promises
const { join } = require('path')
const { format } = require('./date')
const { ERROR_LOG } = require('../config')
function saveErrorLog(err) {
    let fileName = `${format("YYYY年MM月DD日")}.log`
    appendFile(join(ERROR_LOG, fileName), transformErr(err), 'utf-8')
        .catch(err => console.log(err))
}

function transformErr(err) {
    if (err instanceof Error) {
        return `${format("YYYY-MM-DD hh:mm:ss")} ${err}\n`
    } else if (typeof err == 'object') {
        return `${format("YYYY-MM-DD hh:mm:ss")} ${JSON.stringify(err)}\n`
    } else {
        return `${format("YYYY-MM-DD hh:mm:ss")} ${err}\n`
    }
}
function catchError(promise) {
    return promise.then(data => ([data, undefined]))
        .catch(err => {
            saveErrorLog(err)
            return [undefined, err]
        })
}
module.exports = {
    catchError,
    saveErrorLog
}
