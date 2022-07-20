var express = require('express');
var router = express.Router();
const { upload, checkedFileIsLoaded } = require('../util/file')
const { getFileList, upload_action,
    uploadHeadImg, deleteFile, usermkDir,
    getUserUsedDrive, searchFile, searchCollection,
    setCollection, getPhoto, modifyFile,
    searchFolder, moveFile,
    fileIsLoaded,
    getFileTotal, getFileDownloadUrl
} = require('../middleware/file')

// 获取文件
router.get('/getFile', (req, res) => {
    let { drive_id, limit = 100, page = 1, parent_file_id = 'root' } = req.query;
    getFileList(drive_id, limit, page, parent_file_id).then(data => res.send(data))
        .catch(err => res.send(err))
});

// 上传文件
router.post('/upload', (req, res) => {
    upload(req).then(data => res.send(data))
        .catch(err => res.send(err))
});

//是否上传过
router.post('/isLoaded', (req, res) => {
    checkedFileIsLoaded(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
})

// 文件合并
router.post('/merge', async (req, res) => {
    upload_action(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
})

// 上传头像
router.post('/uploadHeadImg', function (req, res) {
    uploadHeadImg(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
})

// 删除文件
router.get('/delFile', function (req, res) {
    deleteFile(req.query).then(data => res.send(data))
        .catch(err => res.send(err))
});

// 创建文件夹
router.post('/mkdir', function (req, res) {
    usermkDir(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
});

// 重命名 在写ing
router.post('/modify', function (req, res) {
    modifyFile(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
});

// 移动
router.post('/move', function (req, res) {
    moveFile(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
});


// 获取已用的空间
router.post('/getUsedDrive', function (req, res) {
    getUserUsedDrive(req.body.drive_id).then(data => res.send(data))
        .catch(err => res.send(err))
})

// 查询文件
router.post('/search', (req, res) => {
    searchFile(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
})

// 查询文件夹
router.post('/getFolder', (req, res) => {
    searchFolder(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
})

//查询收藏文件
router.post('/getCollection', (req, res) => {
    searchCollection(req.body).then(data => res.send(data))
        .catch(err => res.send(err))

})

// 设置收藏
router.post('/setCollection', (req, res) => {
    fileIsLoaded(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
})

// 获取照片
router.post('/getPhoto', (req, res) => {
    getPhoto(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
})

router.post('/getFileTotal', (req, res) => {
    getFileTotal(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
})

router.get('/getFileDownloadUrl', (req, res) => {
    getFileDownloadUrl(req.query).then(data => res.send(data))
        .catch(err => res.send(err))
})

router.post('/getFileIsLoaded', (req, res) => {
    fileIsLoaded(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
})


module.exports = router;
