(function($){
  var cssToInt = function(cssStr){
    var css=0;
    if(cssStr){
    	var matches =  cssStr.match(/\S+px/);
    	if(matches){
    		matches = matches[0].match(/[^px]+/);
    		if(matches){
    			css = parseInt(matches[0]);
    			if(!css) css = 0;
    		}
    	}
    		css = parseFloat(cssStr.match(/\S+px/)[0].match(/[^px]+/)[0]);
    		if(!css) css = 0;
    }
    return css;
  }
  var getPosition = function($input){
    var height = $input.height();
    var top = $input.offset().top;
    var left = $input.offset().left;
    var paddingTop = cssToInt($input.css("padding-top"));
    var paddingBottom =  cssToInt($input.css("padding-bottom"));
    var borderTop = cssToInt($input.css("border-top"));
    var borderBottom = cssToInt($input.css("border-top"));
    var paddingLeft = cssToInt($input.css("padding-left"));
    var paddingRight =  cssToInt($input.css("padding-right"));
    var borderLeft = cssToInt($input.css("border-left"));
    var borderRight = cssToInt($input.css("border-right"));
    var resultTop = top +paddingTop+height+paddingBottom+borderTop+borderBottom;
    var resultLeft = left;
    var position =  {left:resultLeft+"px",top:resultTop+"px"};
    return position;
  }
  var activeDiv;
  var activeInput;
  $(window).resize(function(){
    if(activeDiv){
      activeDiv.css(getPosition(activeInput));
    }
  })
  $.fn.autoComplete = function(o){
    var handler = (function(){
      var handler = function(e,o){
        return new handler.prototype.init(e,o);
      };
      handler.prototype = {
        init:function(e,o){
          var $input=$(e),$realInput,$div,$ul,$btnLeft,$btnRight,$lis=[],$bar;
          var liIndex = -1,preInputVal='',start=0,blurFlag=0;
          var store,start,limit,totalCount;
          var selectFlag = false;
          var isJSRuning = false;
          var tabFlag = false;
          var focusFlag = false;
          var data = o.data;//唯一不继承的参数，会在查询时作为查询参数
          var timer = 0;
          if(o.requestBody){
            var proxy = o.store.get('proxy');
            proxy.get('ajaxOptions').contentType='application/json'
            proxy.__getAjaxOptions = proxy._getAjaxOptions;
            proxy._getAjaxOptions = function(type,params){
              params = JSON.stringify(params);
              return this.__getAjaxOptions(type,params);
            }
          }
          $input.attr("autocomplete","off");//关闭浏览器的自动完成
          o =$.extend({
            renderer:function(record){//渲染下拉列表
              return record.name;
            },
            setValue:function(record){//给input框赋值
              return record.name;
            },
            valueChanged:function(){//赋值后首次更改input框内容时调用
            },
            beforeLoad:function(data){//查询前调用，如果返回false,则不查询
              return true;
            },
            hiddenInputs:[],//{name:"xx",property:"id"}=><input value="record对象的id值" type="hidden" name="xx"/>
            ulCSS:{
              'border-left':'1px solid #999',
              'border-right':'1px solid #999',
              'border-top':'1px solid #999',
            },
            liCSS:{
               background:'#fff',
              'border-bottom':'1px solid #999',
              'text-align':'left',
              'padding-left':'5px',
              'height':'24px',
              'line-height':'24px',
            },
            pageBarLiCSS:{
              background:'#fff',
              'border-bottom':'1px solid #999',
            },
            liHoverCSS:{},
            liCursorCSS:{background:'#777'},
            divCSS:{'min-width':'200px'},
            keyProperty:'name',//关键字属性名
            required:false,//是否必填,如果是，则input框失去焦点时会选中第一条
          },o||{});

          var hiddenInputsMap ={} ;
          $(o.hiddenInputs).each(function(index,obj){
            var $hiddenInput = $('<input type="hidden">').insertAfter($input);
            for(var i in obj){
              if(i != 'property'){
                $hiddenInput.attr(i,obj[i]);
              }
            }
            hiddenInputsMap[obj.property] = $hiddenInput;
          })
          store = o.store;
          store.on('load',function(){
            if(typeof store.getResult() == "string"){
              store.setResult(JSON.parse(store.getResult()));
            }
          });
          limit = store.get('pageSize');
          $div = $('<div  style="position:absolute;display:block;z-index:99999"></div>').appendTo($("body")).hide();
          $div.css(o.divCSS);
          $ul = $('<ul></ul>').appendTo($div);
          $ul.css(o.ulCSS);
          for(var i=0;i<limit;i++){
            var $li = $('<li class="autocomplete-item"  data-index='+i+'></li>');
            $li.appendTo($ul);
            $lis.push($li);
            $li.click(function(event){
              $input.focus();
              var index= parseInt($(this).data('index'));
              var record = store.getResult()[index];
              $input.val($.trim(setValue(record,$input)));
              selectFlag = true;
              preInputVal = $input.val();
              liIndex = -1;
              changeCSS();
              for(var i in $lis){
                $lis[i].html('');
              }
              $div.hide();
            })
          }
          var changeCSS = function(){
            for(var i in $lis){
                $lis[i].css(o.liCSS);
                $lis[i].removeClass('autocomplete-item-cursor');
              }
            if($lis[liIndex]){
              $lis[liIndex].addClass("autocomplete-item-cursor")
              $lis[liIndex].css(o.liCursorCSS);
            }
          }
          var drawLi = function(){
            var records = o.store.getResult();
            if(records.length){
              $div.show();
            }else{
              $div.show();
            }
            for(var i = 0; i <limit;i++){
              if(records[i]){
                $lis[i].html(o.renderer(records[i])).show();
              }else{
                $lis[i].html(null).hide();
                $btnRight.attr({"disabled":"disabled"});
              }
            }
          }
          var setValue = function(record,$input){
            if($realInput){
              $realInput.val(record[o.realInputProperty]);
            }else if(o.hiddenInputs.length){
              for(var i in hiddenInputsMap){
                var $hiddenInput = hiddenInputsMap[i];
                $hiddenInput.val(record[i]);
              }
            }
            var value = o.setValue(record,$input);
            $input.nextAll(".valid-text").remove();
            return value;
            
          }
          var valueChanged = function(){
            if($realInput){
              $realInput.val("");
            }else if(o.hiddenInputs.length){
              for(var i in hiddenInputsMap){
                var $hiddenInput = hiddenInputsMap[i];
                $hiddenInput.val("");
              }
            }
            o.valueChanged();
          }
          $bar = $('<li style="text-align:right;"></li>').appendTo($ul);
          $bar.css(o.pageBarLiCSS);
          $btnLeft = $('<button type="button" disabled="disabled" class="button button-primary button-small" data-pageChange="-'+limit+'"><</button>').appendTo($bar);
          $btnRight = $('<button type="button" class="button button-primary button-small " data-pageChange="'+limit+'">></button>').appendTo($bar);
          $bar.find('button').click(function(event){
            $input.focus();
            var d = parseInt($(this).data('pagechange'));
            start +=d;
            var nextStart = start + d;
            if(start<store.getTotalCount()){
              store.load({start:start},function(){
                totalCount = store.getTotalCount();
                $btnLeft.removeAttr("disabled");
                $btnRight.removeAttr("disabled");
                if(start+limit>=totalCount){
                  $btnRight.attr({"disabled":"disabled"});
                };
                if(start==0){
                  $btnLeft.attr({"disabled":"disabled"});
                }
                if(liIndex>=store.getResult().length){
                  liIndex = store.getResult().length-1;
                  changeCSS();
                }
                drawLi();
              })
            }
          })
          $input.focus(function(){
            activeInput = $input;
            activeDiv = $div;
            if(!timer){
              startSuggest();
            }
            $div.css(getPosition($input));
            // $div.css('left',$input.position().left);
            if($div.is(":hidden") && !selectFlag && ($.trim($input.val())==preInputVal||!$.trim($input.val()).length)){
              $bar.hide();
              $div.show();
              preInputVal = Math.random();
            }else if(liIndex>=store.getResult().length){
              liIndex = o.store.getResult().length-1;
              changeCSS();
            }
          }).keydown(function(event){
            var length = store.getResult().length;
            switch(event.keyCode){
              case 38:
                if(liIndex==-1){
                  liIndex = length;
                }
                liIndex--;
                changeCSS();
                break;
              case 40:
                liIndex ++;
                if(liIndex >= length){
                  liIndex = -1;
                };
                changeCSS();
                break;
              case 37:
                if(liIndex != -1){
                  if(!$btnLeft.attr('disabled')){
                    $btnLeft.click();
                  }
                  event.preventDefault();
                };
                break;
              case 39:
                if(liIndex != -1){
                  if(!$btnRight.attr('disabled')){
                    $btnRight.click();
                  }
                  event.preventDefault();
                };
                break;
              case 9:
                $div.hide();
                clearInterval(timer);
                timer = 0;
                break;
            }
          }).blur(function(){
            tabFlag = true;
          }).keypress(function(event){
            if(13 == event.keyCode){
              if(liIndex != -1){
                $lis[liIndex].click();
                liIndex = -1;
                changeCSS();
                $div.hide();
              }else{
                if(store.getResult().length == 1 && !$div.is(":hidden")){
                  $lis[0].click();
                  liIndex = -1;
                  changeCSS();
                  $div.hide();
                }
              }
              event.preventDefault();
            }
          })
          var startSuggest = function(){
            timer = setInterval(function(){
              var inputVal = $.trim($input.val());
              if(preInputVal!=inputVal){
                if(selectFlag){
                 valueChanged();
                }
                selectFlag = false;
                preInputVal = inputVal;
                start = 0;
                var obj = {start:0};
                obj = $.extend(data,obj);
                obj[o.keyProperty] = inputVal;
                if(o.beforeLoad(obj)){
                  store.load(obj,function(){
                    if(store.getTotalCount()<=limit){
                      $bar.hide();
                    }else{
                      $bar.show();
                    }
                    liIndex = -1;
                    changeCSS();
                    $btnLeft.attr({"disabled":"disabled"});
                    $btnRight.removeAttr("disabled");
                    drawLi();
                  });
                }else{
                  for(var i in $lis){
                    $lis[i].html('');
                  }
                }
              }
            },200);
          }
          $(document).click(function(event){
            var target = event.target;
            if($input[0] !=target &&$div[0]!=target&&!$div.find(target).length){
              $div.hide();
              clearInterval(timer);
              timer = 0;
              if(o.required&&!selectFlag&&activeInput == $input){
                var record = store.getResult()[0];
                if(record){
                  $input.val($.trim(setValue(record,$input)));
                  selectFlag = true;
                  preInputVal = $input.val();
                  liIndex = -1;
                  changeCSS();
                  for(var i in $lis){
                    $lis[i].html('');
                  }
                }
              }
            }
          })
        }
      }
      handler.prototype.init.protype = handler.prototype;
      return handler;
    })();
    return this.each(function(){
      handler(this,o);
    });
  }
})(jQuery);