//加载验证码(登录页)
function reloadCheckCode () {
	var checkCode = document.getElementById("checkcodeImg");
	var value = parseInt(Math.random() * 10000);
	checkCode.src = "http://auth.changyou.com/servlet/ImageCode?random_mark="+value;
};

function callbackLogin(data) {
	var msg = decodeURI(data);
	if (msg != "ok") {
		reloadCheckCode ();
	}
	dealLogin(msg);
}

function authlogout() {
	var curr = window.location.href;
	window.location.href = "http://auth.changyou.com/logout?b=" + curr ;
}

//获取当前url中参数
function getParameters(url) {
	var vars = [], hash;
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
