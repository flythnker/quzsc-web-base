/**
 * Created by huangyipeng on 2017/3/22.
 * 这个类应用太广泛了，不可以修改。修改前需要补充完成单元测试。
 */

/**
 * @module seq_func_arr
 */

const SC_Logger = require("./sc_logger");
var logger = SC_Logger.getLogger(__filename);

/**
 * @class 函数对象
 * @param seqFuncArr
 * @param name
 * @param func
 * @param data
 * @constructor
 */
function FuncObj( seqFuncArr, name, func,data ){
    this.seqFuncArr = seqFuncArr;
    this.name = name;
    this.func = func;
    this.data = data;
    this.nextFuncObj = null;
}

/**
 *  下一步
 */
FuncObj.prototype.next = function(){
    if(this.nextFuncObj){
        this.nextFuncObj.exe();
    }else{
        this.seqFuncArr.complete();
    }
};

/**
 * 执行 在SeqFuncArr内部被调用
 */
FuncObj.prototype.exe =function(){
    if(this.data == null){
        this.data = this.seqFuncArr.data;
    }
    if(this.seqFuncArr.isLogStep){
        logger.info(this.name);
        logger.info(JSON.stringify(this.data));
    }
    this.func(this);
}

/**
 *
 * @param err
 */
FuncObj.prototype.fireError = function(err){
    this.seqFuncArr.fireError(err);
};

//
/**
 * @class 顺序函数数组
 * @param isLogStep  是否记录调用步骤
 * @param data 各步骤共享数据
 * @constructor
 */
function SeqFuncArr(isLogStep,data){

    this.funcObjArr = [];
    if(data){
        this.data = data;
    }else{
        this.data = null;
    }
    this.err = null;
    this.completeFunc = null;
    if("undefined" == typeof(isLogStep) ){
        this.isLogStep = false;
    }else{
        this.isLogStep = isLogStep;
    }
}

/**
 *
 * @param err
 */
SeqFuncArr.prototype.complete = function(err){
    if(this.completeFunc){
        this.completeFunc(this.err);
    }
};

/**
 *
 * @param err
 */
SeqFuncArr.prototype.fireError = function(err){
    this.err = err;
    this.complete();
};

SeqFuncArr._文档 = {
    分类:"Common",
    对象名:"SeqFuncArr",
    说明:`用于解决回调地狱，方便多个回调方法连续回调。`
};

//添加符合标准的 seqFunc
SeqFuncArr.prototype.添加 = function(name,func,data){
    //funcObjArr[i].nextFuncObj = funcObjArr[i + 1];
    if(typeof(func) != "function"){
        throw new Error("SeqFuncArr.prototype.添加 func 不是函数 ");
    }
    var funcObj = new FuncObj(this,name,func,data);
    if(this.funcObjArr.length > 0){
        this.funcObjArr[this.funcObjArr.length - 1].nextFuncObj = funcObj;
    }
    this.funcObjArr.push(funcObj);
};

// 添加函数的第二个版本, 普通函数的标准模式如下
// APIPassService.addAPIPass = function(param,cb){
// SeqFuncArr.prototype.添加2 =function (name,func) {
//     var data = this.data;
//     function seqFunc(){
//         func(data,function(err,cbData)){
//
//         }
//     }
// };

SeqFuncArr.prototype.执行 = function(completeFunc){
    this.completeFunc = completeFunc;
    var i = 0;
    var funcObjArr = this.funcObjArr;
    if(funcObjArr.length ==0){
        this.complete();
        return;
    }else{
        funcObjArr[0].exe();
    }
};

module.exports = SeqFuncArr;