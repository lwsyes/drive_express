var express = require('express');
var router = express.Router();
const { getYiYan } = require('../middleware/fileShare')
let writeFile = require('../util/writeFile')
router.get('/getYiyan', function (req, res) {
    getYiYan().then(data => {
        res.send(data)
        writeFile(data)
    }).catch(err => res.send(err))
})


module.exports = router