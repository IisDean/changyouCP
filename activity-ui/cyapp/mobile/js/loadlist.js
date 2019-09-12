//导航当前状态判断
/*$(".video_tabs a").each(function() {
	myRefresh('xcp');
});*/
myRefresh('xcp');

function myRefresh(nav) {
	//获取共有多少页数据请求
	var reg = /\/(\d*)/, pageNum = 2;
	var pageHtml = $(".listPage").html(), page = pageHtml.match(reg)[1];
	/*组件初始化js begin*/
	Zepto('.video_list').refresh({
		load : function(dir, type) {
			var me = this;
			var pageurl = "video_list/" + nav + "_" + pageNum + ".shtml";
			// alert(pageurl);
			if (page == 1) {
				me.disable();
				return;
			}
			$.ajax({
				url : pageurl,
				dataType : "html",
				success : function(htm) {
					$(".nextHtml").html('');
					$(".nextHtml").append(htm);
					$(".listPage").remove();
					var rightHtml = $(".nextHtml").html();
					$('.video_list .load_wrap').append(rightHtml);
					if (pageNum > page) {
						me.disable();
					} else {
						me.afterDataLoading();
					}
				},
				error : function() {
					me.disable();
				}
			});
			pageNum++;
		}
	});
	/*组件初始化js end*/
}
