const { unlink, writeFile } = require('fs').promises
const { join, extname } = require('path')
const fse = require('fs-extra')
const images = require('images')
const crypto = require('crypto')
const ffmpeg = require('fluent-ffmpeg')
const jsmediatags = require('jsmediatags')
const multiparty = require('multiparty')
const fs = require('fs');
const FileType = require('file-type');
const { catchError } = require('../util/catchAsync')
const { HEADIMG_DIR, UPLOAD_DIR, SCREENSHOT_DIR, DOMAIN, MUSICINFO } = require('../config')

// 删除文件
async function delFile(filePath) {
    if (!filePath) return
    let [_, error] = await catchError(unlink(filePath))
    if (error) console.log(error);
}

// 小文件上传，如图片，短视频 20m左右的
function uploadFile(chunk, filename) {

    // chunk的处理：转换为buffer
    chunk = decodeURIComponent(chunk);
    chunk = chunk.replace(/^data:image\/\w+;base64,/, '');
    chunk = Buffer.from(chunk, 'base64');

    //上传路径
    let filePath = join(HEADIMG_DIR, filename).replace(/\\/g, '\\\\');
    return new Promise(async (resolve, reject) => {
        let [_, error] = await catchError(writeFile(filePath, chunk))
        if (error) return reject({ 'status': -1, 'message': '上传失败' })
        resolve(new URL('headImg/' + filename, DOMAIN).href)
    })
}

//分段上传
function upload(req) {
    return new Promise((resolve, reject) => {
        const form = new multiparty.Form({ uploadDir: 'temp' })
        form.parse(req)
        form.on('file', async (name, chunk) => {
            let chunk_dir = `${UPLOAD_DIR}/${chunk.originalFilename.split('.')[0]}`
            if (!fs.existsSync(chunk_dir)) await fse.mkdirs(chunk_dir)
            var d_path = join(chunk_dir, chunk.originalFilename.split('.')[1])
            fse.move(chunk.path, d_path, { overwrite: true }, err => {
                if (err) return reject({ 'status': -1, 'message': '系统异常，稍后尝试' })
                resolve({ 'status': 200 })
            })
        })
        form.on('error', error => reject(error))
    })
}

// 文件合并
function streamMergeRecursive(chunk_path = [], fileWriteStream, chunk_dri, cb) {
    if (!chunk_path.length) {
        fileWriteStream.end()
        fse.remove(chunk_dri, (err) => {
            if (err) {
                console.log(err)
            }
        })
        cb(true)
        return
    }

    const current_file = join(chunk_dri, chunk_path.shift())

    const current_stream = fs.createReadStream(current_file)
    current_stream.pipe(fileWriteStream, { end: false })

    current_stream.on('end', () => {
        return streamMergeRecursive(chunk_path, fileWriteStream, chunk_dri, cb)
    })
    current_stream.on('error', (error) => {
        reject(error)
        fileWriteStream.close()
    })
}

// 视频封面图
function screenshot(file_url) {
    let screenshotname = `xiezy${new Date().getTime()}.jpg`
    return new Promise(resolve => {
        ffmpeg(file_url)
            .screenshots({
                count: 1,
                filename: screenshotname,
                folder: SCREENSHOT_DIR
            }).on('end', () => {
                compressImage(join(SCREENSHOT_DIR, screenshotname))
                resolve({
                    name: screenshotname,
                    folder: SCREENSHOT_DIR,
                    screenshot_path: 'screenShot/' + screenshotname
                })
            }).on('error', (err) => {
                resolve({
                    name: 'video.png',
                    folder: SCREENSHOT_DIR,
                    screenshot_path: 'screenShot/video.png'
                })
            })
    })
}

// 获取文件的MD5值
function getFileMD5(buffer) {
    return crypto.createHash('md5').update(buffer).digest('hex');
}

function getMD5(str) {
    return crypto.createHash('md5').update(str).digest('hex')
}

