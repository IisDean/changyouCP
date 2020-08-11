var jczd = null;//选择的竞猜战队
// 选择战队
$(".zdjc-list li").on("click", function(){
    var $this = $(this),
        idx = $this.index();
    $this.addClass('active').siblings("li").removeClass('active');
    jczd = idx;
});

// 确认选择
$(".btn-confirm-xz").on("click", function(){
    if(jczd == null){
        popShow('pop2');
    }else {
        popShow('pop3');
    }
});