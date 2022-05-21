var express = require('express');
var router = express.Router();
const { getYiYan } = require('../middleware/fileShare')

router.get('/getYiyan', function (req, res) {
    getYiYan().then(data => res.send(data))
        .catch(err => res.send(err))
})


module.exports = router