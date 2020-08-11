
var infoType = false;

localStorage.setItem(ja.options.key.cyscid,'goddessPC');
ja.simpleConfig('xtl','goddess','20181210','changyou', function (msg){
	//未登录
	$('.attest').on('click',function(){
		showDia('loginPop');
	})
},function (msg) {
	$('#loginName').html(msg.data.openid);
	$('#loginUp').hide();
	$('#loginOut').show();
	//我要认证
	$('.attest').on('click',function(){
		showDia('popInfo');
	})
	$('#thisCenter').on('click',function(){
		showDia('loginApply');
	})
	personCenter();
});

//拉取登录弹窗
function loginShow(){
	ja.slogin(1);
	showDialog.hide();
}

//登录后个人信息
function personCenter(){
	ajax('POST','/changyou/xtl/goddess/personCenter',{},function(msg){
		var data = msg.data;
		if(msg.code != 10000){
			return
		}
		if(data.submitTimes >= 2){
			$('.pop3 .pop-modify').hide();
		}
		infoType = true;
		$('.mark-all').html(data.sn);
		$('.attest,#thisCenter').on('click',function(){
			//初级高级审核中
			if(data.status == 0 && data.authlevel == 0 && data.video){
				showDia('review1');
				return
			}
			//初级高级审核通过
			if(data.status == 2 && data.authlevel == 2){
				showDia('review2');
			}
			//初级审核通过高级打回
			if(data.status == 2 && data.authlevel == 1 || data.status == 1 && data.authlevel == 1){
				showDia('review3');
			}
			//初级审核打回
			if(data.status == 1 && data.authlevel == 0){
				showDia('review4');
			}
			//初级审核通过 高级审核中
			if(data.status == 0 && data.authlevel == 1){
				showDia('review5');
			}
			//初级审核通过
			if(data.status == 2 && data.authlevel == 1 && data.video == ""){
				showDia('review6');
			}
			//初级审核中
			if(data.status == 0 && data.authlevel == 0){
				showDia('review7');
			}
    	})
	})
}

function ajax(type,ajax_url,data,fun){
    ja.ajax({
        type: type,
        url: ajax_url,
        data : data,
        headers:{
            APP:"xtl",
            ACTIVITY:"goddess",
            VERSIONCODE:20181210,
			plat:'changyou'
        },
        dataType: "JSON",
        success: function(msg){
        	fun && fun(msg);
        }
    })
}

//提交审核
function createRegUser(){
	var image = [];
	//昵称
	if($('#nickname').val() == ''){
		alert('请填写角色名');
		return
	}
	//省份城市
	if($('#province').val() == '' || $('#province').val() == ''){
		alert('请选择省份城市');
		return
	}
	//年龄
	if($('#age').val() == ''){
		alert('请填写年龄');
		return
	}
	//星座
	if($('#yy').val() == ''){
		alert('选择星座');
		return
	}
	//身高
	if($('#height').val() == ''){
		alert('请填写身高');
		return
	}
	//体重
	if($('#weight').val() == ''){
		alert('请填写体重');
		return
	}
	//爱好
	if($('#hobby').val() == ''){
		alert('请填写爱好');
		return
	}
	//qq
	if($('#qq').val() == ''){
		alert('请填写QQ号');
		return
	}
	//手机号
	if($('#phone').val() == ''){
		alert('请填写手机号');
		return
	}
	//省市
	//province = "湖南省";
	//city = "长沙市";

	//上传图片
	$('#imageList img').each(function(){
		image.push($(this).attr('src'));
	})
	if(image.length < 2){
		alert('请上传2张以上5张以内照片');
		return
	}
	if(image == "" || image[0].indexOf('data:image/jpeg;base64') == 0){
		alert('请先上传参选照片');
		return
	}
	//视频
	var PostSrc = "";
	var userInfo = {
			nickname : $('#nickname').val(),
			age : $('#age').val(),
			height :$('#weight').val(),
			weight : $('#height').val(),
			province : $('#province').val(),
			city : $('#province').val(),
			qq: $('#qq').val(),
			constellation : $('#yy').val(),
			phone : $('#phone').val(),
			hobby : $('#hobby').val(),
			declaration : $('#hobby').val(),
			video : $('#video').val(),
			image : image.join("@@@@")
		}

	if(!infoType){
		PostSrc = '/changyou/xtl/goddess/createRegUser';
	}else{
		PostSrc = '/changyou/xtl/goddess/updateRegUser';
	}

	ajax('POST',PostSrc,userInfo ,function(msg){
		if(msg.code != 10000){
			alert(msg.message);
			return
		}
		if(msg.data.xtlGoddessRegUser.video == ""){
			//初级报名成功
			showDia('seOver2');
		}else{
			//高级报名成功
			showDia('seOver1');
		}
	})
}

	$('#height').change(function(){
		$(this).val($(this).val() + 'cm');
	})
	$('#weight').change(function(){
		$(this).val($(this).val() + 'kg');
	})

