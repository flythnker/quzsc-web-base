/**
 * Created by huangyipeng on 2017/1/11.
 */
"use strict";

var utils = require('./utils');

/**
 * @class
 * @type {{}}
 */
var AppConfig = function(){
    this.config = null;
}


AppConfig.prototype.getConfig = function()
{
    return this.config;
};

AppConfig.prototype.init = function(dir)
{
    if(this.config){
        console.error("已经初始化了，不能再次初始化!");
        return;
    }
    if(utils.fileExist(dir + "/config.js"))
    {
        this.config = require(dir + "/config");
    }else{
        this.config = require(dir + "/sample_config");
    }
}

module.exports = AppConfig;
