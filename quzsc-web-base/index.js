

WebBase = {};
WebBase.seq_exe_func = require("lib/seq_exe_func");
WebBase.mysql_service = require("lib/mysql_service");
WebBase.sc_logger = require("lib/sc_logger");
WebBase.BasicLoginService = require('./lib/auth/basic_login_service');
module.exports=WebBase;