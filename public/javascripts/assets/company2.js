BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){

  (function(){
    var dialogAddCompany = new Overlay.Dialog({
      title:'新增分公司',
      contentId:'dialog_add_company',
      success:function(){
        formAddCompany.valid();
        if(!formAddCompany.isValid()) return;
        var record = formAddCompany.toObject();
        $.post('/companys/add',record,function(data){
          console.log(data);
          store.load();
          dialogAddCompany.close();
        });;
      }
    });
    $('#parentCompany').autoComplete({
      store:new Data.Store({
        url : '/companys/find',
        autoLoad:false, //自动加载数据
        pageSize:10,  // 配置分页数目
        totalProperty:'total',
        root:'data'
      }),
      hiddenInputs:[{name:'parentId',property:'id','data-rules':'{required:true}'} ],
    })
    var formAddCompany = new Form.Form({
      srcNode:'#form_add_company'
    }).render();
    $('#btn_add_company').click(function(){
      dialogAddCompany.show(); 
    })
  })();

  var dialogUpdateCompany;
  (function(){
    var formUpdateCompany = new Form.Form({
      srcNode:'#form_update_company'
    }).render();
    dialogUpdateCompany = new Overlay.Dialog({
      title:'修改分公司',
      contentId:'dialog_update_company',
      success:function(){
        formUpdateCompany.valid();
        if(!formUpdateCompany.isValid()) return;
        var record = formUpdateCompany.toObject();
        $.post('/companys/update',record,function(data){
          console.log(data);
          store.load();
          dialogUpdateCompany.close();
        });;
      }
    })
    //dialogUpdateCompany.render();
  })(); 

  var grid;
  var store;
  (function(){
    var columns = [
      {title:'公司名称',dataIndex:'name',width:100},
      {title:'所属公司',dataIndex:'parentCompany',width:70},
      {title:'备注',dataIndex:'remark',width:100},
      {title:'操作',width:100,renderer:function(){
        return '<button class="update button button-primary button-mini">编辑</button>'+
        '<button class="delete button button-primary button-mini">删除</button>';
      }}
    ];
    store = new Data.Store({
      url:'/companys/find',
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

  (function(){
    grid.on('cellclick',function(e){
      var record = e.record;
      var target = $(e.domTarget);
      if(target.hasClass('update')){
        Global.setEditValue('#form_update_company',record);
        dialogUpdateCompany.show();
        return false;
      }else if(target.hasClass('delete')){
        BUI.Message.Confirm('确定要删除?',function(){
          $.post('/companys/delete',{path:record.path},function(data){
            store.load();
          })       
        })
        return false;
      }
    })
  })();

  $("#form-search").submit(function(){
    store.load($(this).toObject());
    return false;
  })


})
  