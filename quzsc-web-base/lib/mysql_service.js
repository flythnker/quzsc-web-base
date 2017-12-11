/**
 * Created by huangyipeng on 2017/2/9.
 */

var mysql = require('mysql2');
var logger = require('./sc_logger').getLogger(__filename);

/**
 * @class
 * @type {{}}
 */
var MysqlServiceFactory = {};
MysqlServiceFactory.mysqlService = {};
MysqlServiceFactory.getMysqlPool = function(name){
    var mysqlService = MysqlServiceFactory.mysqlService[name];
    if(mysqlService){
        return mysqlService.pool;
    }
    return null;
};

/**
 *
 * @param name
 * @returns {*}
 */
MysqlServiceFactory.getMysqlService = function(name){
    var mysqlService = MysqlServiceFactory.mysqlService[name];
    return mysqlService;
};

/**
 *
 * @param name 连接名称
 */
MysqlServiceFactory.destroy = function(name){
    MysqlServiceFactory.mysqlService[name].destroy();
};

/**
 * 初始化 MysqlService
 * @param name
 * @param config
 * @returns {MysqlService}
 */
MysqlServiceFactory.initMysqlService = function(name,config){
    var mysqlService = new MysqlService();
    mysqlService.init(config);
    MysqlServiceFactory.mysqlService[name] = mysqlService;
    return mysqlService;
};

/**
 * @class
 * @constructor
 */
var MysqlService = function(){
};

/**
 *
 * @param mysqlConfig
 */
MysqlService.prototype.init = function (mysqlConfig){
    logger.info("MysqlService.init " + mysqlConfig.host + " " + mysqlConfig.db);
    this.pool = mysql.createPool({
        connectionLimit: 50,
        connectTimeout:5000,
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password: mysqlConfig.pass,
        database: mysqlConfig.db,
        dateStrings: true
        // "host":"127.0.0.1","user":"quzsc","pass":"quzsc","db":"quzsc"
    });
    this.pool.on('connection', function (connection) {
        logger.info("pool on connection ... ");
        connection.on('error', function (err) {
            if(err.code != "ECONNRESET"){
                console.trace(err);
            }
            logger.error(err);
        });
    });
    this.pool.on('acquire', function (connection) {
        logger.info( 'Connection ' + connection.threadId + ' acquired');
    });
    this.pool.on('enqueue', function () {
        logger.info('Waiting for available connection slot');
    });
    this.pool.on('release', function (connection) {
        logger.info('Connection ' + connection.threadId + ' released' );
    });
};

/**
 * 网络丢失，会自动重连的 query
 * @param sql
 * @param paramArr
 * @param cb
 */
MysqlService.prototype.retryQuery = function(sql,paramArr,cb){
    var self = this;
    this.pool.query(sql,paramArr, function (err, results, fields) {
        if (err) {
            if(err.code == "ECONNRESET"){
                //retry
                logger.info("queryForList2 retry for error ECONNRESET");
                self.pool.query(sql,paramArr, function (err, results, fields) {
                    if(err){
                        console.trace(err);
                        cb(err);
                    }else{
                        cb(null , results );
                    }
                });
            }else{
                console.trace(err);
                cb(err)
            }
//      console.info( "typeof(err):" + typeof(err) );
//      code: 'ECONNRESET',
//      errno: 'ECONNRESET',
//      console.info("err.code:" + err.code);
//      console.info("err.code:" + err.errno);
//      console.trace(err);
        }else{
            logger.info( sql );
            logger.info( Object.keys(self.pool) );
            cb(null , results );
        }
    });
};

/**
 *
 * @param sql
 * @param paramArr
 * @param cb
 */
MysqlService.prototype.update = function(sql,paramArr,cb){
    // 'update `应用文件` set 内容=? , 更新时间=? where 编号=? '
    // [内容 , now , 文件编号]
    this.retryQuery(sql,paramArr,function (err, results){
        if (err){
            cb(err)
        }else{
            cb(null,results.affectedRows);
        }
    });
    // this.pool.query(sql,paramArr, function (err, result, fields) {
    //     if (err){
    //         console.error(err);
    //         cb(err)
    //     }else{
    //         //logger.info(result.affectedRows);
    //         cb(null,result.affectedRows);
    //     }
    // });
};

/**
 *
 * @type {MysqlService.update|*}
 */
MysqlService.prototype.delete = MysqlService.prototype.update;

/**
 *
 * @type {MysqlService.update|*}
 */
MysqlService.prototype.删除 = MysqlService.prototype.update;

/**
 *
 * @param sql
 * @param dataObj
 * @param cb
 */
