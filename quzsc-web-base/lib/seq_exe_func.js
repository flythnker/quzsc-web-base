/**
 * Created by huangyipeng on 2017/6/5.
 */

// 这是下一版本的 seq_func_arr
// 命名改进
// 顺序执行函数 -> 顺序执行函数执行器 -> 多步骤函数执行器
// 以后再开发了 （2017年6月5日）

var 多步骤函数执行器 = function(上下文){
    if(上下文){
        this.上下文 = 上下文;
    }else{
        this.上下文 = {};
    }
    this.步骤函数数组 = [];
};

var 步骤函数 = function (seqFuncArr, name, func,data ){
    this.seqFuncArr = seqFuncArr;
    this.name = name;
    this.func = func;
    this.data = data;
    this.nextFuncObj = null;
}

步骤函数.prototype.next = function(){
    if(this.nextFuncObj){
        this.nextFuncObj.exe();
    }else{
        this.seqFuncArr.complete();
    }
};

步骤函数.prototype.执行 =function(){
    if(this.data == null){
        this.data = this.seqFuncArr.data;
    }
    if(this.seqFuncArr.isLogStep){
        logger.info(this.name);
        logger.info(JSON.stringify(this.data));
    }
    this.func(this);
}

步骤函数.prototype.报告错误 = function(err){
    this.seqFuncArr.报告错误(err);
};


多步骤函数执行器.prototype.添加 = function( 步骤函数 ){

}

多步骤函数执行器.prototype.执行 = function(回调){

}

module.exports = 顺序执行函数;

