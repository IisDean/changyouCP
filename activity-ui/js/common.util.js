/*判断是否数组
* */
function isArray(o){
    if(undefined == o || null == o) return false;
    return Object.prototype.toString.call(o)=='[object Array]';
}

/*获取request的参数对应的值
name：key
* */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}