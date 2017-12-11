var SCLogger = require("./sc_logger");

function test1(){
    var logger = SCLogger.getLogger(__filename);
    logger.info("abc");
}

//测试代码
if (require.main === module) {
    test1();
    //test2();
}