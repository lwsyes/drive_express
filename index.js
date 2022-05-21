const express = require("express")
const app = express()
const history = require('connect-history-api-fallback')
const { join } = require('path')
const { author } = require("./middleware/authorization")
const { PORT } = require("./config")

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Headers", "*")
//     res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
//     next();
// })
app.use(history());
app.use(express.static(join(__dirname, 'public')));
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: false, limit: 5 * 1024 * 1024 }))

app.use(author)
app.use("/author", require("./router/login"))
app.use("/api/user", require("./router/user"))
app.use("/api/file", require("./router/file"))
app.use("/api/share", require("./router/fileShare"))
app.use("/yiyan", require("./router/yiyan"))


app.listen(PORT, () => {
    console.log(`listen PORT at ${PORT}`);
})

module.exports = app