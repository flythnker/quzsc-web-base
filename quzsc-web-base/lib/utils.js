/**
 * Created by huangyipeng on 2017/1/7.
 */

const path = require('path');
const log4js = require('log4js');
var logger = log4js.getLogger(path.basename(__filename,'.js') );

const fs = require('fs');
const crypto = require('crypto');

/**
 *
 * @type {{}}
 */
var utils ={} ;

/**
 * 得到一个长的整数ID
 * @returns {number}
 */
utils.newLongIntId = function(){
    var newId = Math.floor(Date.now() ) * 100000 + Math.floor( Math.random() * 10000 );
    return newId;
};

/**
 *
 * @param obj
 * @returns {string}
 */
utils.getVarInfo = function(obj){
    var type = typeof(obj);
    if(type == "object"){
        return "object:" + obj.constructor.name;
    }else if(type == "function"){
        return "function:" + obj.prototype.constructor.name;
    }else{
        return type;
    }
};

utils.sha1 = function(str){
    var hash = crypto.createHash('sha1');
    hash.update(str);
    return hash.digest('hex');
}

utils.calFileSha1 = function(filepath,cb){
    var rs = fs.createReadStream(filepath);
    var hash = crypto.createHash('sha1');
    rs.on('data', function(data){
        hash.update(data);
    });
    rs.on('error',function(){
        cb(filepath + " io error");
    });
    rs.on('end', function () {
        cb(null,hash.digest('hex'));
    });
};


//http://www.cnblogs.com/zhangpengshou/archive/2012/07/19/2599053.html
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
utils.dateFormat = function(date,fmt)
{ //author: meizz
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

utils.printVarInfo = function(obj){
    console.info(this.getVarInfo(obj));
};

utils.getUserHome = function() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
};

utils.fileExist = function(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
};

utils.isDir = function(filepath){
    states = fs.statSync( filepath );
    return states.isDirectory();
};

utils.checkMkdir = function(path){
    if(!this.fileExist(path)){
        fs.mkdirSync(path);
    }
};

utils.readJSONFile = function(filepath){
    var obj = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    return obj;
};

utils.getChinaToday = function(){
    var now = new Date();
    if(now.getTimezoneOffset() / 60 == -8){
        var day = now.getFullYear()  * 10000 + (now.getMonth() + 1)*100 + now.getDate();
        return day;
    }else{
        var longNow = Date.now();
        now.setTime(longNow + 8 *3600 * 1000);
        var day = now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1)*100 + now.getUTCDate();
        return day;
    }
};

utils.parseFileExt = function(filename){
    var index = filename.lastIndexOf(".")
    if(index < 0){
        return {name:filename,ext:""};
    }else{
        return {name:filename.substr(0,index),ext:filename.substr(index + 1)}
    }
};

utils.webReqInfo = function(req,res){
    var html = "";
    html +="<pre>";
    //req.path
    html +="req.path:" + req.path + "\r\n";
    html +="req.protocol:" + req.protocol + "\r\n";
    html +="req.baseUrl:" + req.baseUrl + "\r\n";
    html +="req.get('Content-Type'):" + req.get('Content-Type') + "\r\n";
    html +="req.body:" + JSON.stringify(req.body, undefined, '\t') + "\r\n";
    html +="req.params:" + JSON.stringify(req.params, undefined, '\t') + "\r\n";
    html +="req.query:" + JSON.stringify(req.query, undefined, '\t') + "\r\n";
    html +="req.cookies:" + JSON.stringify(req.cookies, undefined, '\t') + "\r\n";
    html +="</pre>";
    res.send(html);
};

function basicTest(){
    //utils.checkMkdir("c:/aa");
    //var today = utils.getChinaToday();
    //console.info(today);

    // utils.calFileSha1("/home/app/pub_app_store/tmp/10005_20170315.zip",function(err,sha1){
    //     logger.info([err,sha1]);
    // });

    // var fstat = fs.statSync("/home/app/pub_app_store/tmp/10005_20170315.zip");
    // fstat.size
    //const util = require('util');
    //console.info(fstat.size);

    var sha1 = utils.sha1("a1");
    console.info(sha1);
}

if (require.main === module) {
    basicTest();
}

module.exports = utils;


