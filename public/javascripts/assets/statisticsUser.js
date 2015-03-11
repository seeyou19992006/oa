BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){


  var grid;
  var store;
  (function(){
    var columns = [
      {title:'时间段',dataIndex:'time'},
      {title:'总跟踪数',dataIndex:'total'},
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

  $("#form_search").submit(function(){
    store.load($(this).toObject());
    return false;
  })



})
  