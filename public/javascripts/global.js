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
      }else if(dom.tagName == 'SELECT'){
        $dom.val(fieldValue);
      }else{
        $dom.text(fieldValue);
      }
    }else{
      if(dom.tagName == 'INPUT'){
        $dom.val('');
      }else if(dom.tagName == 'TEXTAREA'){
        $dom.val('');
      }
    }
  })
};

function $ajax(url, obj,callback) {
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(obj),
    dataType: 'json',
    contentType: "application/json",
    success: function(data){
      callback(data)
    },
    error: function (data) {
    }
  });
}

BUI.use(['bui/overlay','bui/form','bui/data'],function(Overlay,Form,Data){
    var dialogChangePassword = new Overlay.Dialog({
      title:'修改密码',
      contentId:'dialog_chang_password',
      width:200,
      success:function(){
        formChangePassword.valid();
        if(!formChangePassword.isValid()) return;
        var record = formChangePassword.toObject();
        $.post('/users/changePassword',record,function(data){
          if(data.ret){
            formChangePassword.clearFields();
            formChangePassword.clearErrors();
            dialogChangePassword.close();
          }else{
            BUI.Message.Alert(data.msg);
            if(data.action){
              window.location.href=window.location.href;
            }
          }

        });
      }
    });
    var formChangePassword = new Form.Form({
      srcNode:'#form_chang_password'
    }).render();
    $('#btn_change_password').click(function(){
      dialogChangePassword.show(); 
    });
});

