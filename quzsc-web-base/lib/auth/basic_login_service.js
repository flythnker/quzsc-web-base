
var utils = require("../utils");
var SCLogger = require("../sc_logger");
var logger = SCLogger.getLogger(__filename);
var auth = require('basic-auth')

/**
 * @module login_service
 */

/**
 * @class
 * @param userId
 * @param userName
 * @constructor
 */
var UserInfo = function(userId,userName){
    this.userId = userId;
    this.userName = userName;
}

/**
 * @class BaiscLoginService
 * @constructor
 */
var BaiscLoginService = function(){

};

function 得用登录用户信息(req){
    return null;
}

/**
 * @return {Function}
 */
BaiscLoginService.过滤器 =  function(){
    function unauthorized(req, res){
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
        res.end('Unauthorized');
        logger.info("Unauthorized " + req.originalUrl);
    }
    return function(req, res, next){
        console.info("abc1:"+req.url);
        console.info("abc2:"+req.originalUrl);

        if(!BaiscLoginService.loginUserMap){
            logger.error("BaiscLoginService 没有初始化!");
            unauthorized(req, res);
            return;
        }

        var user = auth(req);

        //if (user === undefined || user['name'] !== 'username' || user['pass'] !== 'password') {
        if (user){
            logger.info(JSON.stringify(user));
            logger.info(user['name']);

            var loginUser = null;
            if(user['name'] in BaiscLoginService.loginUserMap){
                loginUser = BaiscLoginService.loginUserMap[user['name']];
            }
            if( loginUser && loginUser.userPass == user['pass'] ) {
                //logger.info("login success!! " + req.originalUrl);
                next();
            }else {
                unauthorized(req, res);
            }
        } else {
            unauthorized(req, res);
        }
    }
};
/**
 *
 * @param filepath
 */
BaiscLoginService.初始化 =  function(filepath){
    if(!utils.fileExist(filepath)){
        throw filepath + " file is not exists.";
    }
    BaiscLoginService.baiscConfig = utils.readJSONFile(filepath);
    BaiscLoginService.loginUserMap = {};
    console.info(JSON.stringify(BaiscLoginService.baiscConfig));
    logger.info(typeof(BaiscLoginService.baiscConfig.用户));
    logger.info(BaiscLoginService.baiscConfig.用户.length);
    for(user of BaiscLoginService.baiscConfig.用户){
        var parts = user.split(",")
        if(parts.length != 3){
            logger.error("用户格式错误 " + user);
            continue;
        }

        if(!/^[0-9]+$/.test(parts[0])){
            logger.error("用户ID不符合要求 " + user);
            continue;
        }

        if(parts[1].length < 3){
            logger.error("用户名不符合要求 " + user);
            continue;
        }

        if(parts[2].length < 3){
            logger.error("用户密码不符合要求 " + user);
            continue;
        }

        BaiscLoginService.loginUserMap[parts[1]] = {
            userInfo:new UserInfo(parts[0],parts[1]),
            userPass:parts[2]
        };

        logger.info(JSON.stringify( BaiscLoginService.loginUserMap ));
        console.info("test1" in BaiscLoginService.loginUserMap );
    }
    logger.info("Users:" +  Object.keys(BaiscLoginService.loginUserMap) );
};
    // /**
    //  *
    //  * @returns {Function}
    //  */
    // 过滤器:function(){

    // },


//};



module.exports = BaiscLoginService;