
var process = require("process");
var login = require("./basic_login_service");

function basicTest(){
    //console.log(`Current directory: ${process.cwd()}`);
    login.初始化("../../test/data/basic_login.json")
}

function test1()
{
    //console.info(test("1"))
}

if (require.main === module) {
    basicTest();
    //test1();
}