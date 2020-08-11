
// 选择你支持的战队
$(".select-zd-list li").on("click", function(){
    var $this = $(this),
        idx = $this.index();
    $this.removeClass('filter').addClass("active").siblings("li").removeClass("active").addClass('filter');
});
// 确认选择
$(".btn-confirm-sz").on("click", function(){
    
});