//获取音乐信息
function getMusicInfo(music_path) {
    return new Promise((resolve, reject) => {
        let musicInfoName = `xiezy${new Date().getTime()}.jpg`
        new jsmediatags.Reader(music_path)
            .setTagsToRead(['title', 'artist', 'picture', 'lyrics'])
            .read({
                onSuccess: function (tag) {
                    try {
                        const { data, format } = tag.tags.picture;
                        let buffer = Buffer.from(data)
                        compressImage(buffer, join(MUSICINFO, musicInfoName))
                        // fs.writeFileSync(join(MUSICINFO, musicInfoName), buffer)
                        resolve({ file_path: 'musicInfo/' + musicInfoName })
                    } catch (error) {
                        resolve({ file_path: 'musicInfo/audio.png' })
                    }
                },
                onError: function (error) {
                    reject(error)
                    console.log(':(', error.type, error.info);
                }
            })

    });
}

// 合并文件
function mergeFile(name, file_type) {
    return new Promise(async (resolve, reject) => {
        let fname = name.split('.')[0]
        let chunk_dri = join(UPLOAD_DIR, fname)
        let chunks = await fse.readdir(chunk_dri)
        let fileLastPath = join(UPLOAD_DIR, name)
        let result = await checkLocalFileExit(fileLastPath)
        if (result) {
            name = Math.random().toFixed(3) + '_' + name
            fileLastPath = join(UPLOAD_DIR, name)
        }
        let WriteStream = fs.createWriteStream(fileLastPath);
        chunks.sort((a, b) => a - b)
        streamMergeRecursive(chunks, WriteStream, chunk_dri, async a => {
            if (a) {
                resolve({
                    local_url: fileLastPath.replace(/\\/g, '\\\\'),
                    url: 'upload/' + name
                })
            }
        })
    })
}


function getFileCoverPath(file_type, local_url) {
    return new Promise(async (resolve, reject) => {
        if (file_type.includes('audio')) {
            let [{ file_path }, error] = await catchError(getMusicInfo(local_url))
            if (error) return reject({ 'status': -1, 'message': '系统异常，稍后尝试' })
            resolve(file_path)
        } else if (file_type.includes('video')) {
            let [{ screenshot_path }, screenError] = await catchError(screenshot(local_url))
            if (screenError) return reject({ 'status': -1, 'message': '系统异常，稍后尝试' })
            resolve(screenshot_path)
        } else if (file_type.includes('image')) {
            resolve('')
        }
    })
}

/* 
    检测文件是否存在
    return code 
                1 存在
                0 不存在
*/
function checkLocalFileExit(file_path) {
    return new Promise(resolve => {
        fs.access(file_path, fs.constants.F_OK, (err) => {
            if (err) return resolve(0)
            resolve(1)
        });
    })
}

// 检测文件是否上传过
function checkedFileIsLoaded({ file_type, file_id }) {
    return new Promise(async (resolve, reject) => {
        let [data, seleError] = await catchError(MysqlQuery(`SELECT COUNT(file_id) AS size FROM drive WHERE type = '${file_type}' AND file_id = '${file_id}'`))
        if (seleError) return reject({ "status": -1, "message": "系统异常，稍后尝试" })
        console.log(data[0].size);
        if (data[0].size >= 1) return resolve({ "status": 200 })
    })
}

function getRandom(min = 0, max = 0) {
    return (Math.random() * (max - min) + min)
}

function getAlterId(originName) {
    let index = originName.lastIndexOf('.')
    let fileExtname = extname(originName)
    let alter = String(Date.now()).slice(-4)
    return originName.slice(0, index) + '_' + alter + fileExtname
}

function compressImage(image, image_path) {
    let save_image_path = ''
    if (typeof image == 'string') {
        let image_type = extname(image)
        save_image_path = image
        if (image == '.png') save_image_path = image.split(image_type)[0] + '.jpg'
    } else {
        save_image_path = image_path
    }
    images(image).save(save_image_path, { quality: 50 })
}


function getFileExtname(fileName) {
    return extname(fileName).slice(1)
}

function getFileInfo(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, async function (err, stats) {
            let { size } = stats
            let fileType = await FileType.fromFile(filePath);
            console.log(fileType);
            resolve({
                size,
                ...fileType,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory()
            })
        })
    })
}

module.exports = {
    delFile,
    getMD5,
    upload,
    uploadFile,
    getAlterId,
    screenshot,
    getFileMD5,
    mergeFile,
    getFileInfo,
    getMusicInfo,
    getFileExtname,
    getFileCoverPath,
    checkedFileIsLoaded
}