const router = require('express').Router()
const { userLogin, userRegister, insertSqlHistory } = require('../middleware/login')
const { modifyCipher } = require('../middleware/user')
const { sendEmail } = require('../util/email')
const { map } = require('../util/map')

router.post('/login', logIn)
router.get('/sendVerifyCode', sendVerifyCode)
router.post('/register', register)
router.post('/modifyCipher', function (req, res) {
    modifyCipher(req.body).then(data => res.send(data))
        .catch(err => res.send(err))
});
function getRandom() {
    return parseInt(Math.random() * 9000 + 1000)
}


function logIn(req, res) {
    let { username, password } = req.body;
    userLogin(username, password).then(data => res.send(data))
        .catch(err => res.send(err))
}

function sendVerifyCode(req, res) {
    let username = req.query.username
    let pwd = getRandom()
    let timer = null
    let user = username.split('@')[0];
    let info = map.get(user)
    info && (timer = info.timer) && clearTimeout(timer)
    timer = setTimeout(() => { map.delete(user) }, 5 * 1000 * 60)
    map.set(user, { pwd, timer })
    sendEmail(username, pwd).then(data => res.send(data), err => res.send(err))
}

async function register(req, res) {
    let { username, password, nickname, yanzhengma } = req.body
    userRegister(username, password, nickname, yanzhengma).then(data => {
        res.send(data)
        insertSqlHistory(username)
    })
        .catch(err => res.send(err))
}

module.exports = router