BUI.use(['bui/overlay','bui/form','bui/tree','bui/data','bui/menu','bui/grid'],function(Overlay,Form,Tree,Data,Menu,Grid){
   var form = new BUI.Form.HForm({
        srcNode : '#form-search'
      }).render();

  var grid;
  var store;
  (function(){
    var columns = [
      {title:'员工帐号',dataIndex:'userId',width:'20%'},
      {title:'姓名',dataIndex:'userName',width:'20%'},
      {title:'电话跟踪',dataIndex:'count',width:'20%'},
      {title:'视频跟踪',dataIndex:'videoTraceCount',width:'20%'},
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
  })();

  $("#form-search").submit(function(){
    store.load($(this).toObject());
    return false;
  })


})
  