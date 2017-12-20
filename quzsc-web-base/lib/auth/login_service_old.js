/**
 * Created by huangyipeng on 2017/2/20.
 */

var crypto = require('crypto');
var LoginService = {};

//var loginInfo = req.cookies.login_info;
var sessionKey = "adde23se3323";
LoginService.setSessionKey = function(key){
    sessionKey = key;
};

LoginService.getLoginInfo文档 = {
    说明:"得到用户登录信息,并且检查登录cookie的合法性",
    参数:["req","express req"]
};
LoginService.getLoginInfo = function(req){
    //检查 cookie 的有效性
    if(LoginService.devLoginInfo){
        return LoginService.devLoginInfo;
    }else{
        var loginInfo = req.cookies.login_info;
        if(loginInfo == null){
            return null;
        }
        var session = LoginService.createSessionStr(loginInfo.id,loginInfo.time);
        if(loginInfo.session != session){
            return null;
        }
        // name: 用户.昵称,
        // id:用户.编号,
        // session:用户.登录会话,
        // time: time
        var dTime = Date.now() - loginInfo.time;
        if(dTime / 1000 / 60 /60 > 12){
            return null;
        }

        return loginInfo;
    }
};

var loginURI = "/user/login/login_page";
LoginService.重定向到登录页面文档 = {
    说明:"重定向到登录页面",
    参数:["res","express res","backURL","登录成功以后的返回URL"]
};
LoginService.重定向到登录页面 = function(res,backURL){
    var url = loginURI;
    if(backURL){
        url = loginURI + "?backURL="  + backURL;
    }
    res.redirect(url);
};

LoginService.得到登录检查过滤器 = {
    说明:"得到登录检查过滤器",
    参数:["不检查列表","['/table/api','/']"],
    例子:['例子1',
``]
};
LoginService.得到登录检查过滤器 = function(不检查列表) {
    var checkSetObj = {};
    for(var path of 不检查列表){
        checkSetObj[path] = true;
    }
    function checkLogin(req, res, next) {
        // if (req.path == loginURI || req.path == "/table/api") {
        //     next();
        //     return;
        // }
        if(checkSetObj[req.path]){
            //不进行登录检查
            next();
            return;
        }

        //根据扩展名，不需登录检测
        if(req.method == 'GET'){
            var index = req.path.lastIndexOf(".");
            if(index > 0){
                var ext = req.path.substr(index +1);
                if(ext == "ico" || ext == "js"){
                    next();
                    return;
                }
            }
        }


        var loginInfo = LoginService.getLoginInfo(req);
        if (loginInfo == null) {
            LoginService.重定向到登录页面( res , req.originalUrl );
        } else {
            req.loginInfo = loginInfo;
            next();
        }
    };
    return checkLogin;
};

LoginService.createSessionStr = function(userId,time){
    var sha1 = crypto.createHash('sha1');
    sha1.update(sessionKey + userId);
    sha1.update("" + time);
    return sha1.digest('hex');
};
LoginService.sendLoginInfoCookie = function(res, 用户,time){
    res.cookie('login_info',
        {
            name: 用户.昵称,
            id:用户.编号,
            session:用户.登录会话,
            time: time
        },
        { maxAge: 1000 * 60 * 60 * 24 }
    );
};

// { email: user.email,id:user.id, session:user.session}
LoginService.devLoginInfo = null;
LoginService.setDevLoginInfo = function(devLoginInfo){
    LoginService.devLoginInfo = devLoginInfo;
};

module.exports = LoginService;
