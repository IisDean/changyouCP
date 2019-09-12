//微信分享
var shareToWeiXin = new ShareToWx({
	shareUrl : location.href.split('#')[0],
	shareImg : "http://i1.cy.com/tl3d_m/icon/icon.png",
	shareTitle : "",
	shareDesc : "《天龙3D》家园系统上线！与心爱的ta恩爱带娃，布置爱的小家。更有三周年狂欢趴预热开启！",
	microPubNo : "tl3dr"
});

if (navigator.userAgent.indexOf('Android') > -1) {
	var down_top = $(".header").outerHeight();
	document.addEventListener("touchmove", touchMove, false);
	function touchMove(event) {
		if ($(document).scrollTop() > down_top) {
			$(".download").addClass("down_fixed");
			$(".top_box").addClass("nomargin");
		} else {
			$(".download").removeClass("down_fixed");
			$(".top_box").removeClass("nomargin");
		}
	}


	$(window).scroll(function() {
		touchMove();
	});
};

//视频
$('#vbox').bind('touchmove', function(e) {
	e.preventDefault();
});
//var video = document.getElementById('video');
var vbox = document.getElementById('vbox');
var video_area = document.getElementById('video_area');
var video_btn = document.getElementById('video_btn');
function showVideo(url) {
	vbox.style.display = "block";
	video.src = url;
	// video.src = "http://files2.changyou.com/videos/mh/mhcb.mp4";
	video.load();
	video.play();
}

function hideVideo() {
	video.pause();
	vbox.style.display = "none";
}

//video.addEventListener("click", function() {
//	event.stopImmediatePropagation();
	//阻止冒泡
//});
//vbox.addEventListener("click", hideVideo);

//视频按钮点击
// video_area.addEventListener("click", function() {
	// vbox.style.display = "block";
	// video.src = "http://files2.changyou.com/videos/mh/mhcb.mp4";
	// // video.src = url;
	// video.load();
	// video.play();
// }, false);
//vbox.addEventListener("click", hideVideo);

$('.video_img').click(function(){
	var _url = $(this).attr('dataUrl');
	// alert(_url);
	showVideo(_url);
});
$('#vbox').click(function(){
	hideVideo();
});

//tab 切换
var tabs = function(e1, e2) {
	var e1 = $(e1);
	var e2 = $(e2);
	e1.click(function() {
		if (! $(this).hasClass('active')) {
			e1.removeClass('active');
			$(this).addClass('active');
			var idx = e1.index(this);
			e2.slideUp(0);
			$(e2[idx]).slideDown(0);
		}
	});
	e1.click(function() {
		return false;
	});
};

$(function() {
	var swiper = new Swiper('.index .swiper-container', {
		slidesPerView : 3,
		spaceBetween : 15,
		freeMode : true,
		pagination : {
			el : '.index .swiper-pagination',
			clickable : true,
		},
	});
	
	var swiper_newbie = new Swiper('.newbie .swiper-container', {
      pagination: {
        el: '.newbie .swiper-pagination',
      },
    });
    
    var swiper_newbie = new Swiper('.news .swiper-container', {
      pagination: {
        el: '.news .swiper-pagination',
      },
    });

	tabs('.graphic_tabs a', '.gamelist');
	tabs('.video_tabs a', '.video_list');
});
