const { catchError } = require('../util/catchAsync')
const MysqlQuery = require('../mysql')
const { uploadFile, mergeFile, delFile, getMD5 } = require('../util/file')
const { DOMAIN } = require('../config')

module.exports = {
    getFileList(drive_id, limit, page, parent_file_id) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !limit || !page || !parent_file_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select file_id,file_name,parent_file_id,type,file_size,isCollection,download_url,cover_url,created_at,updated_at from drive where drive_id='${drive_id}' and parent_file_id='${parent_file_id}' LIMIT ${(page - 1) * limit},${page * limit}`
            let [data, error] = await catchError(MysqlQuery(sql))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "获取成功", "fileList": data, DOMAIN })
        })
    },
    upload_action({ file_name, drive_id, file_id, parent_file_id = 'root', file_type, file_size, created_at, updated_at }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !file_name || !drive_id || !file_id || !file_type || !file_size || !created_at || !updated_at) return reject({ "status": -1, "message": "参数不能为空" })
            let [{ file_path, urls: { url, local_url } }, error] = await catchError(mergeFile(file_name, file_type))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            let sql = `insert into drive (drive_id,file_id,file_name,parent_file_id,type,created_at,updated_at,file_size,download_url,local_url,cover_url,status) values (${drive_id},'${file_id}','${file_name}','${parent_file_id}','${file_type}','${created_at}','${updated_at}','${file_size}','${url}','${local_url}','${file_path}','');`
            let [_, insertError] = await catchError(MysqlQuery(sql))
            if (insertError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            let [___, updateError] = await catchError(MysqlQuery(`UPDATE disk_user a,( SELECT drive_used AS used FROM disk_user ) b SET drive_used = ( b.used + ${file_size} ) WHERE a.drive_id = ${drive_id}`))
            if (updateError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "上传成功" })
        })
    },
    uploadHeadImg({ chunk, filename, drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !chunk || !filename) return reject({ "status": -1, "message": "参数不能为空" })
            let [file_path, dataError] = await catchError(uploadFile(chunk, filename))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            file_path = new URL(file_path, DOMAIN).href
            let sql = `update disk_user set headImg='${file_path}' where drive_id=${drive_id}`
            let [_, updateError] = await catchError(MysqlQuery(sql))
            if (updateError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "更新成功", head_img_url: file_path })
        })
    },
    deleteFile({ drive_id, file_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !file_id) return reject({ "status": -1, "message": "参数不能为空" })
            let [[{ file_size, local_url }], fileError] = await catchError(MysqlQuery(`select file_size,local_url from drive where drive_id=${drive_id} and file_id='${file_id}'`))
            if (fileError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            let [_, error] = await catchError(MysqlQuery(`UPDATE disk_user a,( SELECT drive_used AS used FROM disk_user ) b SET drive_used = ( b.used - ${file_size} ) WHERE a.drive_id = ${drive_id}`))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            if (!file_size) return resolve({ "status": 200, "message": "删除成功" })
            let [__, deleteError] = await catchError(MysqlQuery(`delete from drive where file_id='${file_id}' and drive_id=${drive_id}`))
            if (deleteError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "删除成功" })
            await catchError(delFile(local_url))
        })
    },
    usermkDir({ drive_id, parent_file_id = 'root', file_id, filename, type, created_at, updated_at }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !file_id || !filename || !type || !created_at || !updated_at) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `insert into drive (drive_id,file_id,file_name,parent_file_id,type,created_at,updated_at) values (${drive_id},'${file_id}','${filename}','${parent_file_id}','${type}','${created_at}','${updated_at}');`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "创建成功", data })
        })
    },
    moveFile({ drive_id, parent_file_id, updated_at, file_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !parent_file_id || !updated_at || !file_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `update drive set parent_file_id='${parent_file_id}',updated_at='${updated_at}' where drive_id=${drive_id} and file_id='${file_id}'`
            let [_, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "修改成功" })
        })
    },
    getUserUsedDrive(drive_id) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select drive_used,drive_size from disk_user where drive_id = ${drive_id}`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data })
        })
    },
    searchFile({ searchWord, drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !searchWord) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select * from drive where file_name like '%${searchWord}%' and drive_id=${drive_id}`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data })
        })
    },
    searchFolder({ drive_id, parent_file_id = 'root' }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select * from drive where drive_id=${drive_id} and type='folder' and parent_file_id='${parent_file_id}'`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data })
        })
    },
    searchCollection({ drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select file_id,file_name,parent_file_id,type,file_size,download_url,cover_url,created_at,updated_at from drive where drive_id='${drive_id}' and isCollection='1'`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data })
        })
    },
    setCollection({ drive_id, file_id, isCollection }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !file_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `update drive set isCollection='${isCollection}' where drive_id=${drive_id} and file_id='${file_id}'`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "成功收藏", data })
        })
    },
    getPhoto({ drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select file_id,file_name,parent_file_id,type,file_size,isCollection,download_url,cover_url,created_at,updated_at from drive where drive_id='${drive_id}' and type like 'image%'`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data })
        })
    },
    modifyFile({ drive_id, file_id, filename, updated_at, type }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !file_id || !filename || !updated_at || !type) return reject({ "status": -1, "message": "参数不能为空" })
            let new_file_id = getMD5(filename)
            let sql = `update drive set file_name='${filename}',updated_at='${updated_at}',file_id='${new_file_id}' where drive_id=${drive_id} and file_id='${file_id}'`
            let [_, updateError] = await catchError(MysqlQuery(sql))
            if (updateError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            if (type == 'folder') {
                let otherSql = `update drive set parent_file_id='${new_file_id}' where parent_file_id='${file_id}'`
                let [__, updateErrors] = await catchError(MysqlQuery(otherSql))
                if (updateErrors) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            }
            resolve({ "status": 200, "message": "修改成功" })
        })
    },
    getFileDownloadUrl({ file_id, drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!file_id || !drive_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `SELECT download_url FROM drive WHERE drive_id = ${drive_id} AND file_id = '${file_id}'`
            let [data, error] = await catchError(MysqlQuery(sql))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "sucess", download_url: new URL(data[0].download_url, DOMAIN) })
        })
    },
    getFileTotal({ drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `SELECT COUNT(*) AS total FROM drive WHERE drive_id = ${drive_id}`
            let [data, error] = await catchError(MysqlQuery(sql))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "获取成功", total: data[0].total })
        })
    }
}