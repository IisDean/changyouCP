var ShareToWx = window.ShareToWx || {};
(function(){
        ShareToWx = function(options){
        var options     = options || {};
        this.shareTitle = options.shareTitle || '';//设置分享标题,如果为空，微信会取页面title,document.title
        this.shareDesc  = options.shareDesc || '';//设置分享描述
        this.shareUrl   = options.shareUrl || location.href.split('#')[0];//设置分享链接
        this.shareImg   = options.shareImg || ''; //设置分享图
        this.success    = options.success||'';//设置初始化成功后的回调
        this.debug      = options.debug || false;//开启调试模式，调用接口会弹出提示
        this.callback   = options.callback || '';//统一的回调函数
        this.callbackFriend = options.callbackFriend || '';//分享给朋友回调
        this.callbackFriends = options.callbackFriends || '';//分享到朋友圈回调
        this.callbackQQ = options.callbackQQ || '';//分享到qq回调
        this.callbackWeibo = options.callbackWeibo || '';//分享到微博回调
        this.microPubNo		= options.microPubNo || '';
        this.init();
    };
    ShareToWx.prototype = {
        init: function(){
            var that = this;
            var currentUrl = location.href.split('#')[0];//当前URL，取第一个#号前面，当前页面需是畅游域下的。
            var URL = encodeURIComponent(currentUrl);//校验用            
            var shareTitle  = that.shareTitle;
            var shareDesc   = that.shareDesc;
            var shareUrl    = that.shareUrl;//分享用，可以使用其他地址。
            var shareImg    = that.shareImg;
            var debug       = that.debug;
            var microPubNo	= that.microPubNo;
            $.ajax({
                type:"get",
                url:"http://tlsp.changyou.com/tl/wx/jsController.ncdo?url=" + URL + "&microPubNo=" + microPubNo,
                dataType:"jsonp",
                cache:true,//防止自动添加时间戳
                //callback:"callback",
                success:function(data){
                    wx.config({
                        debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonce, // 必填，生成签名的随机串
                        signature: data.signature,// 必填，签名，见附录1
                        jsApiList: ['hideMenuItems','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function(){
                        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                        wx.onMenuShareTimeline({
                            title: shareTitle, // 分享标题
                            desc: shareDesc, // 分享描述
                            link: shareUrl, // 分享链接
                            imgUrl: shareImg, // 分享图标
                            success: function () {                                
                                // 用户确认分享后执行的回调函数
                                if(that.callback && typeof(that.callback) == "function"){
                                    that.callback();
                                }
                                if(that.callbackFriends && typeof(that.callbackFriends) == "function"){
                                    that.callbackFriends();
                                }
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        //获取“分享给朋友”按钮点击状态及自定义分享内容接口
                        wx.onMenuShareAppMessage({
                            title: that.shareTitle, // 分享标题
                            desc: shareDesc, // 分享描述
                            link: shareUrl, // 分享链接
                            imgUrl: shareImg, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                if(that.callback && typeof(that.callback) == "function"){
                                    that.callback();
                                }
                                if(that.callbackFriend && typeof(that.callbackFriend) == "function"){
                                    that.callbackFriend();
                                }
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        //获取“分享到QQ”按钮点击状态及自定义分享内容接口
                        wx.onMenuShareQQ({
                            title: that.shareTitle, // 分享标题
                            desc: shareDesc, // 分享描述
                            link: shareUrl, // 分享链接
                            imgUrl: shareImg, // 分享图标
                            success: function () {
                               // 用户确认分享后执行的回调函数
                               if(that.callback && typeof(that.callback) == "function"){
                                    that.callback();
                                }
                               if(that.callbackQQ && typeof(that.callbackQQ) == "function"){
                                    that.callbackQQ();
                                }
                            },
                            cancel: function () {
                               // 用户取消分享后执行的回调函数
                            }
                        });
                        //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
                        wx.onMenuShareWeibo({
                            title: that.shareTitle, // 分享标题
                            desc: shareDesc, // 分享描述
                            link: shareUrl, // 分享链接
                            imgUrl: shareImg, // 分享图标
                            success: function () {
                               // 用户确认分享后执行的回调函数
                               if(that.callback && typeof(that.callback) == "function"){
                                    that.callback();
                                }
                               if(that.callbackWeibo && typeof(that.callbackWeibo) == "function"){
                                    that.callbackWeibo();
                                }
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        //初始化后回调
                        if(that.success && typeof(that.success) == "function"){
                            that.success();
                        }
                    });
                }
            });
        }

    };
})();