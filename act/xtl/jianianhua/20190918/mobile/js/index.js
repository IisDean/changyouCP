//H5 滑动
var mySwiper = new Swiper(".swiper-container", {
	direction: 'vertical',
	slidesPerView: 'auto',
	on: {
		init: function(){
			var $firstSlide = $(".swiper-container .swiper-slide").eq(0),
			    lastPd = ($firstSlide.height() - $firstSlide.find(".page-box").height()) / 2;
			$(".swiper-container .swiper-slide:last-child").find(".page-wrap").css('padding-top', lastPd+'px');
			$(".tab-wrap .tab-item").on("click", function(){
				var index = $(this).index();
				if( index == 4 )index = 0;
					mySwiper.slideTo(index);
			});
			swiperAnimateCache(this);
			swiperAnimate(this);
		},
		slideChangeTransitionEnd: function(){
			swiperAnimate(this);
		}
	}
});
mySwiper.slideTo(2);

$(".J-order-btn").on("click", function(){
	showDia('pop1');
});
