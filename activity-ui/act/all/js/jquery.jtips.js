;(function($){	
	$.fn.jtips = function(options){		
		var o = $.extend({pos: 'bottom'}, options)
		var tips = $(tips), selector = this.selector;
		return this.each(function(){			
			var _this = this, rPos = ['top', 'right', 'bottom', 'left'];
			
			var pos = (o.pos==='random') ? rPos[Math.floor(Math.random()*rPos.length)] : o.pos;			
			
			var data = eval("(" + $(_this).attr('data') + ")");			
			var tips = $('<div class="jtips"/>');
						
			$('body').append($.fn.jtips.createTips(data, tips));
			
			tips.css({position: 'absolute', display: 'none', zIndex: 99});
			
			if(pos == 'top'){
				$(_this).mousemove(function(e){
					tips.css({top: e.pageY -tips.outerHeight()- 20, left: e.pageX - tips.outerWidth()*0.5, display: 'block'});
				}).hover(function(e){
					tips.css({top: e.pageY -tips.outerHeight()- 20, left: e.pageX - tips.outerWidth()*0.5, display: 'block'});
				}, function(){
					tips.css({top: 0, left: 0, display: 'none'});		
				});
			}else if(pos == 'right'){
				$(_this).mousemove(function(e){
					tips.css({top: e.pageY -tips.outerHeight()*0.5, left: e.pageX + 20, display: 'block'});
				}).hover(function(e){
					tips.css({top: e.pageY -tips.outerHeight()*0.5, left: e.pageX + 20, display: 'block'});
				}, function(){
					tips.css({top: 0, left: 0, display: 'none'});		
				});				
			}else if(pos == 'bottom'){
				$(_this).mousemove(function(e){
					tips.css({top: e.pageY + 20, left: e.pageX - tips.outerWidth()*0.5, display: 'block'});
				}).hover(function(e){
					tips.css({top: e.pageY + 20, left: e.pageX - tips.outerWidth()*0.5, display: 'block'});
				}, function(){
					tips.css({top: 0, left: 0, display: 'none'});		
				});				
			}else{
				$(_this).mousemove(function(e){
					tips.css({top: e.pageY -tips.outerHeight()*0.5, left: e.pageX - tips.outerWidth() - 20, display: 'block'});
				}).hover(function(e){
					tips.css({top: e.pageY -tips.outerHeight()*0.5, left: e.pageX - tips.outerWidth() - 20, display: 'block'});
				}, function(){
					tips.css({top: 0, left: 0, display: 'none'});		
				});		
			}
		});	
	};
	$.fn.jtips.createTips = function(data, elem){
		var objNames = [];
		for(name in data){	
			objNames.push(name);
		}		
		for(var i=0, len=objNames.length; i<len; i++){
			var objName = objNames[i];
			if(objName === 'img'){
				elem.append('<img src="' + data[objName] + '"/>');
			}else{
				elem.append('<' + objName + '>' + data[objName] + '</' + objName + '>');	
			}
		}
		return elem;
	}
})(jQuery);