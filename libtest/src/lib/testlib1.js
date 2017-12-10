
if (typeof define !== 'function') { var define = require('amdefine')(module); }



define("aa",["bb"],function(bb) {
    console.info("aaa")
    //var dep = require('dependency');
    //The value returned from the function is
    //used as the module export visible to Node.
    return function () {

    };
});

define("bb",["aa"],function(aa) {
    console.info("bbb")
    return {
        name:"bb name",
        ggg:"zz"
    };
});

define("",["aa","bb"],function(aa,bb) { 
    console.info("111 " + bb.name)
    //var dep = require('dependency');
    //The value returned from the function is
    //used as the module export visible to Node.
    return function () {};
});

