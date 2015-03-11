var Global = {
  sex:{
    1:'男',
    2:'女'
  },
  customerType:{
    1:'准客户',
    2:'沟通潜力客户',
    3:'一般客户',
    4:'未有兴趣',
    5:'本地化客户',
    6:'黑名单',
  },
  role:{
    0:'超级管理员',
    1:'管理员',
    2:'普通员工'
  },
  traceType:{
    1:'电话跟踪',
    2:'视频跟踪'
  }
}

Global.sexRenderer = function(value,obj,index){
  return Global.sex[value];
}
Global.customerTypeRenderer = function(value,obj,index){
  return Global.customerType[value];
}
Global.roleRender = function(value,obj,index){
  return Global.role[value];
}
Global.traceTypeRenderer = function(value,obj,index){
  return Global.traceType[value];
}


Global.setEditValue = function(parent,record){
  $(parent).find('[data-view]').each(function(index,dom){
    var $dom = $(dom);
    var field = $dom.data('view');
    var fieldValue = record[field];
    if(fieldValue!=undefined){
      if(dom.tagName == 'INPUT'){
        $dom.val(fieldValue);
      }else if(dom.tagName == 'TEXTAREA'){
        $dom.val(fieldValue);
      }else{
        $dom.text(fieldValue);
      }
    }
  })
}

//时间格式化
Date.prototype.format = function (fmt) { //author: meizz 
var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
};
if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
for (var k in o)
if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
return fmt;
}
