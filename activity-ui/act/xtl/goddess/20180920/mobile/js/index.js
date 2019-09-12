
var infoType = false;
var startInfo = false;
var renVideo = '';
var userVideo = '';
var maxSubmit = '';
var timeMsg = '';
var thisSubmit = '';

ajax('GET','/changyou/xtl/goddess/actvInfo',{},function(msg){
	var data = msg.data;
	var thTime = new Date();
	var strTime = new Date(data.applyStartTime);
	var endTime = new Date(data.applyEndTime);
	if(thTime < strTime){
		timeMsg = '报名未开始';
	}
	if(thTime > endTime){
		timeMsg = '报名已经结束';
	}
	if(timeMsg != ''){
		$('.pop-modify').hide();
		$('.pop-attest,.pop-upgrade').on('click',function(){
			alert(timeMsg);
			return false
		});
	}
	maxSubmit = data.maxSubmitTimes;
})

localStorage.setItem(ja.options.key.cyscid,'goddessMobile');
ja.simpleConfig('xtl','goddess','20181210','changyou', function (msg){
	//未登录
	$('.attest').off('click').on('click',function(){
		showDia('loginPop');
	})
},function (msg) {
	$('#loginName').html(msg.data.openid);
	$('#loginUp').hide();
	$('#loginOut').show();
	//我要认证
	$('.attest').off('click').on('click',function(){
		personCenter(2);
	})
	//个人中心
	$('#thisCenter').off('click').on('click',function(){
		personCenter(1);
	})
});

$('.attest').on('click',function(){
	loginShow();
})

//拉取登录弹窗
function loginShow(){
	ja.slogin(1);
	showDialog.hide();
}

//登录后个人信息
function personCenter(n){
	if(timeMsg != '' && n == 2){
		alert(timeMsg);
		return
	}
	if(startInfo)return
	startInfo = true; //防止多次点击
	ajax('POST','/changyou/xtl/goddess/personCenter',{},function(msg){
		var data = msg.data;
    	if(msg.code == 1000 && n == 1){
    		renVideo = '';
    		showDia('loginApply');
    		return
    	}
    	if(msg.code == 1000 && n == 2){
    		renVideo = '';
    		showDia('popInfo');
    		return
    	}
    	$('#nickname').val(data.nickName);
    	$('#age').val(data.age);
    	$('#hobby').val(data.hobby);
    	$('#weight').val(data.weight);
    	$('#height').val(data.height);
    	$('#qq').val(data.qq);
    	$('#phone').val(data.phone);
    	$('#province').val(data.province).change();
    	$('#city').val(data.city);
    	$('#yy').val(data.constellation);
    	for(var c in data.image.split('@@@@')){
    		$('#imageList li').eq(c).find('img').attr('src',data.image.split('@@@@')[c])
    	}
    	if(data.video){
    		$('.pop-info-btn .submit').hide();
    		$('#UserVideo').val(data.video);
    	}
		if(data.submitTimes >= maxSubmit || data.status == 9){
			$('.pop3 .pop-modify').hide();
			$('.pop-attest,.pop-upgrade').off('click').on('click',function(){
				alert('修改次数已达上限');
				return false
			});
		}
		infoType = true;
		$('.mark-all').html(data.sn);
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
		if(data.status == 2 && data.authlevel == 1 && data.video != ''){
			showDia('review3');
		}
		//初级审核通过高级打回
		if(data.status == 1 && data.authlevel == 1){
			showDia('review3');
		}
		//初级审核打回
		if(data.status == 1 && data.authlevel == 0 || data.status == 9){
			showDia('review4');
		}
		//初级审核通过 高级审核中
		if(data.status == 0 && data.authlevel == 1){
			showDia('review5');
		}
		//初级审核通过
		if(data.status == 2 && data.authlevel == 1 && !data.video){
			showDia('review6');
		}
		//初级审核中
		if(data.status == 0 && data.authlevel == 0){
			showDia('review7');
		}
		//初级审核通过 已无修改次数
		if(data.status == 1 && data.authlevel == 1 && data.submitTimes >= maxSubmit){
			showDia('review8');
		}
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
        	console.log(msg)
			startInfo = false; //防止多次点击
        	if(msg.code != 10000 && msg.code != 1000){
        		alert(msg.message);
        		return
        	}
        	fun && fun(msg);
        }
    })
}

//提交审核
function createRegUser(sec){
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
	//省份城市
	if($('#city').val() == '' || $('#city').val() == ''){
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
	if($('#qq').val().length < 4){
		alert('请填写正确的QQ号');
		return
	}
	//手机号
	if($('#phone').val() == ''){
		alert('请填写手机号');
		return
	}
	if($('#phone').val().length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test($('#phone').val()))){
		alert('请填写正确的手机号');
		return
	}
	//上传图片
	$('#imageList img').each(function(){
		if($(this).attr('src')){
			image.push($(this).attr('src'));
		}
	})
	if(image.length < 2){
		alert('请上传2张以上5张以内照片');
		return
	}
	//视频
	var PostSrc = "";
	var userInfo = {
			nickname : $('#nickname').val(),
			age : $('#age').val(),
			height : parseInt($('#height').val()),
			weight : parseInt($('#weight').val()),
			province : $('#province').val(),
			city : $('#city').val(),
			qq: $('#qq').val(),
			constellation : $('#yy').val(),
			phone : $('#phone').val(),
			hobby : $('#hobby').val(),
			image : image.join("@@@@")
		}
	if(!infoType){
		PostSrc = '/changyou/xtl/goddess/createRegUser';
	}else{
		PostSrc = '/changyou/xtl/goddess/updateRegUser';
	}
	console.log(userVideo)
	//认证成功 开始验证视频
	if(renVideo == 'meipai' && userVideo == ''){
		sec && sec();
		return
	}
	if(userVideo != ''){
		userInfo.video = userVideo;
	}
	ajax('POST',PostSrc,userInfo ,function(msg){
		if(userVideo == ''){
			showDia('seOver2');
		}else{
			showDia('seOver1');
		}
	})
}

