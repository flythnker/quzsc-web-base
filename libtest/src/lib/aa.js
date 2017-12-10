
if (typeof define !== 'function') { var define = require('amdefine')(module); }


define("aa",["./bb"],function(bb) {
    console.info("aaa " + bb.ggg);
    //var dep = require('dependency');
    //The value returned from the function is
    //used as the module export visible to Node.
    return function () {

    };
});


module.exports = define.require('aa');