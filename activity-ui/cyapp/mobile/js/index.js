var cyapp = ja.getDomain() + "/wechat/cyapp";
$(function () {
    ja.simpleConfig('platform','cy-subscription','2018','wechat', function () {
        init();
    });
});
function init() {
    var appCode = $('.header').attr('app');
    if(undefined == appCode || null == appCode || '' == appCode) return;
    var url = cyapp + '/find';
    ja.ajax({
        type: "get",
        url: url,
        data: {
            code: appCode
        },
        async: false,
        dataType: "json",
        success: function (data, textStatus) {
            if(null == data) return;
            $('.header p').html(data.attend + '人在玩');
        }
    });
}