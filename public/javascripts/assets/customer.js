BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){
  (function(){
    var dialogAddCustomer = new Overlay.Dialog({
      title:'新增客户',
      contentId:'dialog_add_customer',
      width:700,
      success:function(){
        formAddCustomer.valid();
        if(!formAddCustomer.isValid()) return;
        var record = formAddCustomer.toObject();
        $.post('/customers/add',record,function(data){
          console.log(data);
          formAddCustomer.clearFields();
          formAddCustomer.clearErrors();
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

  var grid;
  var store;
  (function(){
    var columns = [
      {title:'客户姓名',dataIndex:'customerName'},
      {title:'资金量',dataIndex:'money'},
      {title:'客户类型',dataIndex:'customerType',renderer:Global.customerTypeRenderer},
      {title:'性别',dataIndex:'sex',renderer:Global.sexRenderer},
      // {title:'生日',dataIndex:'birthday',width:100},
      // {title:'省份',dataIndex:'provinceName',width:100},
      {title:'城市',dataIndex:'cityName'},
      {title:'手机',dataIndex:'cellPhone'},
      // {title:'电话',dataIndex:'phone',width:100},
      {title:'QQ号',dataIndex:'qqNumber'},
      {title:'昵称',dataIndex:'nickname'},
      {title:'身份证',dataIndex:'idCard'},
      // {title:'地址',dataIndex:'address',width:100},
      // {title:'备注',dataIndex:'remark',width:100},
      {title:'操作',renderer:function(){
        return '<button class="update button button-primary button-mini" title="编辑客户">E</button>'+
        '<button class="delete button button-primary button-mini" title="删除">D</button>' +
        '<button class="addRecord button button-primary button-mini" title="新增跟踪">A</button>'+
        '<button class="showRecord button button-primary button-mini" title="查看跟踪">S</button>';
      },width:120}
    ];
    store = new Data.Store({
      url:'/customers/find',
      root:'data',
      pageSize:10,
      totalProperty:'total',
      autoLoad:true
    });
    grid = new Grid.Grid({
      width:'100%',
      render:'#grid',
      columns:columns,
      forceFit:false,
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

  var dialogUpdateCustomer;
  var formUpdateCustomer;
  (function(){
    dialogUpdateCustomer = new Overlay.Dialog({
      title:'编辑客户',
      contentId:'dialog_update_customer',
      width:700,
      success:function(){
        formUpdateCustomer.valid();
        if(!formUpdateCustomer.isValid()) return;
        var record = formUpdateCustomer.toObject();
        $.post('/customers/update',record,function(data){
          console.log(data);
          store.load();
          formUpdateCustomer.clearFields();
          formUpdateCustomer.clearErrors();
          dialogUpdateCustomer.close();
        });
      }
    });
    formUpdateCustomer = new Form.Form({
      srcNode:'#form_update_customer'
    }).render();
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
      }else if(target.hasClass('update')){
        Global.setEditValue('#form_update_customer',record);
        formUpdateCustomer.setRecord(record);
        dialogUpdateCustomer.show();
        return false;
      }else if(target.hasClass('delete')){
        BUI.Message.Confirm('确定要删除?',function(){
          $.post('/customers/delete',{_id:record._id},function(data){
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
  