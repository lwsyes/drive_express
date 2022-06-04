const MysqlQuery = require('../mysql')
const { sign } = require('../jwt')
const { map } = require('../util/map')
const { DEFAULT_AVATAR } = require('../config')
const { catchError } = require('../util/catchAsync')


function queryIsRegistered(username) {
    let sql = `select username from disk_user where username='${username}'`
    return new Promise((resolve, reject) => {
        MysqlQuery(sql).then(data => {
            data?.length && resolve(true)
            resolve(false)
        }).catch(err => reject(err))
    })
}
module.exports = {
    userLogin(username, password) {
        return new Promise(async (resolve, reject) => {
            if (!username || !password) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select username from disk_user where username='${username}' and password='${password}'`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            if (data && data.length >= 1) {
                let [token, tokenError] = await catchError(sign({ username, date: Date.now() }, '1d'))
                if (tokenError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
                resolve({ "status": 200, "message": "登录成功", token })
            } else {
                reject({ "status": -1, "message": "用户名或密码不正确！" })
            }
        })
    },
    userRegister(username, password, nickname, yanzhengma) {
        return new Promise(async (resolve, reject) => {
            if (!username || !password || !nickname || !yanzhengma) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `insert into disk_user (username,password,nickname,headImg) values ('${username}','${password}','${nickname}','${DEFAULT_AVATAR}')`
            let user = username.split('@')[0]
            try {
                let { pwd, timer } = map.get(user)
                if (pwd !== parseInt(yanzhengma)) return reject({ "status": -1, "message": "验证码不正确或已失效" })
                // 删除验证码，清除定时器
                map.delete(user) && clearTimeout(timer)
                // 查询用户是否被注册了
                let [state, stateError] = await catchError(queryIsRegistered(username))
                if (stateError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
                if (state) return reject({ "status": -1, "message": "此用户名已被注册" })
                let [data, dataError] = await catchError(MysqlQuery(sql))
                if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
                resolve({ "status": 200, "message": "注册成功！" })
            } catch (error) {
                return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            }
        })
    },
    async insertSqlHistory(username) {
        let [data, error] = await catchError(MysqlQuery(`SELECT drive_id FROM disk_user WHERE username = '${username}'`))
        if (!username || error) return
        let drive_id = data[0].drive_id
        let sql = `INSERT INTO drive (drive_id,file_id,file_name,parent_file_id,type,created_at,updated_at,file_size,download_url,local_url,cover_url) VALUES 
        (${drive_id},'5a86359ce845759eb5b9f0a12d36a0da','share_f6f39729903c27230db89275dd30a59a.mp4','root','video/mp4','2022-05-20 22:16:12','2022-05-20 22:16:12','2402271','upload/share_f6f39729903c27230db89275dd30a59a.mp4','/www/wwwroot/drive.xiezy.top/public/upload/share_f6f39729903c27230db89275dd30a59a.mp4','screenShot/xiezy1653056172014.png'),
        (${drive_id},'01636f8a812a1fa0fcaaa1f8b0c426be','轨迹-周杰伦','root','video/mp4','2022-05-20 22:16:12','2022-05-20 22:16:12','1070923','upload/1652889896832.mp4','/www/wwwroot/drive.xiezy.top/public/upload/1652889896832.mp4','screenShot/xiezy1653040200755.png')`
        let [_, __] = await catchError(MysqlQuery(sql))
        let [___, updateError] = await catchError(MysqlQuery(`UPDATE disk_user a,( SELECT drive_used AS used FROM disk_user ) b SET drive_used = ( b.used + ${1070923 + 2402271} ) WHERE a.drive_id = ${drive_id}`))
        if (updateError) reject({ "status": -1, "message": "系统异常，稍后尝试" })
    }
}