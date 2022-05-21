var mysql = require('mysql');
var { MYSQL_OPTION } = require('../config')

var connection = mysql.createConnection(MYSQL_OPTION);
connection.connect();

function MysqlQuery(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, data) => {
            err && reject(err);
            resolve(data)
        })
    })
}

module.exports = MysqlQuery;