var cyapp = ja.getDomain() + "/wechat/cyapp";
$(function () {
    init();

});
function init() {
    ja.config({
        app:'platform',
        activity: "cy-subscription",
        version:"2018",
        platform:"wechat",
        ready: function() {
            ja.wx.config(function(){
                /*
                ja.wx.share(function(){
                    alert("分享了");
                });
                */

                /*ja.wx.share({
                    title:"我在这里领取了新装备",
                    url:"http://www.changyou.com",
                    imgUrl:"",
                    desc:"快来领礼品吧",
                    success: function(){
                        alert("复杂分享了");
                    }
                });*/

            });

            ja.user.getWx(function (data) {
                setOpenId(data.data.openId);
                // alert(getOpenId());
                getMyAttends();
            });
        }
    });
}

function getMyAttends() {
    var url = cyapp + "/openid";
    ja.ajax({
        type: "get",
        url: url,
        data: {
            openId: getOpenId(),
            type: 0,
        },
        async: false,
        dataType: "json",
        success: function (data, textStatus) {
            if(null == data) return;
            if(!isArray(data)) return;
            displayAttends(data);
        }
    });
}
function displayAttends(data) {
    var html = '<li onclick="manage();">' +
        '<a> <img src="/act/cyapp/images/ico_add.jpg"/> </a>' +
        '<em>添加游戏</em>' +
        '</li>';
    for(var i = 0; i < data.length; i++){
        html += '<li>' +
            '<a> <img src="' + data[i].iconUrl + '" width="125px" height="125px"/> </a>' +
            '<em>'+ data[i].appName +'</em>' +
            '<i class="ico_del" onclick="unAttend(\'' + data[i].appCode + '\');"></i>' +
            '</li>';
    }
    $('#m_count').text('共' + data.length + '个在玩的游戏');
    $('.managelist').html(html);

    cache(data);
}
function unAttend(appCode) {
    var url = cyapp + '/unattend';
    var attend = {
        userId: getOpenId(),
        appCode: appCode
    };
    ja.ajax({
        type: "post",
        url: url,
        data: JSON.stringify(attend),
        async: false,
        contentType:"application/json;charset=utf-8",
        dataType: "json",
        success: function (data, textStatus) {
            var myAttends = localStorage.getItem("myAttends");
            if(undefined == myAttends || null == myAttends) myAttends = [];
            else myAttends = JSON.parse(myAttends);
            for(var i = 0; i < myAttends.length; i++){
                if(appCode == myAttends[i].appCode){
                    myAttends.splice(i, 1);
                    break;
                }
            }
            displayAttends(myAttends);
        }
    });
}
function cache(data) {
    localStorage.setItem("myAttends", JSON.stringify(data));
    var map = {};
    for(var i = 0; i < data.length; i++){
        map[data[i].appCode] = '1';
    }
    localStorage.setItem("attendsFinder", JSON.stringify(map));
}
/*function removeFromCache(id) {
    var myAttends = localStorage.getItem("myAttends");
    for(var i = 0; i < myAttends.length; i++){
        if(id == myAttends[i].id){
            myAttends.remove(i);
            break;
        }
    }
    localStorage.setItem("myAttends", myAttends);
    var map = localStorage.getItem("attendsFinder");
    if(undefined == map || null == map) return;
    map = JSON.parse(map);
    map.delete(id);
    localStorage.setItem("attendsFinder", JSON.stringify(map));
}*/
function manage() {
    document.location.href = 'addGame.shtml';
}