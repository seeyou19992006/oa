BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){
   var form = new BUI.Form.HForm({
        srcNode : '#form-search'
      }).render();

  var grid;
  var store;
  (function(){
    var columns = [
      {title:'员工帐号',dataIndex:'userId',width:'30%'},
      {title:'姓名',dataIndex:'userName',width:'10%'},
      {title:'跟踪数',dataIndex:'count',width:'20%'},
      {title:'锁定数',dataIndex:'customerCount',width:'20%'},
      {title:'操作',renderer:function(){
        return    '<span class="grid-command showCustomer" title="详情">'           
              +     '<span class="x-icon x-icon-info showCustomer">'              
              +       '<i class="icon icon-white icon-eye-open showCustomer"></i>'   
              +     '</span>'                                          
              +   '</span>'
      }}
    ];
    store = new Data.Store({
      url:'/statistics/company/find',
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

    var dialog_grid_customer = new Overlay.Dialog({
      title:'员工跟踪记录',
      contentId:'dialog_grid_customer',
      width:780,
    })
    grid.on('cellclick',function(e){
      var record = e.record;
      var target = $(e.domTarget);
      if(target.hasClass('showCustomer')){
        dialog_grid_customer.show();
        return false;
      }      
    })
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
      width:750
    });
    grid.render();
    traceRecordStore = store;
  })();

  var grid_customer;
  (function(){
    var columns = [
      {title:'客户姓名',dataIndex:'customerName'},
      {title:'资金量',dataIndex:'money',width:60},
      {title:'客户类型',dataIndex:'customerType',renderer:Global.customerTypeRenderer},
      {title:'性别',dataIndex:'sex',renderer:Global.sexRenderer,width:40},
      {title:'手机',dataIndex:'cellPhone',width:'150px'},
      {title:'QQ号',dataIndex:'qqNumber'},
      {title:'操作',renderer:function(){
        return   '<span class="grid-command showRecord" title="查看跟踪">'           
              +     '<span class="x-icon x-icon-info showRecord">'              
              +       '<i class="icon icon-white icon-eye-open showRecord"></i>'   
              +     '</span>'                                          
              +   '</span>' ;              
      },width:80}
    ];
    store = new Data.Store({
      url:'/customers/find',
      root:'data',
      pageSize:10,
      totalProperty:'total',
      autoLoad:true
    });
    var grid = new Grid.Grid({
      width:'100%',
      render:'#grid_customer',
      columns:columns,
      forceFit:false,
      store:store,
    });
    grid.render();
    grid_customer = grid;

    $("#form-search-grid-customer").submit(function(){
      store.load($(this).toObject());
      return false;
    })
  })();

  (function(){
    var grid = grid_customer
    var dialogShowTraceRecord = new Overlay.Dialog({
      title:'跟踪记录',
      contentId:'dialog_grid_trace_record',
      width:780,
    })

    grid.on('cellclick',function(e){
      var record = e.record;
      var target = $(e.domTarget);
      if(target.hasClass('showRecord')){
        traceRecordStore.load({
          customerId:record._id
        },function(){
          dialogShowTraceRecord.show();
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
  