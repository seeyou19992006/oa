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
          if(data.ret){
            BUI.Message.Alert(data.msg,'success');
            formAddCustomer.clearFields();
            formAddCustomer.clearErrors();
            dialogAddCustomer.close();
            store.load();
          }else{
            BUI.Message.Alert(data.msg,'error');
          }
        });;
      }
    });
    var formAddCustomer = new Form.Form({
      srcNode:'#form_add_customer'
    }).render();
    $('#btn_add_customer').click(function(){
      formAddCustomer.setRecord({
        customerType:1,
        sex:1
      })
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
      {title:'手机',dataIndex:'cellPhone',width:150},
      {title:'QQ号',dataIndex:'qqNumber',renderer:Global.qqRender},
      {title:'昵称',dataIndex:'nickname'},
      {title:'身份证',dataIndex:'idCard'},
      {title:'最后跟踪时间',dataIndex:'traceTime',width:200},
      {title:'操作',renderer:function(){
        return    '<span class="grid-command update" title="编辑客户">'           
              +     '<span class="x-icon x-icon-warning update">'              
              +       '<i class="icon icon-white icon-edit update"></i>'   
              +     '</span>'                                          
              +   '</span>'
              +   '<span class="grid-command delete" title="删除">'           
              +     '<span class="x-icon x-icon-error delete">'              
              +       '<i class="icon icon-white icon-trash delete"></i>'   
              +     '</span>'                                          
              +   '</span>'
              +   '<span class="grid-command addRecord" title="新增跟踪">'           
              +     '<span class="x-icon x-icon-success addRecord">'              
              +       '<i class="icon icon-white  icon-plus addRecord"></i>'   
              +     '</span>'                                          
              +   '</span>'
              +   '<span class="grid-command showRecord" title="查看跟踪">'           
              +     '<span class="x-icon x-icon-info showRecord">'              
              +       '<i class="icon icon-white icon-eye-open showRecord"></i>'   
              +     '</span>'                                          
              +   '</span>' ;              
      },width:140}
    ];
    store = new Data.Store({
      url:'/customers/find',
      root:'data',
      pageSize:100,
      totalProperty:'total',
      autoLoad:true,
      sortInfo : {
        field : 'traceTime',
        direction : 'ASC' //升序ASC，降序DESC
      },
      remoteSort: true
    });
    grid = new Grid.Grid({
      width:'100%',
      render:'#grid',
      columns:columns,
      forceFit:false,
      store:store,
      bbar:{
        pagingBar:true
      }
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
          store.load();
          dialogAddTraceRecord.close();
        });;
      }
    });
    formAddTraceRecord = new Form.Form({
      srcNode:'#form_add_trace_record'
    }).render();
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
      {title:'跟踪时间',dataIndex:'traceTime',width:215},
      {title:'跟踪类型',dataIndex:'traceType',width:100,renderer:Global.traceTypeRenderer}
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
      width:750,
      tableCls:'min-height',
      bbar:{
        pagingBar:true
      }
    });
    grid.render();
    traceRecordStore = store;
  })();

  (function(){
    var dialogShowTraceRecord = new Overlay.Dialog({
      title:'跟踪记录',
      contentId:'dialog_grid_trace_record',
      width:780,
    })

    grid.on('cellclick',function(e){
      var record = e.record;
      var target = $(e.domTarget);
      if(target.hasClass('addRecord')){
        record.customerId = record._id;
        record.customerTypeString = Global.customerTypeRenderer(record.customerType);
        formAddTraceRecord.clearFields();
        formAddTraceRecord.clearErrors();
        Global.setEditValue('#form_add_trace_record',record);
        record.traceType = 1;
        formAddTraceRecord.setRecord(record);
        dialogAddTraceRecord.show();
        return false;
      }else if(target.hasClass('showRecord')){
        traceRecordStore.load({
          customerId:record._id,
          start:0
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

  $("#form-search").submit(function(){
    store.load($(this).toObject());
    return false;
  })



})
  