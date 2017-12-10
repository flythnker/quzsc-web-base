
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(["./aa","./bb"],function(bb) {
    console.info(bb);
});