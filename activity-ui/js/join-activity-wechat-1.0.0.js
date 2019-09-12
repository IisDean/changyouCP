
(function(){
    var JoinActivityWechat = function(){

    };
    JoinActivityWechat.fn = JoinActivityWechat.prototype = {
        config: function(apiList, ready){
            if($.isFunction(apiList)) {
                ready = apiList;
                apiList = undefined;
            }
            if(apiList == undefined) {
                apiList = [
                    "onMenuShareTimeline",
                    "onMenuShareAppMessage",
                    "onMenuShareQQ",
                    "onMenuShareWeibo",
                    "onMenuShareQZone"
                ];
            }
            var _this = this;
            ja.ajax("/wechat/web/" + ja.getActivity().wxId + "/config", function(data){
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.config.appId, // 必填，公众号的唯一标识
                    timestamp: data.config.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.config.nonceStr, // 必填，生成签名的随机串
                    signature: data.config.signature,// 必填，签名，见附录1
                    jsApiList: apiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                _this.app = data.app;
            });
            wx.ready(function(){
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                if($.isFunction(ready)) {
                    ready();
                }
            });
        },
        share: function(options){
            var _options = {
                title: ja.getActivity().activityName,
                url: ja.getLanding(),
                desc: "",
                shareList: [
                    "onMenuShareTimeline",  //朋友圈
                    "onMenuShareAppMessage",    //朋友
                    "onMenuShareQQ",
                    "onMenuShareWeibo",
                    "onMenuShareQZone"
                ] ,
                imgUrl: ja.getApp().iconUrl,
                type: "link"
            }
            if(typeof options == "function") {
                _options = $.extend({success:options}, _options)
            } else if(typeof options == "object") {
                _options = $.extend(_options, options);
            }
            var list = _options.shareList;
            delete _options["shareList"];
            for(var i in list) {
                var shareType = list[i];
                if($.isFunction(wx[shareType])) {
                    wx[shareType](_options);
                }
            }
        }
    };
    window.ja.wx = new JoinActivityWechat();
}());
















