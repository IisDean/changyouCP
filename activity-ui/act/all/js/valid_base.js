

function isEmpty(info){
    if((null == info) ||info === ''){
        return true;
    }else{
        return false;
    }
}

function isValidCn(cn){
    //var expression = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var expression = /^[a-zA-Z0-9_\.\-]+$/;
    return regCheck(cn,expression);
}



function isLetterAndNumber(info){
    var expression = /^(\w)+$/;
    return regCheck(info,expression);
}
/*
*判断是否为呢称(字母，数字，下划线)
*输入：info-待检查的信息
*输出：true-是呢称，false-不是
*/
function isNickName(name){
     var expression = /^([a-zA-Z]|[_]|[\u4E00-\u9FA5])*$/;
    
    return regCheck(name,expression);
}


function isEmail(email){
    var expression = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regCheck(email,expression);
}




function isPhoneNew(phone){
    var expression = /^1[3-9]\d{9}$/;
    
    return regCheck(phone,expression);
}



function isPhone(phone){
     var expression = /^1[3-9]\d{9}$/;
    
    return regCheck(phone,expression);
}

function isNumber(info){
    var expression = /^[0-9]*$/;
    return regCheck(info,expression);
}

function isPhoneNumber(info){
    var expression = /^1[0-9]*$/;
    return regCheck(info,expression);
}
function isValidCode(code){
    return isChinese(code);
}


function isIp(info){
    var expression = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
    return regCheck(info,expression);
}

/*
*判断是否为汉字
*输入：info-待检查的信息
*输出：true-是汉字，false-不是
*/
function isChinese(info) {
	var Expression = /^[\u4E00-\u9FA5]*$/;
	return regCheck(info, Expression);
}
function isNumber(num){
    var Expression = /^[0-9]*$/;
	return regCheck(num, Expression);
}
function regCheck(info,exp){
    var objExp = new RegExp(exp);
    if(true === objExp.test(info)){
        return true;
    }else{
        return false;
    }
}
//去除HTML标签
function removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return str;

}
function trim(str){
   return str.replace(/(^\s*)|(\s*$)/g, "");
}