//继续认证
function carryUser(){
	renVideo = 'meipai';
	createRegUser(function(){
		showDialog.hide();
		showDia('updateRegUserVideo');
	});
}

$('#height').change(function(){
	$(this).val($(this).val() + 'cm');
})
$('#weight').change(function(){
	$(this).val($(this).val() + 'kg');
})

//更新视频地址
function updateRegUserVideo(){
	var vic = $('#UserVideo').val();
	if($('#UserVideo').val() == ""){
		alert('请填写视频地址');
		return
	}

	//直接申请高级
	if(renVideo == 'meipai'){
		userVideo = $('#UserVideo').val();
		createRegUser();
		return
	}
	//视频更新
	ajax('POST','/changyou/xtl/goddess/updateRegUserVideo',{videourl : $('#UserVideo').val() } ,function(msg){
		if(msg.code == 10000){
			showDia('seOver1');
		}
	})
}


//上传照片
function upFileImg(base64Src,fun){
	ja.ajax({
        type: 'POST',
        url: '/changyou/xtl/goddess/uploadImg',
        data : base64Src,
        dataType: "JSON",
      	processData: false,
      	contentType: false,
        success: function(msg){
			var data = msg.data.imgPathList;
			fun && fun(data[0]);
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
	pageSize : 6
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
				ht += '<img data-vid="'+ data.list[c].video +'" data-img="'+ data.list[c].image +'" data-arr="'+ data.list[c].nickName +','+ data.list[c].age +','+ data.list[c].province +','+ data.list[c].constellation +','+ data.list[c].height +','+ data.list[c].weight +','+ data.list[c].hobby +'" src="'+ data.list[c].image.split('@@@@')[0] +'" />';
				ht += '<p>角色名：'+ data.list[c].nickName +'</p>';
				ht += '<span class="comm">编号 '+ data.list[c].sn +'</span>';
				ht += '<a href="javascript:;" class="pro-play comm" title="播放视频" data-vid="'+ data.list[c].video +'" data-img="'+ data.list[c].image +'" data-arr="'+ data.list[c].nickName +','+ data.list[c].age +','+ data.list[c].city +','+ data.list[c].constellation +','+ data.list[c].height +','+ data.list[c].weight +','+ data.list[c].hobby +'">播放视频</a>';
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
	pageSize : 6
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
				ht += '<img data-img="'+ data.list[c].image +'" data-arr="'+ data.list[c].nickName +','+ data.list[c].age +','+ data.list[c].province +','+ data.list[c].constellation +','+ data.list[c].height +','+ data.list[c].weight +','+ data.list[c].hobby +'" src="'+ data.list[c].image.split('@@@@')[0] +'" />';
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
	$('#iProvince').html(arr[2]);
	$('#iYy').html(arr[3]);
	$('#iHeight').html(arr[4] + 'cm');
	$('#iWeight').html(arr[5] + 'kg');
	$('#iHobby').html(arr[6]);
	var htm = '';
	htm += '<div class="swiper-container">';
		htm += '<div class="swiper-wrapper">';
		for(var c in im){
			htm += '<div class="swiper-slide"><img src="'+ im[c] +'" /></div>'
		}
		htm += '</div>';
		htm += '<div class="swiper-pagination"></div>';
	htm += '</div>';
	$('.personImg-box').html(htm);
	showDia('frontPop');
	var upsSwiper = new Swiper('.swiper-container', {
		speed: 1000,
		longSwipes: false,
		loop: true,
		autoplay: {
			disableOnInteraction: false,
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		}
	});
})

//剪切弹窗
var imageCropper = $('#imageCropper');
var options = {
    aspectRatio: 1 / 1, //裁剪框比例1:1
    //preview: '.img-preview',
    crop: function (e) {

    }
};
imageCropper.cropper(options);

$('#imageList input').live('change',function(event){
	var i = $('#imageList input').index($(this));
	var eve = event || window.event;
	var file =  event.currentTarget.files[0];
	var	reader  = new FileReader();
	reader.onload = function () {
		showDia('cropperPop');
		$('#imageList input').val("");


		imageCropper.cropper('destroy').attr('src', reader.result).attr('len',i).cropper(options);


	};
	if (file) {
		reader.readAsDataURL(file);
	}
});


//确定剪切
function cropperDate(){
	var imageSrc = imageCropper.cropper('getCroppedCanvas').toDataURL('image/jpeg');
	console.log(imageSrc)
	var t = imageCropper.attr('len');
	
	upFileImg(imageSrc,function(data){
		$('#imageList img').eq(t).attr('src',data);
		showDia('popInfo');
	})
}

function cropperHide(){
	showDialog.hide()
	showDia('popInfo');
}