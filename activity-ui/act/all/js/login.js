$(function(){
	reloadCheckCode_1();
   //判断是否已登录
   isLogin();
});

//获取项目根目录
function getRootPath(){
	 var strFullPath=window.document.location.href;
	 var strPath=window.document.location.pathname;
	 var pos=strFullPath.indexOf(strPath);
	 var prePath=strFullPath.substring(0,pos);
	 var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
	 //return(prePath+postPath);
	 return("");
	}

//验证账号是否已封停
function checkCnCompetence(cn){
	var returnData = "";
	$.ajax({
	    type:"post",
	    data:{'cn':cn},
	    url:getRootPath()+"/checkCnController.do?checkCnCompetence", 
	    async:false,
		success:function (data) {
	      	data=trim(data);
	      	returnData=data
		},
		error:function () {
      		alert("系统异常")
		}
	});
	return returnData;
	
}

//判断是否已登录
function isLogin(){
	$.ajax({
	    type:"post",
	    data:{'gameId':$('#gameId').val()},
	    url:getRootPath()+"/loginController.do?isLogin", 
		success:function (data) {
	      	data=trim(data);
	      	eval("outPut="+data);
	      	//未登录
	      	if('0'!=outPut.result){
      			$('#registerUrl').attr('href','http://zhuce.changyou.com/regInit.act?gameType='+outPut.game+'&suffix=suffix');
      			popup($("#loginPop"));
      			reloadCheckCode();
			}else{
		      	//已登录
				reloadCheckCode_1();
		      	afterLogin(outPut.cn);
	      	}
		},
		error:function () {
			alert("*系统繁忙，请稍后重试");
		}
	});
}


//加载验证码(登录页)
function reloadCheckCode() {
	var checkCode = document.getElementById("checkcodeImg");
	var value = parseInt(Math.random() * 10000);
	//checkCode.src = "http://auth.changyou.com/servlet/ImageCode?random_mark="+value;
	checkCode.src=getRootPath()+ "/imgcode.jsp?random_mark="+value;
};
//加载验证码（兑换/激活页）
function reloadCheckCode_1() {
	var checkCode = document.getElementById("checkCodeId_1");
	var value = parseInt(Math.random() * 10000);
	//checkCode.src = "http://auth.changyou.com/servlet/ImageCode?random_mark="+value;
	checkCode.src=getRootPath()+ "/imgcode.jsp?random_mark="+value;
};

//前端检查是否登录信息的合法性
function checkLogin(){
	var cn_value=trim($('#accountEmails').val());
	var pwd_value=trim($('#password').val());
	var code_value=trim($('#checkcode').val());
	var regmail = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/;
	var regtel=/^([a-zA-Z0-9][a-zA-Z0-9_]{4,15})$/;
	if(isNull(cn_value)){
		$('#loginError').html("*请输入账号");
		$('#accountEmails').focus();
	}
	else if(cn_value.length<5||cn_value.length>50){
		$('#loginError').html("*账号长度不正确");
		$('#accountEmails').focus();
	}
	else if(!regmail.test(cn_value)&&!regtel.test(cn_value)){
		$('#loginError').html("*账号格式不正确");
		$('#accountEmails').focus();
	}
	else if(isNull(pwd_value)){
		$('#loginError').html("*请输入密码");
		$('#password').focus();
	}else if(code_value == undefined || code_value == 'null' || code_value == ""){
		$('#loginError').html("*请输入验证码");
		$('#checkcode').focus();
	}else{
		$('#loginError').html("正在登录，请稍后...");
		dealLogin();
	}
}

//点击登录按钮
$('#submitLogin').click(function(){
	checkLogin();
});

//登录功能
function dealLogin() {
   	var cn=trim($('#accountEmails').val());
   	var password=trim($('#password').val());
   	var annexCode=trim($('#checkcode').val());
	
	$.ajax({
	    type:"post", 
	    url:getRootPath()+"/loginController.do?login", 
		data:{'cn':cn,'password':password,'annexCode':annexCode},
		success:function (data, textStatus) {
	      	data=trim(data);
	      	eval("outPut="+data);
	      	$('#password').val('');
	    	$('#checkcode').val('');
	      	reloadCheckCode();
	      	if("001"==outPut.login){
	        	$('#loginError').text("*请输入账号");
	        }else if("002"==outPut.login||"003"==outPut.login||"009"==outPut.login){
                $('#loginError').text("*账号错误，请重新输入");
	        }else if("004"==outPut.login){
	        	$('#loginError').text("*您的账号异常，请尝试更换账号登录");
	      	}else if("005"==outPut.login){
	        	$('#loginError').text("*账号或密码错误");
	      	}else if("006"==outPut.login){
	        	$('#loginError').text("*请输入密码");
	      	}else if("007"==outPut.login){
	        	$('#loginError').text("*请输入验证码");
	      	}else if("008"==outPut.login){
	        	$('#loginError').text("*验证码错误，请重新输入");
	        }else if("99"==outPut.login){
	        	$('#loginError').text("*账号验证系统繁忙，请稍后再试");	
	      	}else if("000"==outPut.login){
	         	//判断账号是否被封停
	      		var checkCnCompetenceResult= checkCnCompetence(cn);
	      	    if("101"==checkCnCompetenceResult){
	      	    	hideMask($("#loginPop"));
	      	    	clearLoginRecord();
	      	    	showStopbCn(cn);
	      	    	delCookie("cardActive");
	      	    	
	      		}
	      	    else if("99"==checkCnCompetenceResult||"1"==checkCnCompetenceResult){
	      	    	$('#loginError').text("*系统繁忙，请稍后再试");	
	      	    	reloadCheckCode();
	      	    	delCookie("cardActive");
	      	    }
	      	    else if("2"==checkCnCompetenceResult){
	      	    	$('#loginError').text("*账号错误，请重新输入");	
	      	    	reloadCheckCode();
	      	    	delCookie("cardActive");
	      	    }else {
		      		$('#accountEmails').val('')
		      		$('#loginError').html("");
		      		//成功登录
		      		hideMask($("#loginPop"));
		      		afterLogin(outPut.cn);
		      		reloadCheckCode_1();
	      	    }
	      	}else{
	      		$('#loginError').html("*系统繁忙，请稍后再试");
	      	}
		},
		error:function () {
			clearLoginRecord();
			$('#loginError').html("*系统繁忙，请稍后再试");
		}
	});
}
//清空登录记录
function clearLoginRecord(){
	$('#loginError').html("");
	$('#accountEmails').val('');
	$('#password').val('');
   	$('#checkcode').val('');
   	reloadCheckCode();
}

//删除左右两端的空格 输入：字符串 输出：去空格的字符串
function trim(str) {  
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

//判断是否非空  输入：要检查的内容   输出：true 非空 false 空

function isNull(info){
	if(info==null || trim(info)==""){
		return true;
	}
	return false;
}


