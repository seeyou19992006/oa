BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){

  (function(){
    var dialogAddUser = new Overlay.Dialog({
      title:'新增员工',
      contentId:'dialog_add_user',
      width:600,
      success:function(){
        formAddUser.valid();
        if(!formAddUser.isValid()) return;
        var record = formAddUser.toObject();
        $.post('/users/add/user',record,function(data){
          console.log(data);
          store.load();
          formAddUser.clearFields();
          formAddUser.clearErrors();
          dialogAddUser.close();
        });
      }
    });
    var formAddUser = new Form.Form({
      srcNode:'#form_add_user'
    }).render();
    $('#btn_add_user').click(function(){
      dialogAddUser.show(); 
    });
    $('#input_companyId').autoComplete({
      store:new Data.Store({
        url : '/companys/find',
        autoLoad:false, //自动加载数据
        pageSize:10,  // 配置分页数目
        totalProperty:'total',
        root:'data',
        width:'250px'
      }),
      hiddenInputs:[
        {name:'companyId',property:'id'},
        {name:'companyPath',property:'path'}
      ],
    });
  })();

  var dialogUpdateUser;
  var formUpdateUser;
  (function(){
    dialogUpdateUser = new Overlay.Dialog({
      title:'编辑员工',
      contentId:'dialog_update_user',
      width:600,
      success:function(){
        formUpdateUser.valid();
        if(!formUpdateUser.isValid()) return;
        var record = formUpdateUser.toObject();
        $.post('/users/update/user',record,function(data){
          console.log(data);
          store.load();
          formUpdateUser.clearFields();
          formUpdateUser.clearErrors();
          dialogUpdateUser.close();
        });
      }
    });
    formUpdateUser = new Form.Form({
      srcNode:'#form_update_user'
    }).render();
  })();

  var grid;
  var store;
  (function(){
    var columns = [
      {title:'员工帐号',dataIndex:'userId',width:'20%'},
      {title:'姓名',dataIndex:'userName',width:'20%'},
      {title:'所属公司',dataIndex:'',width:'20%'},
      {title:'员工类型',dataIndex:'role',width:'20%',renderer:Global.roleRender},
      {title:'操作',width:'20%',renderer:function(){
        // return '<button class="update button button-primary button-mini">编辑</button>'+
        // '<button class="delete button button-primary button-mini">删除</button>';
        return    '<span class="grid-command update" title="编辑">'           
              +     '<span class="x-icon x-icon-warning update">'              
              +       '<i class="icon icon-white icon-edit update"></i>'   
              +     '</span>'                                          
              +   '</span>'
              +   '<span class="grid-command changeCustomer" title="转移客户">'           
              +     '<span class="x-icon x-icon-warning changeCustomer">'              
              +       '<i class="icon icon-white icon-edit changeCustomer"></i>'   
              +     '</span>'                                          
              +   '</span>'
              +   '<span class="grid-command delete" title="删除">'           
              +     '<span class="x-icon x-icon-error delete">'              
              +       '<i class="icon icon-white icon-trash delete"></i>'   
              +     '</span>'                                          
              +   '</span>' ;
      }}
    ];
    store = new Data.Store({
      url:'/users/find/company',
      root:'data',
      pageSize:10,
      totalProperty:'total',
      autoLoad:true
    });
    grid = new Grid.Grid({
      render:'#grid',
      columns:columns,
      store:store,
      bbar:{
        pagingBar:true
      },
      width:'100%'
    });
    grid.render();
  })();

  var dialog_grid_customer = new Overlay.Dialog({
    title:'转移客户',
    contentId:'dialog_grid_customer',
    width:780,
  });

  (function(){
    grid.on('cellclick',function(e){
      var record = e.record;
      var target = $(e.domTarget);
      if(target.hasClass('update')){
        record.roleString = Global.roleRender(record.role);
        record.effective +='';
        Global.setEditValue('#form_update_user',record);
        formUpdateUser.setRecord(record);
        dialogUpdateUser.show();
        return false;
      }else if(target.hasClass('delete')){
        BUI.Message.Confirm('确定要删除?',function(){
          $.post('/users/delete/user',{userId:record.userId},function(data){
            store.load();
          })       
        })
        return false;
      }else if(target.hasClass('changeCustomer')){
        grid_customer_store.load({fromUserId:record.userId});
        changeParam.ignoreUserIds = [record.userId];
        dialog_grid_customer.show();
        return false;
      }
    })
  })();

  var grid_customer;
  var grid_customer_store;
  (function(){
    var columns = [
      {title:'客户姓名',dataIndex:'customerName'},
      {title:'资金量',dataIndex:'money',width:60},
      {title:'客户类型',dataIndex:'customerType',renderer:Global.customerTypeRenderer},
      {title:'性别',dataIndex:'sex',renderer:Global.sexRenderer,width:40},
      {title:'手机',dataIndex:'cellPhone',width:'150px'},
      {title:'QQ号',dataIndex:'qqNumber'},
    ];
    var store = new Data.Store({
      url:'/customers/find/company',
      root:'data',
      pageSize:10,
      totalProperty:'total',
      autoLoad:false
    });
    var grid = new Grid.Grid({
      width:'100%',
      render:'#grid_customer',
      columns:columns,
      forceFit:false,
      store:store,
      plugins : [Grid.Plugins.CheckSelection],
      bbar:{
        pagingBar:true
      },
    });
    grid.render();
    grid_customer = grid;
    grid_customer_store = store;
    $("#form-search-grid-customer").submit(function(){
      store.load($(this).toObject());
      return false;
    })
  })();


  $("#form-search").submit(function(){
    store.load($(this).toObject());
    return false;
  })

  var changeParam = {
    ignoreUserIds:[]
  }
  $("#toUserId").autoComplete({
    hiddenInputs:[{name:'toUserId',property:'userId'}],
    renderer:function(record){
      return record.userName;
    },
    setValue:function(record){
      return record.userName;
    },
    data:changeParam,
    store: new Data.Store({
      url : '/users/find/autocomplete',
      root : "data",
      autoLoad : false,
      pageSize : 10,
      totalProperty : "total",
      proxy : {
        ajaxOptions : {
          traditional : true,
          type : "post",
        }
      }
    }),
  });


})
  