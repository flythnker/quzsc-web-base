
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define("bb",[],function () {
    return {
        name:"bdb",
        ggg:"zzz"
    };
});

module.exports = define.require('bb');

