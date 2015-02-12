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
  }
}

Global.sexRenderer = function(value,obj,index){
  return Global.sex[value];
}
Global.customerTypeRenderer = function(value,obj,index){
  return Global.customerType[value];
}

Global.setEditValue = function(parent,record){
  $(parent).find('[data-view]').each(function(index,dom){
    var $dom = $(dom);
    var field = $dom.data('view');
    var fieldValue = record[field];
    if(fieldValue!=undefined){
      if(dom.tagName == 'INPUT'){
        $dom.val(fieldValue);
      }else{
        $dom.text(fieldValue);
      }
    }
  })
}