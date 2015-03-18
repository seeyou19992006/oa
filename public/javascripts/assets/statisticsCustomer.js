BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){
  var form = new BUI.Form.HForm({
    srcNode : '#form-search'
  }).render();
  var grid;
  var store;
  (function(){
    var columns = [
      {title:'客户姓名',dataIndex:'customerName'},
      {title:'员工ID',dataIndex:'userId'},
      {title:'资金量',dataIndex:'money'},
      {title:'客户类型',dataIndex:'customerType',renderer:Global.customerTypeRenderer},
      {title:'性别',dataIndex:'sex',renderer:Global.sexRenderer},
      {title:'手机',dataIndex:'cellPhone',width:150},
      {title:'QQ号',dataIndex:'qqNumber'},
      {title:'昵称',dataIndex:'nickname'},
      {title:'身份证',dataIndex:'idCard'},
      {title:'最后跟踪时间',dataIndex:'traceTime',width:200},
      {title:'操作',renderer:function(){
        return    '<span class="grid-command showRecord" title="查看跟踪">'           
              +     '<span class="x-icon x-icon-info showRecord">'              
              +       '<i class="icon icon-white icon-eye-open showRecord"></i>'   
              +     '</span>'                                          
              +   '</span>' ;              
      },width:140}
    ];
    store = new Data.Store({
      url:'/customers/find/companyStatistics',
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
      bbar:{
        pagingBar:true
      },
    });
    grid.render();
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
      bbar:{
        pagingBar:true
      },
      width:750
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

  $("#form-search-userId").autoComplete({
    hiddenInputs:[{name:'userId',property:'userId'}],
    renderer:function(record){
      return record.userName;
    },
    setValue:function(record){
      return record.userName;
    },
    store: new Data.Store({
      url : '/users/find/autocomplete',
      root : "data",
      autoLoad : true,
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
  