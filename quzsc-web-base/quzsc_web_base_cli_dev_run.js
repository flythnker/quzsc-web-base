
var main = require("./quzsc_web_base_cli")
function test1()
{
    var args = [];
    main(args);
}

if (require.main === module) {
    test1();
}