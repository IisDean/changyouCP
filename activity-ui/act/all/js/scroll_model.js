/* scroll model */
var scroll_model = function(obj){
	this.scroll = obj.scroll ? obj.scroll : null;
	this.co = $('.core_img');
	//this.ww = $(window).width();
	this.ww = $('#core_content').outerWidth();
	this.sw = this.co.outerWidth();
	this.o = obj.move ? obj.move : 50;
	//this.nomousewheel = obj.nomousewheel ? obj.nomousewheel : this.co.position().top;
	this.area = obj.area ? obj.area : $(this.co).parent();
	this.isHover = false;
	this.max = Math.floor((this.sw-this.ww)/this.o);
	this.init();
}
scroll_model.prototype = {
	i : 0,
	de : 0,
	deb : true,
	init : function(){
		this.bind_hover();
		this.bind_wheel();
		this.bind_scroll();
		this.bind_keyup();
		this.slider_fn({delta:0});
	},
	bind_hover: function(){
		var sf = this;
		$(this.area).hover(function(){
			sf.isHover = true;
		}, function(){
			sf.isHover = false;
		});
	},
	bind_wheel : function(){
		var sf = this;
		$('body').bind('mousewheel', function(event, delta) {
			/*var sTop = $(window).scrollTop()
				, co = $(sf.co)
				, ns = sf.nomousewheel;
			if( sTop>ns && sTop<ns+$(sf.co).outerHeight() ){*/
			if( sf.isHover ){
				//console.log(ns+$(sf.co).outerHeight());
				sf.slider_fn({delta:delta});
				var sTop = $(window).scrollTop()
				$(window).scrollTop(sTop);
				return false;
			}				
		});
	},
	bind_keyup : function(){
		var sf = this;
		document.onkeyup = function(e){ 	
			if (e == null) { // ie
				keycode = event.keyCode;
			} else { // mozilla
				keycode = e.which;
			}
			switch(keycode){
				case 39:
				//case 40:
					sf.slider_fn({delta:-1});
					break;
				case 37:
				//case 38:
					sf.slider_fn({delta:1});
					break;
			}
			var sTop = $(window).scrollTop();
			$(window).scrollTop(sTop);
			return false;
		}
	},
	bind_scroll : function(){
		var sf = this;
		if(this.scroll){
			this.sliders = $(this.scroll).slider({
				min: 0,
				max: sf.max,
				value: 0,
				range: 'min',
				slide: function( event, ui ){
					sf.slider_fn({i:ui.value});
					return false;
				}
			});
		}
	},
	slider_fn : function(obj){
		var sf = this;
		if(obj.delta){
			delta = obj.delta;
		}else if(obj.i){
			if(obj.i<Math.abs(sf.i)){
				delta = 1;
			}else{
				delta = -1;
			}
		}else{
			delta = obj.delta;
		}
		if(delta > 0){
			sf.i++
			if(sf.i > 0){
				sf.i--;
				return false;
			}
		}else if(delta < 0){
			sf.i--;
			if(sf.i*sf.o < (sf.ww-sf.sw)){
				sf.i++;
				return false;
			}
		}
		$(sf.co).css('marginLeft',sf.i*sf.o);		
		sf.sliders.slider('value',Math.abs(sf.i));
		//$(window).scrollTop(0);
		return false;
	}
}