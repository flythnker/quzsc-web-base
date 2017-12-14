/**
 * @class
 * @type {{}}
 */
WebBase = {};
/**
 *
 * @type {顺序执行函数}
 */
WebBase.SeqFuncArr = require("lib/seq_exe_func");
/**
 *
 * @type {{}}
 */
WebBase.MysqlServiceFactory = require("lib/mysql_service");
/**
 *
 * @type {{}|*|SCLogger}
 */
WebBase.SCLogger = require("lib/sc_logger");
/**
 *
 * @type {{}}
 */
WebBase.AppConfig = require("lib/app_config");
/**
 *
 * @type {BaiscLoginService|*}
 */
WebBase.BasicLoginService = require('./lib/auth/basic_login_service');
module.exports=WebBase;