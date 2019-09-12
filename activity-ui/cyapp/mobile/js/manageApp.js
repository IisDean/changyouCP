var cyapp = ja.getDomain() + "/wechat/cyapp";
$(function () {
    ja.simpleConfig('platform','cy-subscription','2018','wechat', function () {
        getAll();
    });
    /*ja.config({app:'platform',
        activity: "platform-wx",
        version:"2018",
        platform:"wechat",
        ready: function() {
            getAll();
        }
    })*/
    // getAll();
});
function getAll(_type) {
    var url = cyapp + "/all";
    var type = _type;
    if(undefined == _type){
        $('.graphic_tabs a').each(function () {
            // if($(this).css("display") == 'block'){
            var item = $(this);
            if(item.hasClass("active")){
                type = item.attr('type');
            }
        });
    }

    ja.ajax({
        type: "get",
        url: url,
        data: {
            type: type,
            pageIndex: 1,
            pageSize: 20
        },
        async: false,
        dataType: "json",
        success: function (data, textStatus) {
            console.log(JSON.stringify(data));
            if(null == data){
                console.log("null");
                return;
            }
            if(!isArray(data)){
                console.log("not array");
                return;
            }
            displayApps(data, type);
        }
    });
}
function displayApps(data, type) {
    var html = '';
    var attendsFinder = localStorage.getItem("attendsFinder");
    if(undefined == attendsFinder || null == attendsFinder) attendsFinder = {};
    else attendsFinder = JSON.parse(attendsFinder);

    for(var i = 0; i < data.length; i++){
        var item = data[i];
        var keywords = [];
        if(undefined != item.keywords && null != item.keywords && '' != item.keywords) keywords = item.keywords.split(',');
        html += '<li class="clearfix">' +
            '<img src="'+ item.iconUrl+'" width="125px" height="125px"/>' +
            '<dl class="game_intro">' +
            '<dt>' +
            item.appName +
            '</dt>';
        if(keywords.length > 0)
            html += '<dd>' +
            keywords[0] +
            '</dd>';
        if(keywords.length > 1)
            html += '<dd>' +
            keywords[1] +
            '</dd>';
        html += '<p>' +
            item.attend + '人正在玩' +
            '</p>' +
            '</dl>' +
            (attendsFinder[item.appCode] != undefined ? '<a href="javascirpt:void(0);" title="已添加" class="add_btn added">已添加</a>' : '<a href="javascript:;" title="+添加" class="add_btn unadd" id="'+item.id+'" onclick="attend(\'' + item.appCode + '\');">+添加</a>') +
            '</li>';
    }
    /*$('.gamelist').each(function () {
        var item = $(this);
        if(item.css('display') == 'block'){
            item.html(html);
        }
    })*/
    $('.gamelist').eq(type - 1).html(html);
}
function attend(appCode) {
    var url = cyapp + '/attend';
    var btn = $(this);
    /*$.ajaxSetup({
        contentType: 'application/json'
    });*/
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
            if(data != '1') return;

            cacheAttends(appCode);

            btn.attr('title', '已添加');
            $('#'+ appCode).text('已添加');
            $('#'+ appCode).removeClass('unadd');
            $('#'+ appCode).addClass('added');

            document.location.href = 'manageGame.shtml';
        }
    });
}
function cacheAttends(appCode) {
    var attendsFinder = localStorage.getItem("attendsFinder");
    if(undefined == attendsFinder || null == attendsFinder) attendsFinder = {};
    else attendsFinder = JSON.parse(attendsFinder);
    attendsFinder[appCode] = '1';

    localStorage.setItem('attendsFinder', JSON.stringify(attendsFinder));
}