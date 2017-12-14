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
    if(arguments.length ==0){
        this.configNameArr = ["config","sample_config"];
    }else if(arguments.length ==1){
        this.configNameArr = [arguments[0]];
    }else{
        this.configNameArr = [arguments[0],arguments[1]];
    }
    this.config = null;
}


AppConfig.prototype.getConfig = function()
{
    return this.config;
};

AppConfig.prototype.init = function(dir)
{
    var self = this;
    if(this.config){
        console.error("已经初始化了，不能再次初始化!");
        return;
    }

    function initConfig(name){
        if(utils.fileExist(dir + "/"+name+".js"))
        {
            self.config = require(dir + "/" + name );
        }
    }

    for(var name of this.configNameArr){
        if(this.config){
            break;
        }
        initConfig(name);
    }

}

module.exports = AppConfig;
