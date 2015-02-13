BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){

  (function(){
    var dialogAddCompany = new Overlay.Dialog({
      title:'新增分公司',
      contentId:'dialog_add_company',
      success:function(){
        var record = formAddCompany.toObject();
        $.post('/companys/add',record,function(data){
          console.log(data);
          dialogAddCompany.close();
        });;
      }
    });
    var formAddCompany = new Form.Form({
      srcNode:'#form_add_company'
    }).render();
    $('#parentCompany').autoComplete({
      store:new Data.Store({
        url : '/companys/find',
        autoLoad:false, //自动加载数据
        pageSize:10,  // 配置分页数目
        totalProperty:'total',
        root:'data'
      }),
      hiddenInputs:[{name:'parentId',property:'id'} ],
    })
    $('#btn_add_company').click(function(){
      dialogAddCompany.show(); 
    })
  })();  

  (function(){
    var dialogAddUser = new Overlay.Dialog({
      title:'新增员工',
      contentId:'dialog_add_user',
      width:600,
      success:function(){
        var record = formAddUser.toObject();
        $.post('/users/add',record,function(data){
          console.log(data);
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
        root:'data'
      }),
      hiddenInputs:[
        {name:'companyId',property:'id'},
        {name:'companyPath',property:'path'}
      ],
    });
  })();


  (function(){
    var dialogAddCustomer = new Overlay.Dialog({
      title:'新增客户',
      contentId:'dialog_add_customer',
      width:700,
      success:function(){
        var record = formAddCustomer.toObject();
        $.post('/customers/add',record,function(data){
          console.log(data);
          dialogAddCustomer.close();
          store.load();
        });;
      }
    });
    var formAddCustomer = new Form.Form({
      srcNode:'#form_add_customer'
    }).render();
    $('#btn_add_customer').click(function(){
      dialogAddCustomer.show(); 
    })
  })();
  
  (function(){
    var companies;
    var users;
    var createTree = function(){
      if(companies&&users){
        var array = companies.concat(users);
        var nodes = transData(array,'id','parentId','children','name');
        var tree = new Tree.TreeList({
          render : '#treeCompany',
          showLine : true,
          width:250,
          height:700,
          nodes : nodes
        });
        tree.render();
      }
    }
    $.get('/companys/find',function(data){
      companies = data.data;
      createTree();
    });
    $.get('/users/find',function(data){
      users = data.data;
      for(var i in users){
        users[i].parentId = users[i].companyId;
        users[i].name = users[i].userName;
        users[i].id = users[i]._id;
      }
      createTree();
    })
  })();


  var grid;
  var store;
  (function(){
    var columns = [
      {title:'客户姓名',dataIndex:'customerName',width:100},
      {title:'资金量',dataIndex:'money',width:70},
      {title:'客户类型',dataIndex:'customerType',width:100,renderer:Global.customerTypeRenderer},
      {title:'性别',dataIndex:'sex',width:60,renderer:Global.sexRenderer},
      // {title:'生日',dataIndex:'birthday',width:100},
      // {title:'省份',dataIndex:'provinceName',width:100},
      {title:'城市',dataIndex:'cityName',width:100},
      {title:'手机',dataIndex:'cellPhone',width:100},
      // {title:'电话',dataIndex:'phone',width:100},
      {title:'QQ号',dataIndex:'qqNumber',width:100},
      {title:'昵称',dataIndex:'nickname',width:100},
      {title:'身份证',dataIndex:'idCard',width:100},
      // {title:'地址',dataIndex:'address',width:100},
      // {title:'备注',dataIndex:'remark',width:100},
      {title:'操作',width:100,renderer:function(){
        return '<button class="addRecord button button-primary button-mini">A</button>'+
        '<button class="showRecord button button-primary button-mini">S</button>';
      }}
    ];
    store = new Data.Store({
      url:'/customers/find',
      root:'data',
      pageSize:10,
      totalProperty:'total',
      autoLoad:true
    });
    grid = new Grid.Grid({
      render:'#grid',
      columns:columns,
      store:store,
    });
    grid.render();
  })();

  var dialogAddTraceRecord;
  var formAddTraceRecord;
  (function(){
    dialogAddTraceRecord = new Overlay.Dialog({
      title:'新增跟踪记录',
      contentId:'dialog_add_trace_record',
      width:700,
      success:function(){
        var record = formAddTraceRecord.toObject();
        $.post('/traceRecords/add',record,function(data){
          console.log(data);
          dialogAddTraceRecord.close();
        });;
      }
    });
    formAddTraceRecord = new Form.Form({
      srcNode:'#form_add_trace_record'
    }).render();
    $('#btn_add_trace_record').click(function(){
      dialogAddTraceRecord.show(); 
    });
  })();

  var traceRecordStore;
  (function(){
    var columns = [
      {title:'跟踪内容',dataIndex:'traceContent',width:400},
      {title:'跟踪时间',dataIndex:'traceTime',width:265}
    ]
    var store = new Data.Store({
      url:'/traceRecords/find',
      root:'data',
      pageSize:10,
      totalProperty:'total',
      autoLoad:false
    });
    var grid = new Grid.Grid({
      render:'#grid_trace_record',
      columns:columns,
      store:store,
    });
    grid.render();
    traceRecordStore = store;
  })();

  (function(){
    var dialogShowTraceRecord = new Overlay.Dialog({
      title:'跟踪记录',
      contentId:'dialog_grid_trace_record',
      width:700,
    })

    grid.on('cellclick',function(e){
      var record = e.record;
      var target = $(e.domTarget);
      if(target.hasClass('addRecord')){
        record.customerId = record._id;
        record.customerTypeString = Global.customerTypeRenderer(record.customerType);
        Global.setEditValue('#form_add_trace_record',record);
        formAddTraceRecord.setRecord(record);
        dialogAddTraceRecord.show();
        return false;
      }else if(target.hasClass('showRecord')){
        traceRecordStore.load({
          customerId:record._id
        },function(){
          dialogShowTraceRecord.show();
        })
        return false;
      }
    })
  })();



})
  