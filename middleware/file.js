const { catchError } = require('../util/catchAsync')
const MysqlQuery = require('../mysql')
const { format } = require('../util/date')
const { uploadFile, mergeFile, getMD5, getAlterId, getFileInfo,
    getFileCoverPath, createFileHashMD5 } = require('../util/file')
const { DOMAIN } = require('../config')

module.exports = {
    getFileList(drive_id, limit, page, parent_file_id) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !limit || !page || !parent_file_id) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `select file_id,file_name,parent_file_id,parent_folder,type,file_size,isCollection,download_url,cover_url,created_at,updated_at from drive where drive_id='${drive_id}' and parent_file_id='${parent_file_id}' LIMIT ${(page - 1) * limit},${page * limit}`
            let [data, error] = await catchError(MysqlQuery(sql))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "获取成功", "fileList": data, DOMAIN })
        })
    },
    upload_action({ file_name, drive_id, file_id, parent_file_id = 'root', parent_folder }) {
        return new Promise(async (resolve, reject) => {
            let created_at = format("YYYY-MM-DD hh:mm:ss");
            let updated_at = created_at
            if (!drive_id || !file_name || !parent_file_id || !parent_folder || !file_id || !created_at || !updated_at) return reject({ "status": -1, "message": "参数不能为空" })

            // 等待文件合并
            let [{ url, local_url }, error] = await catchError(mergeFile(file_name))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })

            // 查询当前文件夹下是否存在相同名的数据
            let { mime: file_type, size: file_size } = await getFileInfo(local_url)

            let [file_path, coverErr] = await catchError(getFileCoverPath(file_type, local_url))
            if (coverErr) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            if (!file_path) file_path = url

            let [data, queryErr] = await catchError(MysqlQuery(`select file_name from drive where drive_id = ${drive_id} and parent_file_id = '${parent_file_id}' and file_name = '${file_name}'`))
            if (queryErr) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            if (data.length > 0) file_name = getAlterId(file_name)

            // 计算文件md5值
            let [file_hash, hashErr] = await catchError(createFileHashMD5(local_url))
            if (hashErr) return reject({ "status": -1, "message": "系统异常，稍后尝试" })

            // 插入新的数据
            let sql = `insert into drive (drive_id,file_id,file_name,parent_file_id,type,created_at,updated_at,file_size,download_url,local_url,cover_url,status,parent_folder,file_hash) values (${drive_id},'${file_id}','${file_name}','${parent_file_id}','${file_type}','${created_at}','${updated_at}','${file_size}','${url}','${local_url}','${file_path}','','${parent_folder}','${file_hash}');`
            let [_, insertError] = await catchError(MysqlQuery(sql))
            if (insertError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })

            // 更新用户储存空间信息
            let [___, updateError] = await catchError(MysqlQuery(`UPDATE disk_user a,( SELECT drive_used AS used FROM disk_user WHERE drive_id = ${drive_id} ) b SET drive_used = ( b.used + ${file_size} ) WHERE a.drive_id = ${drive_id}`))
            if (updateError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "上传成功" })
        })
    },
    uploadHeadImg({ chunk, filename, drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !chunk || !filename) return reject({ "status": -1, "message": "参数不能为空" })

            // 等待文件上传成功
            let [file_path, dataError] = await catchError(uploadFile(chunk, filename))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            file_path = new URL(file_path, DOMAIN).href

            // 更新数据库数据
            let sql = `update disk_user set headImg='${file_path}' where drive_id=${drive_id}`
            let [_, updateError] = await catchError(MysqlQuery(sql))
            if (updateError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "更新成功", head_img_url: file_path })
        })
    },
    deleteFile({ drive_id, file_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !file_id) return reject({ "status": -1, "message": "参数不能为空" })

            // 查询文件所在路径及文件大小
            let [fileData, fileError] = await catchError(MysqlQuery(`select file_size,local_url from drive where drive_id=${drive_id} and file_id='${file_id}'`))
            if (fileError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })

            // 查到文件信息
            if (fileData.length) {
                let { file_size, local_url } = fileData[0]

                // 删除数据库中的数据
                let [__, deleteError] = await catchError(MysqlQuery(`delete from drive where file_id='${file_id}' and drive_id=${drive_id}`))
                if (deleteError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
                resolve({ "status": 200, "message": "删除成功" })

                // 更新删除文件后用户存储空间信息
                if (!file_size) return resolve({ "status": 200, "message": "删除成功" })
                let [_, error] = await catchError(MysqlQuery(`UPDATE disk_user a,( SELECT drive_used AS used FROM disk_user WHERE drive_id = ${drive_id} ) b SET drive_used = ( b.used - ${file_size} ) WHERE a.drive_id = ${drive_id}`))
                if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })

                // 删除本地文件
                // await catchError(delFile(local_url))
            } else {
                // 删除数据库中的数据
                let [__, deleteError] = await catchError(MysqlQuery(`delete from drive where file_id='${file_id}' and drive_id=${drive_id}`))
                if (deleteError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
                resolve({ "status": 200, "message": "删除成功" })
            }
        })
    },
    usermkDir({ drive_id, parent_file_id = 'root', file_id, filename }) {
        return new Promise(async (resolve, reject) => {
            let created_at = format("YYYY-MM-DD hh:mm:ss");
            let updated_at = created_at
            let type = 'folder'
            if (!drive_id || !file_id || !filename || !type || !created_at || !updated_at) return reject({ "status": -1, "message": "参数不能为空" })

            // 数据库增加数据
            let sql = `insert into drive (drive_id,file_id,file_name,parent_file_id,type,created_at,updated_at) values (${drive_id},'${file_id}','${filename}','${parent_file_id}','${type}','${created_at}','${updated_at}');`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "创建成功", data })
        })
    },
    moveFile({ drive_id, parent_file_id, file_id, parent_folder }) {
        return new Promise(async (resolve, reject) => {
            let updated_at = format("YYYY-MM-DD hh:mm:ss");
            if (!drive_id || !parent_file_id || !updated_at || !file_id || !parent_folder) return reject({ "status": -1, "message": "参数不能为空" })

            // 更新数据库对应文件的存储路径
            let sql = `update drive set parent_file_id='${parent_file_id}',updated_at='${updated_at}',parent_folder='${parent_folder}' where drive_id=${drive_id} and file_id='${file_id}'`
            let [_, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "修改成功" })
        })
    },
    getUserUsedDrive(drive_id) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })

            // 获取用户已使用的空间大小
            let sql = `select drive_used,drive_size from disk_user where drive_id = ${drive_id}`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data })
        })
    },
    searchFile({ searchWord, drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !searchWord) return reject({ "status": -1, "message": "参数不能为空" })

            // 搜索文件
            let sql = `select * from drive where file_name like '%${searchWord}%' and drive_id=${drive_id}`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data })
        })
    },
    searchFolder({ drive_id, parent_file_id = 'root' }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })

            // 搜索文件夹
            let sql = `select * from drive where drive_id=${drive_id} and type='folder' and parent_file_id='${parent_file_id}'`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data })
        })
    },
    searchCollection({ drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })

            // 查看收藏内容
            let sql = `select file_id,file_name,parent_file_id,type,file_size,download_url,cover_url,created_at,updated_at from drive where drive_id='${drive_id}' and isCollection='1'`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data })
        })
    },
    setCollection({ drive_id, file_id, isCollection }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !file_id) return reject({ "status": -1, "message": "参数不能为空" })

            // 设置收藏
            let sql = `update drive set isCollection='${isCollection}' where drive_id=${drive_id} and file_id='${file_id}'`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "成功收藏", data })
        })
    },
    getPhoto({ drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })

            // 获取所有图片
            let sql = `select file_id,file_name,parent_file_id,type,file_size,isCollection,download_url,cover_url,created_at,updated_at from drive where drive_id='${drive_id}' and type like 'image%'`
            let [data, dataError] = await catchError(MysqlQuery(sql))
            if (dataError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "查询成功", data, DOMAIN })
        })
    },
    modifyFile({ drive_id, file_id, filename, type }) {
        return new Promise(async (resolve, reject) => {
            let updated_at = format("YYYY-MM-DD hh:mm:ss");
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

            // 获取文件下载地址
            let sql = `SELECT download_url FROM drive WHERE drive_id = ${drive_id} AND file_id = '${file_id}'`
            let [data, error] = await catchError(MysqlQuery(sql))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "sucess", download_url: new URL(data[0].download_url, DOMAIN) })
        })
    },
    getFileTotal({ drive_id }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id) return reject({ "status": -1, "message": "参数不能为空" })

            // 获取文件数量
            let sql = `SELECT COUNT(*) AS total FROM drive WHERE drive_id = ${drive_id}`
            let [data, error] = await catchError(MysqlQuery(sql))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, "message": "获取成功", total: data[0].total })
        })
    },
    fileIsLoaded({ drive_id, file_hash }) {
        return new Promise(async (resolve, reject) => {
            if (!drive_id || !file_hash) return reject({ "status": -1, "message": "参数不能为空" })
            let sql = `SELECT * FROM drive WHERE drive_id = ${drive_id} AND file_hash = '${file_hash}'`
            let [data, error] = await catchError(MysqlQuery(sql))
            if (error) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
            resolve({ "status": 200, isLoaded: true })
        })
    }
}