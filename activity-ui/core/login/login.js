function djLogin(){
	$('#registerUrl').attr('href','http://zhuce.changyou.com/regInit.act?gameType=dj&suffix=suffix');
	$('#subLogin').unbind().click(function(){
		checkLogin();
	})
	popup($("#loginPop"));
}


/*前端检查是否登录信息的合法性*/
function checkLogin(){
	var cn_value=trimLogin($('#accountEmails').val());
	var pwd_value=trimLogin($('#password').val());
	var code_value=trimLogin($('#checkcode').val());
	if(isNullLogin(cn_value)){
		$('#loginError').html("请输入您的畅游账号");
		$('#accountEmails').focus();
	}else if(cn_value.length < 5||cn_value.length>50){	
		$('#loginError').html("请输入正确的畅游账号");
		$('#accountEmails').focus();
	}else if(isNullLogin(pwd_value)){
		$('#loginError').html("请输入您的密码");
		$('#password').focus();
	}else if(code_value == undefined || code_value == 'null' || code_value == ""){
		$('#loginError').html("请输入验证码");
		$('#checkcode').focus();
	}else{
		$('#loginError').html("正在登录，请稍后...");
		dealLogin();
	}
}

/*登录功能*/
function dealLogin() {
   	var cn=trimLogin($('#accountEmails').val());
   	var password=trimLogin($('#password').val());
   	var annexCode=trimLogin($('#checkcode').val());
   	var back = window.location.href;
   	var url  = ja.options.host + "/" + ja.options.platform + "/core/login/" + ja.options.app + "/" + ja.options.activity + "/" + ja.options.version + "/djlogin?callback=" + encodeURI(back);
	$.ajax({
	    type:"post", url:url, 
		data:{'cn':cn,'password':password,'dj_nnex_code':annexCode},
		success:function (outPut, textStatus) {
	      	$('#password').val('');
	    	$('#checkcode').val('');
	      	reloadCheckCode(1);
	      	if("001"==outPut.login){
	        	$('#loginError').text("请输入账号。");
	        }else if("002"==outPut.login||"003"==outPut.login||"009"==outPut.login){
                $('#loginError').text("账号错误，请重新输入。");
	        }else if("004"==outPut.login){
	        	$('#loginError').text("您的账号异常，请尝试更换账号登陆。");
	      	}else if("005"==outPut.login){
	        	$('#loginError').text("账号或密码错误。");
	      	}else if("006"==outPut.login){
	        	$('#loginError').text("请输入密码。");
	      	}else if("007"==outPut.login){
	        	$('#loginError').text("请输入验证码。");
	      	}else if("008"==outPut.login){
	        	$('#loginError').text("验证码错误，请重新输入。");
	        }else if("099"==outPut.login){
	        	$('#loginError').text("账号验证系统繁忙，请稍后再试。");	
	      	}else if("000"==outPut.login){
	      		$('#accountEmails').val('')
	      		$('#loginError').html("");
	      		hideMask($("#loginPop"));
	      		//afterLogin(outPut.cn);
	      		window.location.href = outPut.redirect;
	      	}else if("010"==outPut.login){
	      		$('#loginError').html("活动已结束或未开始。");
	      	}else{
	      		$('#loginError').html("系统繁忙，请稍后再试。");
	      	}
		},
		error:function () {
			clearLoginRecord();
			$('#loginError').html("系统繁忙，请稍后再试!");
		}
	});
}


//登录点关闭，清楚记录
$('#closeLogin').click(function(){
	clearLoginRecord();
});
function clearLoginRecord(){
	$('#loginError').html("");
	$('#accountEmails').val('');
	$('#password').val('');
   	$('#checkcode').val('');
   	reloadCheckCode(1);
}

/*登出检查
function processLogout(back){
	if (XMLHttpReq.readyState == 4) { // 判断对象状态
		if (XMLHttpReq.status == 200) { // 信息已经成功返回，开始处理信息
			location.reload();
		} 
	}
}*/

function reloadCheckCode(flag){
	if(flag==1){
		var cC=document.getElementById("checkcodeImg");
	}else{
		var cC=document.getElementById("checkcodeImg"+flag);
	}
	var value = parseInt(Math.random()*10000);
	cC.src="/wx/wxmsg/activitys/image/generate?random_mark="+value;
}


/*登出，非跨域的AJAX登出
function dealLoginComOut(){
	clearLoginRecord();
	$.ajax({
		url:"/core/login/logoutManager.jsp",
		type:"post",
		data:{},
		success:function (data, textStatus) {
			data=trimLogin(data);
	      	eval("outPut="+data);
			location.reload();
		},error:function(){
			alert("系统繁忙，请稍后再试！");
		}
	});
	
}	*/


/**
* 删除左右两端的空格
* 输入：字符串
* 输出：去空格的字符串
*/
function trimLogin(str) {  
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
/*
* 判断是否非空
* 输入：要检查的内容
* 输出：true 非空 false 空
*/
function isNullLogin(info){
	if(info==null || trimLogin(info)==""){
		return true;
	}
	
	return false;
}