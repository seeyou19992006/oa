function transData(a, idStr, pidStr, chindrenStr,textStr){
  var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr,text = textStr, i = 0, j = 0,k=0, len = a.length;
  for(; i < len; i++){
    hash[a[i][id]] = a[i];
  }
  for(; j < len; j++){
    var aVal = a[j], hashVP = hash[aVal[pid]];
    aVal.text = aVal[text];
    aVal.expanded = true;
    if(hashVP){
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(aVal);
    }else{
      r.push(aVal);
    }
  }
  return r;
}

(function($){
  //form转object插件 $(formSelector).toObject();
  $.fn.toObject = function(){
     var array = $(this).serializeArray(),
        result = {},self = $(this);
        $(array).each(function(index,item){
          var name = item.name;
          var $field = self.find("[name="+name+"]") 
          var type = $field.attr('type');
          type = type==undefined?type:type.toLowerCase();
          if(type!="checkbox" || $field.data("single")){ //不是checkbox直接放进去
              result[name] = $.trim(item.value);
          }else{ //是checkbox使用数组
            if(!result[name]){
              result[name] = [];
            }
              result[name].push($.trim(item.value));
          }
      });
        return result;
  }
  $.fn.setRecord = function(record){
    var $form = $(this);
    for(var i in record){
      var $dom = $form.find("[name="+i+"]");
      switch($dom.prop('tagName')){
        case 'INPUT' :
          var attrtype = $dom.attr('type');
          if(attrtype == 'text' || 'hidden'){
            $dom.val(record[i]);
            
          }else if(attrtype == 'checkbox'){
            if($.isArray(record[i])){
              var arr = record[i];
              for(var i in arr){
                if($dom.val()==arr[i]){
                  $dom.attr("checked",true);
                  break;
                }
              }
            }else if($dom.val()==record[i]){
              $dom.attr("checked",true);
            }
          }else if(attrtype=='radio'){
            if($dom.val()==record[i]){
              $dom.attr('checked',true);
            }
          }else{//loki修改，默认input框为text
            $dom.val(record[i]);
          }
        case 'SELECT':
        case 'TEXTAREA':
          $dom.val(record[i]);
          $dom.trigger('change');
          break;
        default:
          break;  
      }
    }
  }

  //分页栏总数插件$(divSelector).paging(store)
  $.fn.paging = function(store){
    var str = '<div class="page-bar-row"><div class="span"><i>共<span class="pagetotal"></span>条</i><i>每页<select class="pagesize"><option value="10">10</option><option value="20">20</option><option value="30">30</option></select>条</i></div><div class="page-bar"></div></div>';
    var $self = $(this);
    $self.append(str);
    BUI.use(['bui/toolbar'],function(Toolbar){
      var NumerPBar = Toolbar.NumberPagingBar;
      var bar = new NumerPBar({
        render : $self.find(".page-bar"),
        autoRender: true,
        elCls : 'pagination',
        store : store,
        maxLimitCount:4, //起始位置的最少按钮数
        showRangeCount:2 //当前页，2边的按钮数目，默认为1
      });
      $self.find('.pagesize').change(function() {
        var pageSize = parseInt($(this).val());
        store.set({pageSize : pageSize});
        bar.set({pageSize : pageSize});
        bar.jumpToPage(1);
      });
      store.on("load", function(e) {
        var totalCount = e.target.getTotalCount();
        var pageIndex = e.target.get("pageIndex");
        var records = e.target.getResult();
        //如果当前页无记录且不为第一页，则请求前一页
        if(((!records || !records.length) && pageIndex)){
          bar.jumpToPage(pageIndex);
        }
        //当store加载完成时改变页面totalCount的值
        $self.find(".pagetotal").html(totalCount);
      });
    })
  }
})(jQuery);