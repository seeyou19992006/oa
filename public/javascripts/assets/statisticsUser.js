BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){
  var form = new BUI.Form.HForm({
    srcNode : '#form-search'
  }).render();

  var grid;
  var store;
  (function(){
    var columns = [
      {title:'总跟踪数',dataIndex:'total',renderer:function(value,obj){
        return obj.phone +obj.video;
      },width:'25%'},
      {title:'电话跟踪',dataIndex:'phone',width:'25%'},
      {title:'视频跟踪',dataIndex:'video',width:'25%'},
      {title:'锁定客户数',dataIndex:'customerCount',width:'25%'},
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


  (function(){
    var $queryTimeStart = $("#queryTimeStart");
    var $queryTimeEnd = $("#queryTimeEnd");
    $("#quickChoice").click(function(){
      switch(this.value){
        case '1':
          $queryTimeStart.val(moment().format('YYYY-MM-DD'));
          $queryTimeEnd.val(moment().format('YYYY-MM-DD'));
          break;
        case '2':
          $queryTimeStart.val(moment().add('days',- moment().days()).format('YYYY-MM-DD'));
          $queryTimeEnd.val(moment().format('YYYY-MM-DD'));
          break;
        case '3':
          $queryTimeStart.val(moment().format('YYYY-MM-01'));
          $queryTimeEnd.val(moment().format('YYYY-MM-DD'));
          break;
        case '4':
          $queryTimeStart.val(moment().add('months',- 1).format('YYYY-MM-DD'));
          $queryTimeEnd.val(moment().format('YYYY-MM-DD'));
          break;
        case '5':
          $queryTimeStart.val(moment().add('months',- 3).format('YYYY-MM-DD'));
          $queryTimeEnd.val(moment().format('YYYY-MM-DD'));
          break;
        case '6':
          $queryTimeStart.val(moment().add('months',- 6).format('YYYY-MM-DD'));
          $queryTimeEnd.val(moment().format('YYYY-MM-DD'));
          break;
        case '7':
          $queryTimeStart.val(moment().add('years',- 1).format('YYYY-MM-DD'));
          $queryTimeEnd.val(moment().format('YYYY-MM-DD'));
          break;
      }
      $('#form-search').submit();
    })
  })();

})
  