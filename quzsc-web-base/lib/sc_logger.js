/**
 * Created by huangyipeng on 2017/3/24.
 */

const path = require('path');
const log4js = require('log4js');
var __logger = log4js.getLogger("SC");

/**
 * @class 日志对象
 * @type {{}}
 */
SCLogger = {};

function Logger(name){
    this.name = name;
}

/**
 *
 * @param obj
 */
Logger.prototype.info = function(obj){
    var infoLine = new Error().stack.split("\n")[2];
    var lastIndex = infoLine.lastIndexOf(path.sep);
    var codeInfo = infoLine.substr(lastIndex + 1 , infoLine.length - lastIndex -2 );
    __logger.info(codeInfo + " " + JSON.stringify(obj) );
};

/**
 *
 * @param obj
 */
Logger.prototype.error = function(obj){
    var infoLine = new Error().stack.split("\n")[2];
    var lastIndex = infoLine.lastIndexOf(path.sep);
    var codeInfo = infoLine.substr(lastIndex + 1 , infoLine.length - lastIndex -2 );
    __logger.error(codeInfo + " " + JSON.stringify(obj) );
};

/**
 *
 * @param fullFilename
 * @returns {Logger}
 */
SCLogger.getLogger = function(fullFilename){
    //var logger = log4js.getLogger(path.basename(__filename,'.js') );
    var filename = path.basename(fullFilename,'.js');
    return new Logger(filename);
};



module.exports = SCLogger;
