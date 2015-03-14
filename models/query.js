var Param  = function(param){
  this.start = param.start;
  this.limit = param.limit;
  param.name = new RegExp(param.name);
  this.condition = param;
};

var Query = function(obj){
  this.param = obj.param
  this.model = obj.model;
  this.page = obj.page;
  this.sort = obj.sort;
}

Query.prototype.query = function(callback){
  var that = this;
  var query = that.model.find(that.param);
  if(that.page){
    query.skip(that.page.start);
    query.limit(that.page.limit);
  }
  if(that.sort){
    query.sort(that.sort);
  }
  query.exec(function(err,docs){
    if(err){
    }else{
      that.model.count(that.param,function(err,count){
        var result = {
          total:count,
          data:docs
        };
        console.warn('*******Find '+count+' results ! ***********************************************');
        callback(err,result);
      })
    }
  })
}

module.exports = Query;