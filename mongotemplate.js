db.tracerecords.group(
  {key:{userId:true},
  initial:{count:0},
  reduce:function(obj,prev){prev.count++}}

  )


Sendinfo.getallday = function(user, callback) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var group={
//      key: {user:1,create_at:1},
        keyf: function(sendinfos) {
                var date = new Date(sendinfos.create_at);
                var dateKey = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+'';
                return {'day':dateKey,'user':sendinfos.user};//返回值
                            
                },//格式化日期
        cond: {'user':user}, //查询条件         cond: {'user':user, 'create_at': { $gt:firstDay,$lt:lastDay}}, //查询条件
        initial: {count:0}, //初始值
        reduce: function(obj, prev) {prev.count++;},
        finalize:{}
    };
    SendinfoModel.collection.group(
        group.keyf,
        group.cond, //查询条件
        group.initial, //初始值
       group.reduce,
       group.finalize,
       true,//reduce
       function(err,sendinfos){
          if (err) {
                return callback(err);
              }
          console.log("new Date(1):"+new Date().setDate(1)+",new Date(31):"+new Date().setDate(31)+","+sendinfos);
          callback(null,sendinfos);
       }
    );
  
};