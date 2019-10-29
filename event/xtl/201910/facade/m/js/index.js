//main swiper
window.swiper = new Swiper('.swiper-container-main',{
    direction : 'vertical',
    followFinger : false,
    speed:400,
    mousewheelControl : true,
    onTransitionStart: function(swiper){
        $(".swiper-container-main .swiper-slide").eq(swiper.activeIndex).addClass('ani').siblings('.swiper-slide').removeClass('ani');
    }
});

//切换正反面
$(".tab-wrap").on("click", function(){
    if( $(this).hasClass('tab-wrap-1') ){
        $(this).addClass('tab-wrap-2').removeClass('tab-wrap-1');
    }else{
        $(this).addClass('tab-wrap-1').removeClass('tab-wrap-2');
    }
    $(this).prev().find('img').toggle();
});

//切换虚祭神/虚用神
$(".god-tab-wrap a").on("click", function(){
    var index = $(this).index();
    $(this).addClass('active').siblings('a').removeClass('active');
    $(".god-wrap .god-icon").hide().eq(index).show();
});

//下一页
$(".page-tips-icon").on("click", function(){
    window.swiper.slideNext();
});

//回到首页
$(".go-home-icon").on("click", function(){
    window.swiper.slideTo(0);
});

//展示细节
$(".detail-list .detail-item .node-icon").on("click", function(){
    $(this).parents('.detail-item').toggleClass('active');
});









