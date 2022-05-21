const { catchError } = require('../util/catchAsync')
const MysqlQuery = require('../mysql')

module.exports = {
    getUserInfo(username) {
        return new Promise(async (resolve, reject) => {
            if (!username) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select * from disk_user where username = '${username}'`
            let [userInfo, userInfoError] = await catchError(MysqlQuery(sql))
            if (userInfoError) return reject({ "status": 0, "message": "发生异常！稍后尝试" })
            resolve({ "status": 200, "message": "获取成功", userInfo })
        })
    },
    modifyNick(nickname, drive_id) {
        return new Promise(async (resolve, reject) => {
            if (!nickname || !drive_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `update disk_user set nickname='${nickname}' where userId=${drive_id}`
            let [_, error] = await catchError(MysqlQuery(sql))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "修改成功" })
        })
    },
    modifyCipher({ password, username }) {
        return new Promise(async (resolve, reject) => {
            if (!password || !username) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `update disk_user set password='${password}' where username='${username}'`
            let [_, error] = await catchError(MysqlQuery(sql))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "修改成功" })
        })

    },
    /**
     * @getClientIP
     * @desc 获取用户 ip 地址
     * @param {Object} req - 请求
     */
    getClientIP(req) {

        return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress;
    }
}