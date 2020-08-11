
//晋级战队列表
var zdList = [];
// 预选战队
$(".yx-zd-list li").on("click", function(){
    var $this = $(this),
        idx = $this.index(),
        num = $this.find(".num-label").text(),
        name = $this.find(".zd-name-text").text();
    $this.addClass('active');
    updateList({
        idx: idx,
        num: num,
        name: name
    });
});

//确认选择
$(".btn-confirm-xz2").on("click", function(){
    if( zdList.length < 4 ){
        popShow('pop4');
    }else {
        popShow('pop3');
    }
});

//更新晋级战队列表数据
function updateList(obj){
    var exist = -1;
    zdList.forEach(function(ev, idx){
        if( obj.idx == ev.idx )exist = idx;
    });
    if( exist == -1){
        zdList.push(obj);
    }else {
        $('.yx-zd-list li').eq(zdList[exist].idx).removeClass('active');
        zdList.splice(exist, 1);
    }
    //当列表超出4个时，删除最前面的一个
    if(zdList.length > 4){
        $('.yx-zd-list li').eq(zdList[0].idx).removeClass('active');
        zdList.splice(0, 1);
    }
    renderList();
}

//渲染晋级战队列表
function renderList(){
    var str = '';
    zdList.forEach(function(ev, idx){
        str += '<div class="icons t-c yx-zd-item">'+
                    '<div class="f-l num-label">'+ ev.num +'</div>'+
                    '<div class="zd-name-text t-hide">'+ ev.name +'</div>'+
                '</div>';
    });
    $(".jjzd-plank").html(str);
}