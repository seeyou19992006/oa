BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){


  var grid;
  var store;
  (function(){
    var columns = [
      {title:'时间段',dataIndex:'time'},
      {title:'总跟踪数',dataIndex:'total',renderer:function(value,obj){
        if(obj.phone&&obj.video){
          return obj.phone +obj.video;
        }
      }},
      {title:'电话跟踪',dataIndex:'phone'},
      {title:'视频跟踪',dataIndex:'video'},
    ];
    store = new Data.Store({
      url:'/statistics/user/find',
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

  $("#form-search").submit(function(){
    store.load($(this).toObject());
    return false;
  });
  //dialog_grid_customer
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


})
  