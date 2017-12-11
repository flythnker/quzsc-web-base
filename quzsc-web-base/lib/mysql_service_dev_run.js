/**
 * Created by huangyipeng on 2017/5/30.
 */

var MysqlServiceFactory = require("./mysql_service");
var logger = require("./sc_logger").getLogger(__filename);



function basicTest()
{
    MysqlServiceFactory.initMysqlService("测试"
        ,
        {
            host:"sctest1.huangyipeng.cn",
            user:'quzsc_test',
            pass:'ddT5tgt90k',
            db:'quzsc_test'
        })
    function test1(){
        logger.info("test1 ... ");
        var mysqlService = MysqlServiceFactory.getMysqlService("测试");
        //logger.info("mysqlService.query: " + mysqlService.query);
        mysqlService.queryForList("select count(*) `count` from `标签服务数据` ", [], function(err,datas){
            console.info([err,datas]);
        });
    }
    function test2(){
        var mysqlService = MysqlServiceFactory.getMysqlService("测试");
        //mysqlService.pool.

        mysqlService.pool.getConnection(function(err, connection) {

            connection.query('select count(*) `count` from `标签服务数据`', function (err, results, fields) {

                connection.release();

                if (err){
                    throw err;
                }else{
                    console.info([err,results]);
                }


            });
        });
    }

    //test1();
    //test1();
    //test2();
    //test2();

    for(var i=0;i<1;i++){
        setTimeout(test1,2 * i);
    }


    // setTimeout(function(){
    //     var mysqlService = MysqlServiceFactory.getMysqlService("测试");
    //     mysqlService.destroy();
    // },1000 * 5);



}
if (require.main === module) {
    basicTest();
}
