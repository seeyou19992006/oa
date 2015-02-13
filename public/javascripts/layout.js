
BUI.use(['bui/grid','bui/data','bui/tree','bui/toolbar','bui/calendar'],function (Grid,Data,Tree,Toolbar,Calendar){

  (function(){
    var companies;
    var users;
    var createTree = function(){
      if(companies&&users){
        var array = companies.concat(users);
        var nodes = transData(array,'id','parentId','children','name');

        var tree = new Tree.TreeList({
          render : '#slide-nav',
          showLine : true,
          nodes : nodes,
          height:'100%'
          // expandAnimate : true,
          // itemCls : 'bui-menu-item',
          // elCls : 'bui-side-menu',
          // showIcons : false,
          // dirTpl : '<li class="menu-second"><i class="icon-chevron-left"></i><div class="bui-menu-title"><span class="bui-menu-title-text">{text}</span></div></li>',
          // leafTpl : '<li class="menu-leaf"><a href="{href}"><em>{text}</em></a></li>',
        });
        tree.render();

        //利用侧边菜单的样式来构造树形菜单
        // var menu = new Tree.TreeMenu({
        //   render : '#slide-nav',
        //   elCls : 'bui-side-menu',  // BUI默认未提供树形菜单的样式，可以自己覆写样式或者传入选项的模板
        //   itemCls : 'bui-menu-item',
        //   expandAnimate : true,
        //   showIcons : false,
        //   dirTpl : '<li class="menu-second"><i class="icon-chevron-left"></i><div class="bui-menu-title"><span class="bui-menu-title-text">{text}</span></div></li>',
        //   leafTpl : '<li class="menu-leaf"><a href="{href}"><em>{text}</em></a></li>',
        //   nodes : nodes
        // });
        // menu.render();

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

 //左侧菜单栏收缩
  $('.x-collapsed-btn').toggle(function(){
    $('.wrapper').addClass('dl-collapse');
    $(".bui-tree-menu").niceScroll().resize();
    $(".content-head").css("width" , "98%");
  },function(){
    $('.wrapper').removeClass('dl-collapse');
    $(".content-head").css("width" , "90%");
    $(".bui-tree-menu").niceScroll().resize();
  });

  new Calendar.DatePicker({
    trigger:'.calendar',
    autoRender : true
  });
            
});

