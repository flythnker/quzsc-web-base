/**
 * 配置文件
 * @type {{mysqldb: {host: string, user: string, pass: string, db: string}, serverPort: number}}
 */


var config = {
    mysqldb:{
        host:"127.0.0.1",
        user:'test',
        pass:'123456',
        db:'test'
    },
    serverPort:3001
};

module.exports = config;
