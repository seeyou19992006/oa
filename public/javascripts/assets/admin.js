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
        $.post('/users/add/admin',record,function(data){
          console.log(data);
          store.load();
          dialogAddUser.close();
        });;
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

  var grid;
  var store;
  (function(){
    var columns = [
      {title:'员工帐号',dataIndex:'userId',width:100},
      {title:'姓名',dataIndex:'userName',width:100},
      {title:'所属公司',dataIndex:'',width:100},
      {title:'员工类型',dataIndex:'role',width:100,renderer:Global.roleRender},
      {title:'操作',width:100,renderer:function(){
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
      }
    });
    grid.render();
  })();




  $("#form_search").submit(function(){
    store.load($(this).toObject());
    return false;
  })


})
  