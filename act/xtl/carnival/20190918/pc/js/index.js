$(function() {
    var namePhone = 'phoneNum';

    ja.config({
        app: 'xtl',
        activity: 'tfphone',
        version: '20190923',
        platform: 'changyou',
        ready: function(glob) {
            init();
            if(glob.code === 1) {
                var phoneNum = ja.utils.store.get(namePhone);
                if(phoneNum) {
                    getGift(phoneNum);
                }else {
                    ja.logout();
                }
            }
        }
    });

    /************** 通用方法 **************/
    // 弹窗
    function popShow(id) {
        popup($('#' + id));
    }
    function popHide() {
        hideMask($('.pop'));
    }

    // 点击判断
    function $click(fun) {
        switch (Number(ja.glob.code)) {
            case 0:
                alert('网络繁忙，请稍后再试');
                break;
            case 1: case 2:
                fun && fun();
                break;
            case 1106:
                alert('活动未开始');
                break;
            case 1103:
                alert('活动已结束');
                break;
            case 1102:
                alert('活动无效');
                break;
            default:
                alert('网络繁忙，请稍后再试');
        }
    }

    // 初始化
    function init() {
        $.get('/xtl/carnival/20190918/common/gift.json', function(res) {
            var eleHtml = template($('#PopList').html(), {
                imgBase: '/act/xtl/carnival/20190918/m/img/',
                arr: res
            });
            $('.gift_list').html(eleHtml);
        })
    }

    // 领取礼包
    function getGift(phone) {
        ja.post(ja.glob.urlPath + '/receiveGift', {
            phone: phone,
            channel: ja.glob.isMobile ? 'M' : 'PC'
        }, function(res) {
            if(res.code === 10000) {
                var count = 5;
                var countDown = setInterval(function () {
                    $('#jumpCount').text(count--);
                    if (count < 1) {
                        location.href = 'http://tlim.changyou.com/xtl/newserver/20190906/public/taohua/pc/index.shtml?CYSCID=gg';
                        clearInterval(countDown)
                    }
                }, 1000)
                popShow('pop3');
            }else if(res.code === 3103) {
                alert('您的账号已经封停')
            }else if(res.code === 1004) {
                alert('手机号已使用过')
            }else if(res.code === 3402) {
                alert('您的账号已经领取过')
            }else {
                alert(res.message);
            }
            ja.utils.store.remove(namePhone);
            ja.logout(function() {});
        })
    }

    /************** 事件绑定 **************/
   // 获取验证码
    $('.btn_phone_code').click(function() {
        $click(function() {
            ja.user.getCode()
        })
    });

    // 抢先预约
    $('.btn_reserve').click(function() {
        $click(function() {
            var $inputPhone = $('.input_phone'),
                $inputPhoneCode = $('.input_phone_code'),
                errorPhone = ja.verify.phone($inputPhone.val()),
                errorPhoneCode = ja.verify.code($inputPhoneCode.val());
            if(errorPhone) return alert(errorPhone);
            if(errorPhoneCode) return alert(errorPhoneCode);
            ja.post(ja.glob.urlPath + '/reserve', {
                phone: $inputPhone.val(),
                code: $inputPhoneCode.val()
            }, function(res) {
                if(res.code === 10000) {
                    if (res.data.isReceive == 0) {
                        ja.utils.store.set(namePhone, $inputPhone.val());
                        popShow('pop1')
                    } else {
                        alert('该手机号已领取奖励')
                    }
                }else if(res.code === 3002) {
                    alert('验证码错误');
                }else {
                    alert(res.message);
                }
            })
        })
    });

    // 打开礼包
    $('.btn_open_gift').click(function() {
        popHide();
        ja.login();
    });

});
