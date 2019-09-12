;(function($){
	$.fn.noofpeople = function(options){
		var o = $.extend({
			init: 1,  //初始访问数
			step: 50000, //每日访问数
			initDate:'Aug 21, 2011 00:00:00' //起始日期
		}, options);		
		return this.each(function(){
			//当前日期
			var dt = new Date(),
			
			//返回1970年1月1日至今的毫秒数。
			nowDate = dt.getTime(),  
			  
			//返回1970年1月1日午夜到指定日期（字符串）的毫秒数。
			initDate = Date.parse(o.initDate),   
			
			//初始访问人数
			initNum = o.init,   
			
			//每秒访问人数
			step = o.step/(60*60*24*1000);
			
			var now_num = Math.ceil(((nowDate-initDate) > 0 ? (nowDate-initDate) : 0)*step); 
			
			$(this).text(now_num+initNum);   
		});	
	};
})(jQuery);