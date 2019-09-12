/*
** jquery overlay
** Author: Zsou
** Version: 1.2
** Date: 2012.05.20

** 调用方式
	$().overlay.add({bgColor:'#f00'});
	console.log($.fn.overlay.getId());

	$().overlay.add({bgColor:'#f70'});

	$().overlay.add({bgColor:'#f70'});

	$().overlay.remove();


**	或者
	var Overlay = $().overlay;
	Overlay.add({bgColor: 'blue'});
**
*/

;(function($){
	$.overlay = $.fn.overlay = function(){
		
	}
	
	$.fn.overlay.doc_h = $(document).height();
	$.fn.overlay.isIE6 = $.browser.msie && parseFloat($.browser.version)<7;
	$.fn.overlay.id = 0;
	//$.fn.overlay.overlay = [];
				
	//	add overlay
	$.fn.overlay.add = function(options){
		var conf = {
			bgColor: '#000',
			opacity: 0.6,
			zIndex: 50
		}
		var opts = $.extend(conf, options);
		
		var _this = $.fn.overlay;
		
		//	Default CSS			
		var defaultCss = {
			position       : _this.isIE6 ? 'absolute' : 'fixed',
			zIndex         : opts.zIndex,
			top            : '0px',
			left           : '0px',
			height         : _this.isIE6 ? _this.doc_h : '100%',
			width          : '100%',
			backgroundColor: opts.bgColor,
			filter         : 'alpha(opacity=' + opts.opacity*100 + ')',
			opacity        : opts.opacity	
		}
		_this.id += 1;	
		//$.fn.overlay.remove();
		var overlay = $('<div id="Overlay' + _this.id + '" class="OverlayBG" />');		
		
		$('body').append(overlay.css(defaultCss));	
	};
	
	//	remove overlay
	$.fn.overlay.remove = function(id){
		var _this = $.fn.overlay;
		id = id || _this.getId();		
		
		if(id) {
			$overlay = $('#Overlay'+id);
			$overlay.fadeOut(function(){
				$overlay.remove();
			});
		}
	};
	
	//	hide overlay
	$.fn.overlay.hide = function(id){
		var _this = $.fn.overlay;
		id = id || _this.getId();		
		
		if(id) {
			$overlay = $('#Overlay'+id);
			$overlay.fadeOut();
		}	
	};
	
	//	show overlay
	$.fn.overlay.show = function(id){
		var _this = $.fn.overlay;
		id = id || _this.getId();		
		
		if(id) {
			$overlay = $('#Overlay'+id);
			$overlay.fadeIn();
		}	
	};
	
	//	get overlay id
	$.fn.overlay.getId = function(){
		return $.fn.overlay.id;	
	};

})(jQuery);