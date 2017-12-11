/**
 * Created by huangyipeng on 2017/6/5.
 */

var 顺序执行函数 = require("./seq_exe_func");
function basicTest()
{
    var funcArr = new 顺序执行函数执行器();
}

if (require.main === module) {
    basicTest();
}
