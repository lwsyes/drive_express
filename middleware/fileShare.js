const { catchError } = require('../util/catchAsync')
const MysqlQuery = require('../mysql')
const { request } = require('https')
const { EVERY_DAY_WORD } = require('../config')

module.exports = {
    getShareUrl(drive_id, file_id, type) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !file_id || !type) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select download_url from drive where drive_id=${drive_id} and file_id='${file_id}' and type='${type}'`
            let [shareURL, error] = await catchError(MysqlQuery(sql))
            if (error || !shareURL?.length) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "获取成功", "share_url": shareURL[0].download_url })
        })
    },
    getYiYan() {
        let { hostname, port, pathname: path } = new URL(EVERY_DAY_WORD)
        const options = { hostname, port, path, method: 'GET' };
        return new Promise((resolve, reject) => {
            const req = request(options, res => {
                if (res.statusCode !== 200) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
                let chunk = []
                res.on('data', (d) => {
                    chunk.push(d)
                });
                res.on('error', (e) => {
                    reject({ "status": -1, "message": "系统异常，稍后尝试" })
                });
                res.on('end', () => {
                    resolve(chunk.toString())
                })
            });
            req.end();
        })
    }
}