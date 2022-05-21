const express = require('express')
const router = express.Router()
const { getShareUrl } = require('../middleware/fileShare')

router.post('/getShareUrl', function (req, res) {
    let { drive_id, file_id, type } = req.body
    getShareUrl(drive_id, file_id, type).then(data => res.send(data))
        .catch(err => res.send(err))
});

module.exports = router