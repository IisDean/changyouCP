/****
 * k 为直播方式  2 = iframe嵌入方式  1 = flash插件方式
 * url 为直播地址
 * 在页面事件绑定调用哪一条数据
 */
var liveData = [
    {k:"2", url:"http://liveshare.huya.com/iframe/199585"},
    {k:"2", url:"http://cxg.changyou.com/enterHtmlPage.action?id=1100003301"},
];
var setHtml=function(k,url,n){
    var way;
    if(k==1){
        str='<object type="application/x-shockwave-flash" data="'+url+'" width="762" height="473" ><param name="allowFullScreen" value="true"><param name="wMode" value="Opaque"><param name="allowScriptAccess" value="always"><param name="allowFullScreenInteractive" value="true"><param name="bgColor" value="#000"></object>';
        way='flash';
    }else{
        str='<iframe width="762" height="473" src="'+url+'" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" oallowfullscreen="true"></iframe>';
        way='iframe';
    };
    document.getElementById('live-iframe').innerHTML = str;
};
var playLive=function(n){
    setHtml(liveData[n].k,liveData[n].url,n)
};
playLive(0);//默认调用第一个直播间

//点击播放视频 精彩花絮
$(".video-list").on("click", " .swiper-slide", function(){
    var vid = $(this).attr('data-vid');
    showDia("pop5");
    $('#video_player').commVideoPlayer({
        v_id : vid,		//视频ID（8位数字）
        autoPlay: true 			//传入值：true-自动播放，false-不自动播放
    });
});
//关闭视频播放
$(".video-pop .close").on("click", function(){
    $('#video_player').replaceWith('<div id="video_player">\n' +
        '        <span class="text-center video_placeholder">视频正在下载中...</span>\n' +
        '    </div>');
});

// 点击领取礼包
$(".prize-list .prize-btn").on("click", function(){
    if( $(this).hasClass("prize-btn-none") )return false;//已领取
    //根据领取状态显示某一弹窗
    var status = 1;
    if( status == 1 ){
        //领取成功
        showDia("pop1");
        $(this).removeClass("get-prize-btn")
            .addClass("prize-btn-none").text("已领取");
    }else if( status == 2 ){
        //请先完成任务
        showDia("pop2");
    }
});

// 加入阵营
$(".user-list li .btn-add").on("click", function(){
    var status = 2;
    if( status == 0 ){
        //未登录

    }else if( status == 1 ){
        //加入成功
        showDia("pop3");
    }else if( status == 2 ) {
        //已经支持过主播
        showDia("pop4");
    }
});

// 页面动效
$(window).on('load scroll', function() {
    var sTop = $(window).scrollTop();
    $.each($('.part'), function() {
        if(sTop >= $(this).offset().top - $(window).height() / 1.2) {
            $(this).addClass('show');
        }
    })
});

// 视频滚动
var videoSwiper = new Swiper('.swiper-container', {
    autoplay: true,//可选选项，自动滑动
    loop: true,
    slidesPerView: 3,
    spaceBetween: 28,
    navigation: {
        nextEl: '.swiper-box .next-btn',
        prevEl: '.swiper-box .prev-btn',
    }
});

//排行榜前三
(function(){
    for(var i=0;i<3;i++){
        $(".user-list2 li").eq(i).find(".rk-num").addClass("rk-num"+(i+1));
    }
})();

//排行榜延时动效
(function(){
    $(".user-list:visible li").each(function(index, ev){
        if(index > 10)return false;
        $(ev).css({
            "-webkit-animation-delay": (index*0.1+.5)+"s",
            "-moz-animation-delay": (index*0.1+.5)+"s",
            "-ms-animation-delay": (index*0.1+.5)+"s",
            "-o-animation-delay": (index*0.1+.5)+"s",
            "animation-delay": (index*0.1+.5)+"s",
        });
    });
})();

$(".J-close-btn").on("click", function(){
    showDialog.hide();
});