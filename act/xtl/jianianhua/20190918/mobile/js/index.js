//获取验证码
var isGetCode = true;//验证码获取状态 true为可发送获取请求
var codeTimer;
var $codeBtn = $(".code-btn");
$codeBtn.on("click", function(){
    if( !isGetCode )return false;
    var codeTime = 60;
    isGetCode = !isGetCode;
    codeTimer = setInterval(function(){
        codeTime--;
        $codeBtn.text('剩余'+codeTime+'秒').addClass("filter");
        if(codeTime <= 0){
            isGetCode = !isGetCode;
            $codeBtn.text('获取验证码').removeClass('filter');
            clearInterval(codeTimer);
        }
    }, 1000);
});

//抢先预约
$(".order-btn").on("click", function(){
    popShow("pop1");
});

//打开礼包
$(".start-hb").on("click", function(){
    popShow("pop2");
});

//提交登录信息
$(".order-btn2").on("click", function(){
    popShow("pop3");
});

var mySwiper = new Swiper('.swiper-container', {
    autoplay: true,//可选选项，自动滑动
    effect : 'coverflow',
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    coverflowEffect: {
        rotate: 10,
        stretch: 60,
        depth: 100,
        modifier: 2,
        slideShadows : true
    },
    navigation: {
        nextEl: '.swiper-box .next-btn',
        prevEl: '.swiper-box .prev-btn',
    },
    pagination: {
        el: '.swiper-box .swiper-pagination',
    },
});

// 页面动效
$(window).on('load scroll', function() {
    var sTop = $(window).scrollTop();
    if( sTop % 10 != 0)return false;
    $.each($('.part'), function() {
        if(sTop >= $(this).offset().top - $(window).height() / 1.2) {
            $(this).addClass('show');
        }
    })
});

//花瓣
var flowInit = function (container, flwCss, aniCss) {
    var screenWidth = 750,
        screenHeight = 849,
        maxDuration = 15,
        createFlow = function () {
            container.append('<li class="' + flwCss[Math.floor(Math.random() * (flwCss.length - 1))] + '"><span class="' + aniCss[Math.floor(Math.random() * (aniCss.length - 1))] + '"></span></li > ');
            var item = container.find('li').last(),
                startPositionLeft = 200-screenWidth * 1 / 3 * Math.random(),
                startPositionTop = -100,
                endPositionTop = screenHeight + 200,
                endPositionLeft = startPositionLeft - screenWidth * 2 / 3 * Math.random() - screenWidth * 1 / 3,
                duration = maxDuration * 2 / 3 + maxDuration * 1 / 3 * Math.random();
            item.css({
                'transform': 'translate(' + startPositionLeft + 'px,' + startPositionTop + 'px)',
                '-webkit-transform': 'translate(' + startPositionLeft + 'px,' + startPositionTop + 'px)'
            });
            setTimeout(function () {
                item.css({
                    '-webkit-transform': 'translate(' + endPositionLeft + 'px,' + endPositionTop + 'px)',
                    '-webkit-transition': duration + 's ease-out',
                    'transform': 'translate(' + endPositionLeft + 'px,' + endPositionTop + 'px)',
                    'transition': duration + 's ease-out'
                }).one('webkitTransitionEnd transitionend', function () {
                    $(this).remove();
                });
            }, 100);
        };
    if (typeof document.getElementsByTagName("body")[0].style.animation != 'undefined') {
        createFlow();
        setInterval(createFlow, 2000);
    }
};
flowInit($('.flw'),
    ['sp1', 'sp2', 'sp3', 'sp4', 'sp5', 'sp6'],
    ['fallani1', 'fallani2', 'fallani3']
);