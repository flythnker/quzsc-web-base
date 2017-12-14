
var AppConfig = require("./app_config");
var appConfig = new AppConfig();

//测试代码
if (require.main === module) {
    // __dirname
    appConfig.init("..")
    var config = appConfig.getConfig();
    console.info(config.serverPort);
}