MysqlService.prototype.insert= function(sql,dataObj,cb){
    // 'INSERT INTO 应用文件 SET ?'
    // {
    //     应用编号: 应用编号,
    //         文件名: name,
    //         更新时间: now,
    //         创建时间: now
    // }
    this.pool.query( sql, dataObj, function (err, result, fields){
        if (err) {
            console.trace(err);
            cb(err);
        } else {
            cb(null, result);
        }
    });
};

/**
 *
 * @type {MysqlService.insert|*}
 */
MysqlService.prototype.添加 = MysqlService.prototype.insert;

/**
 *
 * @param sql
 * @param dataObj
 * @param cb
 */
MysqlService.prototype.insertAndGetId = function(sql,dataObj,cb){
    // 'INSERT INTO 应用文件 SET ?'
    // {
    //     应用编号: 应用编号,
    //         文件名: name,
    //         更新时间: now,
    //         创建时间: now
    // }
    this.pool.query( sql, dataObj, function (err, result, fields) {
        if (err) {
            console.trace(err);
            cb(err);
        } else {
            cb(null, result.insertId);
        }
    });
};

/**
 *
 * @type {MysqlService.retryQuery|*}
 */
MysqlService.prototype.queryForList = MysqlService.prototype.retryQuery;

/**
 *
 * @param sql
 * @param paramArr
 * @param cb
 */
MysqlService.prototype.queryForOne = function(sql,paramArr,cb){
    this.queryForList(sql,paramArr,function (err, results){
        if (err) {
            cb(err)
        }else{
            if(results.length ==1){
                cb(null , results[0] );
            }else{
                cb(null , null );
            }
        }
    });
};

/**
 *
 * @param tableName
 * @param idName
 * @param id
 * @param attrMap
 * @param funcObj
 * @param contextDataName
 */
MysqlService.prototype.updateByIdFuncStep = function(tableName,idName,id,attrMap,funcObj,contextDataName)
{
    // 'update `应用文件` set 内容=? , 更新时间=? where 编号=? '
    // [内容 , now , 文件编号]
    var sql = 'update `' + tableName + '` set ';
    var names = Object.keys( attrMap );
    var paramArr = [];
    for(var name of names){
        if(paramArr.length > 0){
            sql += ',';
        }
        sql += '`'+name+'` = ? ';
        paramArr.push(attrMap[name]);
    }
    sql += " where `"+idName+"`=?";
    paramArr.push(id);
    console.info(sql);
    console.info(paramArr);

    this.pool.query(sql,paramArr, function (error, result, fields) {
        if (error){
            console.error(error);
            funcObj.fireError(error);
        }else{
            //logger.info(result.affectedRows);
            funcObj.data[contextDataName] = result.affectedRows;
            funcObj.next();
        }
    });
};

/**
 *
 * @param sql
 * @param paramArr
 * @param funcObj
 * @param contextDataName
 */
MysqlService.prototype.queryForOneFuncStep = function(sql,paramArr,funcObj,contextDataName){

    this.queryForList(sql,paramArr,function (err, results){
        if (err) {
            funcObj.fireError(err);
        }else{
            if(results.length ==1){
                funcObj.data[contextDataName] = results[0];
            }else{
                funcObj.data[contextDataName] = null;
            }
            funcObj.next();
        }
    });

    // this.pool.query(sql,paramArr, function (err, results, fields) {
    //     if (err){
    //         console.error(err);
    //         funcObj.fireError(err);
    //     }else{
    //         if(results.length == 1){
    //             funcObj.data[contextDataName] = results[0];
    //         }else{
    //             funcObj.data[contextDataName] = null;
    //         }
    //         funcObj.next();
    //     }
    // })
};

/**
 *
 * @param sql
 * @param paramArr
 * @param funcObj
 * @param contextDataName
 */
MysqlService.prototype.queryForListFuncStep = function (sql,paramArr,funcObj,contextDataName){

    this.queryForList(sql,paramArr,function (err, results){
        if (err) {
            funcObj.fireError(err);
        }else{
            funcObj.data[contextDataName] = results;
            funcObj.next();
        }
    });

    // this.pool.query(sql,paramArr,function (err, results, fields) {
    //     if (err){
    //         funcObj.fireError(err);
    //     }else{
    //         funcObj.data[contextDataName] = results;
    //         funcObj.next();
    //     }
    // });
};

/**
 * 关闭连接池
 */
MysqlService.prototype.destroy = function () {
    this.pool.end(function (err) {
        if (err) {
            console.trace(err);
            logger.error(err);
        }
    });
};

module.exports = MysqlServiceFactory ;
