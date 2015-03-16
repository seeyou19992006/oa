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
    5:'成交客户',
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

BUI.use(['bui/overlay','bui/form','bui/data','bui/grid'],function(Overlay,Form,Data,Grid){
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


    var dialogSearchCustomer = new Overlay.Dialog({
      title:'客户预查',
      contentId:'dialog_search_customer',
      width:700,
      success:function(){
        grid.clearData();
        dialogSearchCustomer.close();
      }
    });
    var formSearchCustomer = new Form.Form({
      srcNode:'#form_search_customer'
    }).render();

    var store = new Data.Store({
      url:'/customers/find/preview',
      root:'data',
      pageSize:10,
      totalProperty:'total',
      autoLoad:false
    });
    var columns = [
      {title:'客户姓名',dataIndex:'customerName'},
      {title:'性别',dataIndex:'sex',renderer:Global.sexRenderer},
      {title:'手机',dataIndex:'cellPhone',width:200},
      {title:'QQ号',dataIndex:'qqNumber'},
      {title:'添加人Id',dataIndex:'userId'},
    ];
    var grid = new Grid.Grid({
      width:'100%',
      render:'#grid_search_customer',
      columns:columns,
      forceFit:false,
      store:store,
    });
    grid.render();
    $('#btn_show_dialog_search_customer').click(function(){
      dialogSearchCustomer.show();
    })
    window.store1 = store;
    window.grid1 = grid;
    $('#btn_search_customer').click(function(){
      store.load(formSearchCustomer.toObject());
      // $.get('/customers/find/preview',formSearchCustomer.toObject(),function(data){
      //   var customer = data.data[0];
      //   if(customer){
      //     Global.setEditValue('#div_show_result_search_customer',customer);
      //   }
      // })
    })

});

