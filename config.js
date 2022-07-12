var path = require('path')
process.argv[2] && (process.env.DOMAIN = process.argv[2])
module.exports = {
    // mysql配置信息
    MYSQL_OPTION: {
        host: '42.193.112.244',
        user: 'root',
        password: '000616',
        port: '3306',
        database: 'net_disk'
    },
    // 邮箱配置
    EMAIL_OPTION: {
        host: 'smtp.qq.com',
        port: '465',
        secure: true,
        auth: {
            user: 'xiezyxyz@qq.com',
            pass: 'wonywjwhayasdfed'
        }
    },
    //邮箱模板
    EMAIL_VERIFY_CODE_OPTION: {
        from: '沐雨凉年<2973912389@qq.com>',
        subject: '登录验证码',
        text: '你的验证码是：{verifyCode}，有效期5分钟。',
        html: ''
    },
    //账号异常登录模板
    EMAIL_LOGIN_WARN_OPTION: {
        from: '沐雨凉年<2973912389@qq.com>',
        subject: '登录警告',
        text: '用户：{username}，你的账号在{ipAddress}登录，如果非本人操作，请及时修改密码。',
        html: ''
    },
    PORT: 3000, //默认开启端口
    JWTKEY: 'nsodivnjcjksxzfb',//jwt加盐字符串
    WHITE_LIST: ['/api'],//验证黑名单,
    DOMAIN: process.env.DOMAIN || 'https://drive.xiezy.top',//网站域名
    DEFAULT_AVATAR: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',//用户默认头像
    EVERY_DAY_WORD: 'https://saying.api.azwcl.com/saying/get', //每日一词
    ERROR_LOG: path.resolve(__dirname, 'ErrorLog'),//错误日志地址
    UPLOAD_DIR: path.resolve(__dirname, 'public/upload'), //上传地址
    SCREENSHOT_DIR: path.resolve(__dirname, 'public/screenShot'), //视频封面图地址
    MUSICINFO: path.resolve(__dirname, 'public/musicInfo'), //音乐封面
    HEADIMG_DIR: path.resolve(__dirname, 'public/headImg') //用户头像上传
}