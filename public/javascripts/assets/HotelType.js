BUI.use(['bui/grid','bui/data','bui/toolbar'],function(Grid,Data,Toolbar){
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
   	grid.set('multipleSelect', true);
    grid.render();
    var bar = new Toolbar.NumberPagingBar({
      render : '#page-bar',
      autoRender: true,
      elCls : 'pagination',
      store : store,
      maxLimitCount:4, //起始位置的最少按钮数
      showRangeCount:2 //当前页，2边的按钮数目，默认为1
    });
  })();
});