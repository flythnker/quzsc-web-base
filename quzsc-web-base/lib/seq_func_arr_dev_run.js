
const SeqFuncArr = require('./seq_func_arr');

function demo1()
{
    var seqFuncArr = new SeqFuncArr();
    var value = 0;
    seqFuncArr.添加("第一步",function(funcObj){
        value++;
        funcObj.next();
    });
    seqFuncArr.添加("第二步",function(funcObj){
        value++;
        funcObj.fireError("测试");
    });
    seqFuncArr.执行(function(err){
        if(err){
            console.info(err)
        }
    })
}

function basicTest()
{
    var context = {"name":"abc"};
    var funcArr = new SeqFuncArr(true,context);
    funcArr.添加("第一步",function(funcObj){
        console.info("第一步:");
        funcObj.next();
    });
    funcArr.添加("第二步",function(funcObj){
        console.info("第二步:" );
        funcObj.next();
    });
    funcArr.执行(function(err){
        if(err){
            logger.error(err);
        }else{
            logger.info("fArr.执行 ... ");
        }
    });
}

if (require.main === module) {
    //demo1();
    basicTest();
}
