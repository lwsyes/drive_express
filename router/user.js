const router = require('express').Router()
const { getUserInfo, modifyNick, getClientIP } = require('../middleware/user')


router.post('/getUserInfo', async (req, res) => {
    getUserInfo(req.author.username).then(data => res.send(data))
        .catch(err => res.send(err))
})
router.post('/modifyNick', function (req, res) {
    let { nickname, drive_id } = req.body;
    modifyNick(nickname, drive_id).then(data => res.send(data))
        .catch(err => res.send(err))
});
router.post('/getClientIP', function (req, res) {
    res.send(getClientIP(req))
})

module.exports = router