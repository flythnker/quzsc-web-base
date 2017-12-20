/**
 * Created by huangyipeng on 2017/5/18.
 */


var CommonLoginService = require("./login_service_old");
var DocService = require("./../lib/doc_service");

function 更新文档()
{
    DocService.updateDocToWebApp(CommonLoginService,function(err){
        if(err){
            console.error(err);
        }else{
            console.info("更新文档成功!");
        }
    });
}
function basicTest(){

}
if (require.main === module) {
    //basicTest();
    更新文档();
}
