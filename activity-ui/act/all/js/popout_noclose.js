//联想下拉配置
/*
var conf = {
  	borderColor: '#C4CAD1' // 边框颜色
  	, backgroundColor: '#fff' // 背景色
	, fontColor: '#000' // 字体颜色
	, highlight: '' // 选中背景色
	, lineHeight: '22px'
	, width: ''
	, zIndex: 9999
	, popUp: true // 是否为弹出
	, adjustLeft: 35 // left矫正值，当popUp为弹框时（true），其值为left值
	, adjustTop: 15 // top矫正值，当popUp为弹框时（true），其值为top值
	, checkPhone: false
	, emails: ['changyou.com', 'game.sohu.com', 'qq.com', '163.com', 'sohu.com', 
		'17173.com', 'sina.com', 'vip.qq.com']
}
var accountEmails = new EmailAutoComplete('accountEmails', conf);*/

/*弹出框效果*/
function isExist(elem){
	if(typeof elem !== 'undefined' && typeof elem !== null) {
		return true;
	}else{
		return false;	
	}
}
var ie6 = $.browser.msie && parseInt($.browser.version)<=6 ;
var addOverlay = function(cl, op){		
removeOverlay();
var	overlayCss = {
		position       : 'fixed',
		zIndex         : '100',
		top            : '0px',
		left           : '0px',
		height         : '100%',
		width          : '100%',
		backgroundColor: '#000',
		filter         : 'alpha(opacity=60)',
		opacity        : 0.6
},
overlayCss2 = { //for ie 6
		position : 'absolute',
		height   : $(document).height()
};
var overlay = $('<div id="Overlay" class="OverlayBG" />');		
var overlay1 = $('<iframe id="Overlay1" class="OverlayBG"  frameborder="0"  scrolling="no"></iframe>');		
 
if(isExist(cl))		overlayCss.backgroundColor = cl;
if(ie6) {
$('body').append(overlay1.css(overlayCss));	
	}		
$('body').append(overlay.css(overlayCss));
 
if(ie6) {
 	overlay.css(overlayCss2)
	overlay1.css(overlayCss2);
	$('#Overlay1').css("opacity",0);
	overlay1.css("background","none");
};		
if(isExist(op))	 {
	$('#Overlay').animate({opacity: op},0);	
  }	
}
/*** removeOverlay ***/
var removeOverlay = function(){
	if(isExist($('#Overlay'))) $('#Overlay').remove();
	if(isExist($('#Overlay1'))) $('#Overlay1').remove();
}
/*** popup ***/
function popup(target){
	  addOverlay('#000', 0.8);
	  if(ie6){
		  target.css("position","absolute")
				   .css("top",($(window).height()-target.height())/2 + $(window).scrollTop())
				   .css("left",($(window).width()-target.width())/2+$(window).scrollLeft())
				   .css("z-index","9999")
				   .fadeIn();
		  $(window).scroll( function() { 
				target.css("top",($(window).height()-target.height())/2 + $(window).scrollTop())
						  .css("left",($(window).width()-target.width())/2+$(window).scrollLeft())
		   });
	  }
	  else {
		  target.css("position","fixed")
				   .css("top",($(window).height()-target.height())/2)
				   .css("left",($(window).width()-target.width())/2)
				   .css("z-index","9999")
				   .fadeIn();
		  
	  }

	  $(".close", target).click(function(){
		  hideMask(target);
	  });
 
 }

/*** close  popup ***/
function hideMask(target){
		removeOverlay();
		target.fadeOut();
};