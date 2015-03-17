(function(d){var a=function(f){var g=0;if(f){var h=f.match(/\S+px/);if(h){h=h[0].match(/[^px]+/);if(h){g=parseInt(h[0]);if(!g){g=0}}}g=parseFloat(f.match(/\S+px/)[0].match(/[^px]+/)[0]);if(!g){g=0}}return g};var c=function(o){var r=o.height();var p=o.offset().top;var i=o.offset().left-d("body").offset().left;var t=a(o.css("padding-top"));var f=a(o.css("padding-bottom"));var j=a(o.css("border-top"));var n=a(o.css("border-top"));var h=a(o.css("padding-left"));var g=a(o.css("padding-right"));var l=a(o.css("border-left"));var q=a(o.css("border-right"));var m=p+t+r+f+j+n;var s=i;var k={left:s+"px",top:m+"px"};return k};var b;var e;d(window).resize(function(){if(b){b.css(c(e))}});d.fn.autoComplete=function(g){var f=(function(){var h=function(i,j){return new h.prototype.init(i,j)};h.prototype={init:function(J,B){var j=d(J),D,L,x,q,M,u=[],l;var O=-1,A="",r=0,C=0;var t,r,K,I;var n=false;var m=false;var G=false;var w=false;var P=B.data;var z=0;if(B.requestBody){var F=B.store.get("proxy");F.get("ajaxOptions").contentType="application/json";F.__getAjaxOptions=F._getAjaxOptions;F._getAjaxOptions=function(i,o){o=JSON.stringify(o);return this.__getAjaxOptions(i,o)}}j.attr("autocomplete","off");B=d.extend({renderer:function(i){return i.name},setValue:function(i){return i.name},valueChanged:function(){},beforeLoad:function(i){return true},hiddenInputs:[],ulCSS:{"border-left":"1px solid #999","border-right":"1px solid #999","border-top":"1px solid #999",},liCSS:{background:"#fff","border-bottom":"1px solid #999","text-align":"left","padding-left":"5px","height":"24px","line-height":"24px",},pageBarLiCSS:{background:"#fff","border-bottom":"1px solid #999",},liHoverCSS:{},liCursorCSS:{background:"#777"},divCSS:{"min-width":"200px"},keyProperty:"name",required:false,},B||{});var H={};d(B.hiddenInputs).each(function(o,R){var S=d('<input type="hidden">').insertAfter(j);for(var Q in R){if(Q!="property"){S.attr(Q,R[Q])}}H[R.property]=S});t=B.store;t.on("load",function(){if(typeof t.getResult()=="string"){t.setResult(JSON.parse(t.getResult()))}});K=t.get("pageSize");L=d('<div  style="position:absolute;display:block;z-index:99999"></div>').appendTo(d("body")).hide();L.css(B.divCSS);x=d("<ul></ul>").appendTo(L);x.css(B.ulCSS);for(var E=0;E<K;E++){var v=d('<li class="autocomplete-item"  data-index='+E+"></li>");v.appendTo(x);u.push(v);v.click(function(S){j.focus();var Q=parseInt(d(this).data("index"));var o=t.getResult()[Q];j.val(d.trim(k(o,j)));n=true;A=j.val();O=-1;N();for(var R in u){u[R].html("")}L.hide()})}var N=function(){for(var o in u){u[o].css(B.liCSS);u[o].removeClass("autocomplete-item-cursor")}if(u[O]){u[O].addClass("autocomplete-item-cursor");u[O].css(B.liCursorCSS)}};var y=function(){var o=B.store.getResult();if(o.length){L.show()}else{L.show()}for(var Q=0;Q<K;Q++){if(o[Q]){u[Q].html(B.renderer(o[Q])).show()}else{u[Q].html(null).hide();M.attr({"disabled":"disabled"})}}};var k=function(o,T){if(D){D.val(o[B.realInputProperty])}else{if(B.hiddenInputs.length){for(var Q in H){var S=H[Q];S.val(o[Q])}}}var R=B.setValue(o,T);T.nextAll(".valid-text").remove();return R};var p=function(){if(D){D.val("")}else{if(B.hiddenInputs.length){for(var o in H){var Q=H[o];Q.val("")}}}B.valueChanged()};l=d('<li style="text-align:right;"></li>').appendTo(x);l.css(B.pageBarLiCSS);q=d('<button type="button" disabled="disabled" class="button button-primary button-small" data-pageChange="-'+K+'"><</button>').appendTo(l);M=d('<button type="button" class="button button-primary button-small " data-pageChange="'+K+'">></button>').appendTo(l);l.find("button").click(function(i){j.focus();var Q=parseInt(d(this).data("pagechange"));r+=Q;var o=r+Q;if(r<t.getTotalCount()){t.load({start:r},function(){I=t.getTotalCount();q.removeAttr("disabled");M.removeAttr("disabled");if(r+K>=I){M.attr({"disabled":"disabled"})}if(r==0){q.attr({"disabled":"disabled"})}if(O>=t.getResult().length){O=t.getResult().length-1;N()}y()})}});j.focus(function(){e=j;b=L;if(!z){s()}L.css(c(j));if(L.is(":hidden")&&!n&&(d.trim(j.val())==A||!d.trim(j.val()).length)){l.hide();L.show();A=Math.random()}else{if(O>=t.getResult().length){O=B.store.getResult().length-1;N()}}}).keydown(function(o){var i=t.getResult().length;switch(o.keyCode){case 38:if(O==-1){O=i}O--;N();break;case 40:O++;if(O>=i){O=-1}N();break;case 37:if(O!=-1){if(!q.attr("disabled")){q.click()}o.preventDefault()}break;case 39:if(O!=-1){if(!M.attr("disabled")){M.click()}o.preventDefault()}break;case 9:L.hide();clearInterval(z);z=0;break}}).blur(function(){G=true}).keypress(function(i){if(13==i.keyCode){if(O!=-1){u[O].click();O=-1;N();L.hide()}else{if(t.getResult().length==1&&!L.is(":hidden")){u[0].click();O=-1;N();L.hide()}}i.preventDefault()}});var s=function(){z=setInterval(function(){var Q=d.trim(j.val());if(A!=Q){if(n){p()}n=false;A=Q;r=0;var R={start:0};R=d.extend(P,R);R[B.keyProperty]=Q;if(B.beforeLoad(R)){t.load(R,function(){if(t.getTotalCount()<=K){l.hide()}else{l.show()}O=-1;N();q.attr({"disabled":"disabled"});M.removeAttr("disabled");y()})}else{for(var o in u){u[o].html("")}}}},200)};d(document).click(function(R){var S=R.target;if(j[0]!=S&&L[0]!=S&&!L.find(S).length){L.hide();clearInterval(z);z=0;if(B.required&&!n&&e==j){var o=t.getResult()[0];if(o){j.val(d.trim(k(o,j)));n=true;A=j.val();O=-1;N();for(var Q in u){u[Q].html("")}}}}})}};h.prototype.init.protype=h.prototype;return h})();return this.each(function(){f(this,g)})}})(jQuery);