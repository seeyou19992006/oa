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
        return '<button class="update button button-primary button-mini">编辑</button>'+
        '<button class="delete button button-primary button-mini">删除</button>';
      }}
    ];
    store = new Data.Store({
      url:'/users/find',
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
      }
    })
  })();



  $("#form_search").submit(function(){
    store.load($(this).toObject());
    return false;
  })


})
  