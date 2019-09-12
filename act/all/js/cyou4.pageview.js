// cys.js
(function(){
	cyou4 = {};
	var base = { // private
		getJQObject: function(id) {
			return $(id);
		},
		getHTMLObject: function(id) {
			return $(id)[0];
		}
	};
	// 此方法适用于 div 下的多个 a 链接标签
	var _pageObj = null;		// page 所在 DIV 的 jquery 对象
	var _pageLinkNumber = 0;	// page 的数字链接数（不包括上一页下一页首尾页等）
	var _totalLinkCounts = 0;	// 所有的链接数（数字链接数值 + 6[上下页首尾页和两个 "..."]）
	var _pageNumber = 0;		// 当前所在的页码
	var _pageTotals = 0;		// 总共的页数
	var _pageLinkCss = null;
	var _pageCurrentCss = null;
	var _pageAjaxURL = null;
	var _jsonData = {};
	cyou4.pageview = {
		// 检测是否获取了分页对象
		checkPageObj: function() {
			return _pageObj == null;
		},
		// 获取分页对象
		setPageArea: function(id) {
			_pageObj = base.getJQObject(id);
		},
		// 设置页码链接总个数（不包括上一页下一页等信息）
		setPageLinkNumber: function(counts) {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			_pageLinkNumber = counts;
			_totalLinkCounts = counts + 6;
			
			var linkStr = "<a href='javascript:void(0);' class='prev'>首页</a>";
			linkStr += "<a href='javascript:void(0);' class='prev'>上一页</a>";
			linkStr += "<a href='javascript:void(0);' data='cypu'>...</a>";
			
			for (var i = 0; i < counts; i = i+1) {
				linkStr += "<a href='javascript:void(0);' data='" + (i+1) + "' title='" + (i+1) + "'>" + (i+1) + "</a>";
			}
			linkStr += "<a href='javascript:void(0);' data='cypd'>...</a>";
			linkStr += "<a href='javascript:void(0);' class='next'>下一页</a>";
			linkStr += "<a href='javascript:void(0);' class='next'>尾页</a>";
			_pageObj.append(linkStr);
			linkStr = null;
		},
		// 设置上一页下一页首页尾页以及页码链接翻页的文本显示内容
		setPageLinkShow : function(first, prev, prevAll, nextAll, next, total) {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			if (total == undefined) {
				return;
			} else {
				var pageChildNodes = _pageObj.children();
				pageChildNodes[0].innerHTML = first;
				pageChildNodes[1].innerHTML = prev;
				pageChildNodes[2].innerHTML = prevAll;
				pageChildNodes[_totalLinkCounts-3].innerHTML = nextAll;
				pageChildNodes[_totalLinkCounts-2].innerHTML = next;
				pageChildNodes[_totalLinkCounts-1].innerHTML = total;
			}
		},
		setPageLinkCss: function (pageLinkCss, pageCurrentCss) {
			_pageLinkCss = pageLinkCss;
			_pageCurrentCss = pageCurrentCss;
		},
		setPageAjaxURL: function (ajaxURL) {
			_pageAjaxURL = ajaxURL == undefined ? null : ajaxURL;
		},
		setPageJson : function (json) {
			_jsonData = json;
		},
		// 更新当前页以及总页数
		setPageNumberCounts: function(pageNumber, totalPage) {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			_pageNumber = pageNumber;
			_pageTotals = totalPage;
			var pageChildNodes = _pageObj.children();
			$(pageChildNodes[0]).attr("data", 1);
			$(pageChildNodes[_totalLinkCounts-1]).attr("data", totalPage);
		},
		// 修改上一页和下一页的连接内容
		setNextAndPrevPage: function() {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			var pageChildNodes = _pageObj.children();
			(_pageNumber == 1) ? $(pageChildNodes[1]).attr("data", 1) : $(pageChildNodes[1]).attr("data", Number(_pageNumber)-1);
			(_pageNumber == _pageTotals) ? $(pageChildNodes[_totalLinkCounts-2]).attr("data", _pageTotals) : $(pageChildNodes[_totalLinkCounts-2]).attr("data", Number(_pageNumber)+1);
		},
		// 初始化链接
		initPageLink: function() {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			var pageChildNodes = _pageObj.children();
			$(pageChildNodes[2]).hide();
			if (_pageTotals <= _pageLinkNumber) {
				$(pageChildNodes[_totalLinkCounts-3]).hide();
				var number = _pageLinkNumber - _pageTotals;
				for (var i = 0; i < number; i = i + 1) {
					$(pageChildNodes[_totalLinkCounts-4-i]).hide();
				}
			}
		},
		// 刷新链接
		refreshPageLink: function() {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			var pageChildNodes = _pageObj.children();
			pageChildNodes.show();
			var midPage = parseInt(_pageLinkNumber / 2);
			if (_pageTotals <= _pageLinkNumber) {
				cyou4.pageview.initPageLink();
			} else if (_pageNumber <= midPage) {
				$(pageChildNodes[2]).hide();
			} else if (_pageNumber >= _pageTotals - midPage) {
				$(pageChildNodes[_totalLinkCounts-3]).hide();
			}
		},
		// 刷新链接的CSS样式
		refreshPageLinkCss: function() {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			var pageChildNodes = _pageObj.children();
			_pageLinkCss ? pageChildNodes.css(_pageLinkCss) : "";
			for (var i= 0; i < _pageLinkNumber; i = i + 1) {
				if (_pageCurrentCss && $(pageChildNodes[3+i]).attr("data") == _pageNumber) {
					$(pageChildNodes[3+i]).css(_pageCurrentCss);
					break;
				}
			}
		},
		// 点击页码翻页执行的时间
		ellipsisClick: function() {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			if (_pageTotals <= _pageLinkNumber) {
				return;
			}
			var pageChildNodes = _pageObj.children();
			
			//var currentMin = Number($(pageChildNodes[3]).attr("data"));
			//var currentMax = Number($(pageChildNodes[_totalLinkCounts-4]).attr("data"));
			
			var beginIndex = 1;
			var midPage = parseInt(_pageLinkNumber / 2);
			if (_pageNumber <= midPage) {
				beginIndex = 1;
			} else if (_pageNumber > midPage && (_pageNumber <= _pageTotals - midPage)) {
				beginIndex = _pageNumber - midPage;
			} else {
				beginIndex = _pageTotals - _pageLinkNumber + 1;
			}
			cyou4.pageview.updatePageLinkHtml(beginIndex);
		},
		updatePageLinkHtml: function(start) {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			var pageChildNodes = _pageObj.children();
			for (var i = 0; i < _pageLinkNumber; i = i + 1) {
				$(pageChildNodes[3+i]).attr("data", start+i).attr("title", start+i).html(start+i);
			}
		},
		run: function(callback, errorCallback) {
			if (cyou4.pageview.checkPageObj()) {
				return;
			}
			
			cyou4.pageview.setNextAndPrevPage();
			cyou4.pageview.initPageLink();
			cyou4.pageview.refreshPageLinkCss();
			
			var midPage = parseInt(_pageLinkNumber / 2);
			var pageChildNodes = _pageObj.children();
			pageChildNodes.click(function(){
				var page = 0;
				if ($(this).attr("data") == _pageNumber) {
					return;
				} else {
					if ($(this).attr("data") == 'cypu') {
						page = Number($(this).next().attr("data")) - 1;
					} else if ($(this).attr("data") == 'cypd') {
						page = Number($(this).prev().attr("data")) + 1;
					} else {
						page = Number($(this).attr("data"));
					}
					
					_pageNumber = page < 1 ? 1 : page > _pageTotals ? _pageTotals : page;
					if (_pageAjaxURL == null) {
						cyou4.pageview.callbackExecute();
						return;
					} else {
						_jsonData.pageCount=_jsonData.pageCount||10;
						_jsonData.pageNumber=_pageNumber;
						$.ajax({
							type: "post",
							dataType : "json",
							url: _pageAjaxURL,
							data: _jsonData,
							success: function(data, textStatus) {
								_pageTotals = callback(data, textStatus);
								cyou4.pageview.callbackExecute();
							},
							error: function() {
								errorCallback();
							}
						});
					}
				}
			});
		},
		callbackExecute: function() {
			cyou4.pageview.setNextAndPrevPage();
			cyou4.pageview.refreshPageLink();
			cyou4.pageview.ellipsisClick();
			cyou4.pageview.refreshPageLinkCss();
		},
		simplePage: function(pageLinks, totalPages, url, data, id, callback) {
			if (pageLinks != null && totalPages != null) {
				$(id).html("");
				cyou4.pageview.setPageArea(id);
				cyou4.pageview.setPageLinkNumber(pageLinks);
				cyou4.pageview.setPageNumberCounts(1, totalPages);
				cyou4.pageview.setPageLinkCss({"margin": "0px 6px", "color" : "", "font-weight": "normal"}, {"font-weight": "bold", "color": "#ff4800"});
				cyou4.pageview.setPageAjaxURL(url);
				cyou4.pageview.setPageJson(data);
				cyou4.pageview.run(callback, callback);
			}
		}
	};
})();