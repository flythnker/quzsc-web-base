/**
 * Created by huangyipeng on 2017/3/23.
 */

const test = require('tape');
const SeqFuncArr = require('./seq_func_arr');

var SeqFuncArrUnitTest = {};

SeqFuncArrUnitTest.testAll = function(){
    test('SeqFuncArrUnitTest 测试1', function (t) {
        t.plan(1);

        var value = 1;
        var seqFuncArr = new SeqFuncArr();
        seqFuncArr.添加("第一步",function(funcObj){
            value++;
            funcObj.next();
        });

        seqFuncArr.添加("第二步",function(funcObj){
            value++;
            t.ok(value == 3,"完成");
            // console.info(funcObj);
            funcObj.next();
        });
        seqFuncArr.执行();
    });

    test('SeqFuncArrUnitTest 测试2', function (t) {
        t.plan(2);

        var TestData= {name:"abc"};
        var value = 1;
        var seqFuncArr = new SeqFuncArr();
        seqFuncArr.添加("第一步",function(funcObj){
            value++;
            t.ok(funcObj.data.name == "abc","完成1");
            funcObj.next();
        },TestData);

        seqFuncArr.添加("第二步",function(funcObj){
            value++;
            t.ok(funcObj.data.name == "abc","完成2");
            // console.info(funcObj);
            funcObj.next();
        },TestData);
        seqFuncArr.执行();
    });
};




if (require.main === module) {
    SeqFuncArrUnitTest.testAll();
}

module.exports = SeqFuncArrUnitTest;