//更新视频地址
function updateRegUserVideo(){
	if($('#UserVideo').val() == ""){
		alert('请填写视频地址');
	}
	ajax('POST','/changyou/xtl/goddess/updateRegUserVideo',{videourl : $('#UserVideo').val() } ,function(msg){
		if(msg.code != 10000){
			alert(msg.message);
			return
		}
		showDia('seOver1');
	})
}

$("#fileImg").change(function(event){
	var arr = event.currentTarget.files;
	$('#imageList').html("");
	function addFile(c){
		if(c >= 5)return
		var file = arr[c];
		var	reader  = new FileReader();
		reader.onload = function () {
			$('#imageList').append('<li><img src="'+ reader.result +'" /></li>');
			if(c >= file.length)return;
			addFile(c+1);
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	}
	addFile(0);
});

function upFileImg(){
	var image = [];
	$('#imageList img').each(function(){
		image.push($(this).attr('src'));
	})
	if(image[0].indexOf('data:image/jpeg;base64') == -1){
		alert('照片已上传');
		return
	}
	if($('#upFileImg').html() == '上传中...'){
		return
	}
	$('#upFileImg').html('上传中...');
	ja.ajax({
        type: 'POST',
        url: '/changyou/xtl/goddess/uploadImg',
        data : image.join("@@@@@"),
        dataType: "JSON",
      	processData: false,
      	contentType: false,
        success: function(msg){
			$('#upFileImg').html('本地上传');
			if(msg.code != 10000){
				alert(msg.message);
				return
			}
			var data = msg.data.imgPathList,
				ht = "";
			for(var c in data){
				ht += '<li><img src="'+ data[c] +'" /></li>';
			}
			$('#imageList').html(ht);
			alert('上传照片成功');
        }
    })
}

//翻页
function addPage(id,total,pageNum,pageSize,fun){
	if(total <= pageSize){
		$(id).hide()
	}else{
		$(id).show()
	}
	var maxPage = Math.ceil(total/pageSize);
	var ht = '';
	ht += '<a href="javascript:;" page-first>首页</a>';
	ht += '<a href="javascript:;" page-up>上一页</a>';
	if(pageNum > 2){
		ht += '<a href="javascript:;" page-num>'+ (pageNum-2) +'</a>';
	}
	if(pageNum > 1){
		ht += '<a href="javascript:;" page-num>'+ (pageNum-1) +'</a>';
	}
	ht += '<a href="javascript:;" page-num class="cur">'+ pageNum +'</a>';
	if(pageNum <= maxPage-1){
		ht += '<a href="javascript:;" page-num>'+ (pageNum+1) +'</a>';
	}
	if(pageNum <= maxPage-2){
		ht += '<a href="javascript:;" page-num>'+ (pageNum+2) +'</a>';
	}
	if(pageNum <= maxPage-3){
		ht += '<span>...</span>';
	}
	ht += '<a href="javascript:;" page-dn>下一页</a>';
	ht += '<a href="javascript:;" page-last>页尾</a>';
	$(id).html(ht);
	$(id).find('[page-first]').on('click',function(){
		fun && fun(1)
	})
	$(id).find('[page-last]').on('click',function(){
		fun && fun(maxPage)
	})
	$(id).find('[page-up]').on('click',function(){
		if(pageNum-1 <= 0)return
		fun && fun(pageNum-1);
	})
	$(id).find('[page-dn]').on('click',function(){
		if(pageNum+1 > maxPage)return
		fun && fun(pageNum+1);
	})
	$(id).find('[page-num]').on('click',function(){
		fun && fun($(this).text());
	})
}

//高级认证列表
var advancedData = {
	keyword : '',
	orderby : 'ssn',
	pageSize : 8
}
$('#advancedSoso').on('click',function(){
	advancedData.keyword = $('#advancedInput').val();
	advancedList(1);
})
$('#advancedRank').on('click',function(){
	var d = $(this).find('span');
	d.toggleClass('cur');
	$('#advancedInput').val("");
	if(d.hasClass('cur')){
		advancedData.keyword = "";
		advancedData.orderby = "sn";
		advancedList(1);
	}else{
		advancedData.keyword = "";
		advancedData.orderby = "ssn";
		advancedList(1);
	}
})
function advancedList(pageNum){
	ajax('GET','/changyou/xtl/goddess/queryGoddessList',{
			authlevel:2,
			pageNum:pageNum,
			pageSize:advancedData.pageSize,
			keyword:advancedData.keyword,
			orderby:advancedData.orderby
		},function(msg){
		if(msg.code != 10000){
			$('#advanced').html('<p class="pro-none">网络异常或暂无信息</p>');
			return
		}
		var data = msg.data.xtlGoddessUserList,
			ht = "";
		for(var c in data.list){
			ht += '<li>';
				ht += '<img data-vid="'+ data.list[c].video +'" data-img="'+ data.list[c].image +'" data-arr="'+ data.list[c].nickName +','+ data.list[c].age +','+ data.list[c].city +','+ data.list[c].constellation +','+ data.list[c].height +','+ data.list[c].weight +','+ data.list[c].hobby +'" src="'+ data.list[c].image.split('@@@@')[0] +'" />';
				ht += '<p>角色名：'+ data.list[c].nickName +'</p>';
				ht += '<span class="comm">编号 '+ data.list[c].sn +'</span>';
				ht += '<a href="'+ data.list[c].video +'" target="_blank" class="pro-play comm" title="播放视频">播放视频</a>';
			ht += '</li>';
		}
		if(ht == ""){
			ht += '<p class="pro-none">搜索的编号不存在</p>';
		}
		$('#advanced').html(ht);
		addPage('#advancedPage',data.total, data.pageNum, data.pageSize, advancedList);
	})
}
advancedList(1)

//初级认证列表
var primaryData = {
	keyword : '',
	orderby : 'ssn',
	pageSize : 8
}
$('#primarySoso').on('click',function(){
	primaryData.keyword = $('#primaryInput').val();
	primaryList(1);
})
$('#primaryRank').on('click',function(){
	var d = $(this).find('span');
	d.toggleClass('cur');
	$('#primaryInput').val("");
	if(d.hasClass('cur')){
		primaryData.keyword = "";
		primaryData.orderby = "sn";
		primaryList(1);
	}else{
		primaryData.keyword = "";
		primaryData.orderby = "ssn";
		primaryList(1);
	}
})
function primaryList(pageNum){
	ajax('GET','/changyou/xtl/goddess/queryGoddessList',{
			authlevel:1,
			pageNum:pageNum,
			pageSize:primaryData.pageSize,
			keyword:primaryData.keyword,
			orderby:primaryData.orderby
		},function(msg){
		if(msg.code != 10000){
			$('#primary').html('<p class="pro-none">网络异常或暂无信息</p>');
			return
		}
		var data = msg.data.xtlGoddessUserList,
			ht = "";
		for(var c in data.list){
			ht += '<li>';
				ht += '<img data-img="'+ data.list[c].image +'" data-arr="'+ data.list[c].nickName +','+ data.list[c].age +','+ data.list[c].city +','+ data.list[c].constellation +','+ data.list[c].height +','+ data.list[c].weight +','+ data.list[c].hobby +'" src="'+ data.list[c].image.split('@@@@')[0] +'" />';
				ht += '<p>角色名：'+ data.list[c].nickName +'</p>';
				ht += '<span class="comm">编号 '+ data.list[c].sn +'</span>';
			ht += '</li>';
		}
		if(ht == ""){
			ht += '<p class="pro-none">搜索的编号不存在</p>';
		}
		$('#primary').html(ht);
		addPage('#primaryPage',data.total, data.pageNum, data.pageSize, primaryList);

	});
}
primaryList(1);



$('.rule-nav li').on('click',function(){
	$(this).addClass('cur').siblings().removeClass('cur');
	$('.rule-cont').hide().eq($(this).index()).show();
}).eq(0).click();

$('.pop-person .left a').on('click',function(){
	var n = parseInt($(this).html())-1;
	$('.pop-person .left a').removeClass('on');
	$(this).addClass('on');
	$('.personImg-box img').hide();
	$('.personImg-box img').eq(n).show();
})


$(document).on('click','[data-arr]',function(){
	var arr = $(this).attr('data-arr').split(',');
	var im = $(this).attr('data-img').split('@@@@');
	var vid = $(this).attr('data-vid');

	if(vid){
		$('#renzVideo').attr('href',vid).html('查看美拍视频');
	}else{
		$('#renzVideo').attr('href','javascript:;').html('当前玩家未参加高级认证');
	}

	$('#iNickName').html(arr[0]);
	$('#iAge').html(arr[1]);
	$('#iCity').html(arr[2]);
	$('#iYy').html(arr[3]);
	$('#iHeight').html(arr[4]);
	$('#iWeight').html(arr[5]);
	$('#iHobby').html(arr[6]);

	var htm = '';
	for(var c in im){
		htm += '<div class="slide-item"><img src="'+ im[c] +'" /></div>'
	}
	$('#slidePic').html(htm);
	$('.slide-nav').html('');


	showDia('frontPop');


	
	//滑动
	quansu.slide({
		item: '.slide-item',//切换的内容（必填）
		nav: '.slide-nav',//切换的导航（必填）
		prev: '.slide-prev',//前一张按钮
		next: '.slide-next',//后一张按钮
		delay: 4000,//自动切换时间间隔，为0则不自动切换（默认：4000）
		duration: 500,//切换一次所需时间（默认500）
		event: 'mouseover',//事件触发方式click|mouseover（默认：mouseover）
		callback: function () { }//每次切换完成执行的函数
	});


})
