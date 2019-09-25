(function () {
    var JoinActivity = function () {
        /*var pattern = /(.+)-activity.changyou.com/;
        var match = window.location.host.match(pattern);
        if (undefined == match || null == match) return;
        // 兼容indexOf();
        if (!Array.prototype.indexOf)  Array.prototype.indexOf = (function(Object, max, min){
            "use strict";
            return function indexOf(member, fromIndex) {
                if(this===null||this===undefined)throw TypeError("Array.prototype.indexOf called on null or undefined");

                var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);
                var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);
                if (i < 0) i = max(0, Len+i); else if (i >= Len) return -1;

                if(member===void 0){ for(; i !== Len; ++i) if(that[i]===void 0 && i in that) return i; // undefined
                }else if(member !== member){   for(; i !== Len; ++i) if(that[i] !== that[i]) return i; // NaN
                }else                           for(; i !== Len; ++i) if(that[i] === member) return i; // all else

                return -1; // if the value was not found, then return -1
            };
        })(Object, Math.max, Math.min);
        // window.document.domain;
        var _host = match[1];
        // if(!pattern.test(window.location.host)) return;
        // _host = window.location.host.substring(0, window.location.host.lastIndexOf('-'));
        var domains = ['join', 'pre', 'pre-join', 'test', 'test-join', 'local', 'local-join'];
        if (domains.indexOf(_host) != -1) {
            _host = "http://" + _host + "-activity.changyou.com";
        } else _host = "http://join-activity.changyou.com";*/

        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8080
        var _host = curWwwPath.substring(0, pos);

        this.options = {
            host: _host,
            key: {
                token: "JOIN_TOKEN",
                app: "APP",
                activity: "ACTIVITY",
                version: "VERSION",
                client: "CLIENT",
                cyscid: "CYSCID"
            },
            ready: function () {
            }
        };
    };
    JoinActivity.fn = JoinActivity.prototype = {
        simpleConfig: function (app, activity, version, platform, readyFunc, loginBackFunc) {
            this.config({
                app: app,
                activity: activity,
                version: version,
                platform: platform,
                ready: readyFunc,
                loginBack: loginBackFunc
            });
        },
        config: function (options) {
            if (options == undefined) {
                options = {};
            }
            this.options = $.extend({}, this.options, options);
            if (this.options.platform == undefined) {//只有landing需要该参数
                alert("未设置登录平台");
            }
            if (this.options.app == undefined || this.options.activity == undefined || this.options.version == undefined) {
                alert("未设置SDK的活动标识");
            }
            localStorage.setItem(ja.options.key.app, this.options.app);
            localStorage.setItem(ja.options.key.activity, this.options.activity);
            localStorage.setItem(ja.options.key.version, this.options.version);

            var cyscid = ja.getParam(ja.options.key.cyscid);
            if (cyscid != undefined && null != cyscid && "" != cyscid && "null" != cyscid) {
                localStorage.setItem(ja.options.key.cyscid, cyscid);
            }

            var api = "/" + this.options.platform + "/landing/init";
            console.log(api)
            this.ajax(api, function (data) {

                if (data.code == 0) document.location.reload();
                if (data.code != 10000) {
                    sessionStorage.setItem('activity-active-code', data.message);
                    alert(data.message);
                    // return;
                } else {
                    sessionStorage.removeItem('activity-active-code');
                }
                ja.app = data.data.app;
                ja.activity = data.data.activity;
                ja.token = data.data.token;
                ja.client = data.data.client;
                if (window.localStorage) {
                    localStorage.setItem(ja.options.key.token, data.data.token);
                    localStorage.setItem(ja.options.key.app, data.data.activity.appCode);
                    localStorage.setItem(ja.options.key.activity, data.data.activity.activityCode);
                    localStorage.setItem(ja.options.key.version, data.data.activity.activityVersion);
                    localStorage.setItem(ja.options.key.client, data.data.client);
                }

                if (ja.options.platform == 'wechat') {
                    ja.slogin(1);
                    $.getScript("https://res.wx.qq.com/open/js/jweixin-1.2.0.js", function () {
                        $.getScript(ja.options.host + "/js/join-activity-wechat-1.0.0.js", function () {
                            ja.options.ready();
                        });
                    });
                } else {
                    if (data.data.activity.openWx > 0) {
                        $.getScript("https://res.wx.qq.com/open/js/jweixin-1.2.0.js", function () {
                            $.getScript(ja.options.host + "/js/join-activity-wechat-1.0.0.js", function () {
                                ja.options.ready();
                            });
                        });
                    } else {
                        ja.options.ready();
                    }
                    ja.slogin(0);
                }
            });
        },
        /*        function getQueryString(name) {
                var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
                if (result == null || result.length < 1) {
                    return "";
                }
                return result[1];
            }*/
        getParam: function (paramKey) {
            var result = window.location.search.match(new RegExp("[\?\&]" + paramKey + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        },
        getCyscid: function () {
            var cyscid = localStorage.getItem(ja.options.key.cyscid);
            if ("null" == cyscid) {
                cyscid = "";
            }
            return cyscid;
        },
        configDomain: function (domain) {
            if (undefined == domain || null == domain || '' == domain) return;
            this.options.host = domain;
        },
        getDomain: function () {
            // if(undefined == this.options) return "http://join-activity.changyou.com";
            return this.options.host;
        },
        ajax: function (api, data, fn) {
            var ajaxOptions = {
                success: function () {
                }
            };
            if (typeof api == "string") {
                ajaxOptions.api = api;
                if ($.isFunction(data)) {
                    ajaxOptions.success = data;
                } else if (data != undefined) {
                    ajaxOptions.data = data;
                }
                if ($.isFunction(fn)) {
                    ajaxOptions.success = fn;
                }
            } else if (typeof api == "object") {
                ajaxOptions = $.extend(ajaxOptions, api);
            }

            var _host;
            if (undefined == this.options) _host = "http://join-activity.changyou.com";
            else _host = this.options.host;
            var _options = $.extend({
                url: _host + ajaxOptions.api,
                //contentType: "application/json",
                headers: {
                    "Authorization": ja.user.getToken(),
                    "APP": localStorage.getItem(ja.options.key.app),
                    "ACTIVITY": localStorage.getItem(ja.options.key.activity),
                    "VERSIONCODE": localStorage.getItem(ja.options.key.version),
                    "CYSCID": ja.getCyscid(),
                },
                cache: false,
                dataType: "json"
            }, ajaxOptions, {
                success: function (data, textStatus, jqXHR) {
                    if (data && data.code && data.code == 1012) {
                        ja.login(ja.options.platform);
                        return;
                    }
                    ajaxOptions.success(data, textStatus, jqXHR);
                }
            });
            $.ajax(_options);
        },
        getActivity: function () {
            return this.activity;
        },
        getClient: function () {
            return this.client;
        },
        getApp: function () {
            return this.app;
        },
        getPlatform: function () {
            return this.options.platform;
        },
        getLanding: function () {
            return this.options.host + "/" + this.options.platform + "/landing";
        },
        logout: function () {
            this.ajax({
                type: 'post',
                url: this.options.host + "/" + this.options.platform + "/core/login/" + this.options.app + "/" + this.options.activity + "/" + this.options.version + "/logout",
                success: function () {
                    if (ja.options.platform == 'changyou' || ja.options.platform == 'warframe') {
                        var currURL = location.href;
                        location.href = "http://member.changyou.com/logout?b=" + currURL;
                    } else {
                        location.reload();
                    }
                }
            });
        },
        slogin: function (must) {
            ja.login(ja.getPlatform(), must)
        },
        login: function (platform, must, back) {
            var activeCode = sessionStorage.getItem('activity-active-code');
            if (activeCode != undefined) {
                alert(activeCode);
                return;
            }
            if (must == undefined) {
                must = 1;
            }
            if (back == undefined) {
                back = window.location.href;
            }
            var _app = localStorage.getItem(ja.options.key.app);
            var _act = localStorage.getItem(ja.options.key.activity);
            var _ver = localStorage.getItem(ja.options.key.version);
            var url = this.options.host + "/" + platform + "/core/login/" + _app + "/" + _act + "/" + _ver + "?callback=" + encodeURI(back);
            var platformLogin = {
                wechat: function () {
                    if (ja.client.isWechat) {
                        window.location.href = url;
                    }
                },
                cyou: function () {
                    if (ja.client.isMobile) {
                        window.location.href = url;
                    } else {
                        ja.utils.win.open(490, 470, url);
                    }
                },
                changyou: function () {
                    if (ja.client.isForceMobileLogin) {
                        if (ja.client.isMobile) {
                            ja.utils.win.open(574, 843, url);
                        } else {
                            ja.utils.win.open(320, 550, url);
                        }
                    } else if (ja.client.isMobile) {
                        window.location.href = url;
                    } else {
                        ja.utils.win.open(490, 352, url);
                    }
                },
                warframe: function () {
                    if (ja.client.isMobile) {
                        window.location.href = url;
                    } else {
                        ja.utils.win.open(490, 352, url);
                    }
                },
                dj: function () {
                    djLogin();
                }
            };

            this.ajax({
                url: this.options.host + "/" + platform + "/user/info",
                success: function (data) {
                    if (data.code != 10000) {
                        if (must == 1) {
                            platformLogin[platform]();
                        }
                    } else {
                        if (ja.options.loginBack) {
                            ja.options.loginBack(data);
                        }
                    }
                },
                error: function () {
                    platformLogin[platform]();
                }
            });

        },
        user: {
            getToken: function () {
                return ja.token;
            },
            getWx: function (success) {
                this.get("wechat", success);
            },
            get: function (platform, success) {
                ja.ajax({
                    url: ja.options.host + "/" + platform + "/user/info",
                    error: function () {
                        ja.login(platform);
                    },
                    success: function (data) {
                        if (data.code != 10000) {
                            ja.login(platform);
                            return;
                        }
                        success(data);
                    }
                });
            }
        },
        utils: {
            win: {
                scrolling: 'no',
                //是否显示滚动条 no,yes,auto
                int: function () {
                    $("#winClose").on('mouseenter',
                        function () {
                            $(this).css("background-image", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJwSURBVEhLvZbLSiNBFIb7DVyKiIgb17oQRRAXgor6CIIIeQKXMksfxYUbFbMZRh0Yb6ODMgEddCVmoWkRLzFekukxfay/+lRbqSqTVob+4CyqzuVPV59TaS8JYRhmhM0Ly5MB9tiX4fDPIQq0CpsT9sC1G4JYzmnlMskQCRPCrrnOh0EuanC5+ojAL5wXc5/LUW5qitba2ynreTWGPfgQY4JaXNaNKfZ0dkY7g4OWyHuGWOTovCuKI+AYib+8TF+bmpyF6xlykKuD2iwTITbQIPE7Q4Kr2EdMF0VtaLCcFJxjnzySzzyZaaihHy80WE4Kxq3vemcns7PStzsyYvn+zMxQUCzSRne35UMtBTSUWIb3ZKeZSRCrBoH0lwsF2u7vj32/JyepWi5L3/3hIW319dXkwvTuhRYE53kt29tMMAlub2lvdJRy09MUVqu8G3GxsGDlo6YCWhCMryvXnO0OD1PF9zkiQj5VGPIqonhwQOsdHVY+aiqgVfMIZrCy7YEBCm5uOMqmdHTkFFOmk0gQ9nNoiF4eHznyjed8nr41NztzlOkkFsQ7cwmWz89ps6fHmaNMJ5Gg7MZKhaNs/pVK8thduTCdhk2DOVNjoXg6PaW/V1e8ikBj7Y2NWflW06BVee0cC/x6nYfjY/nOfnR1yRHRucxmrXzXWNQdfNwgGGpwt79Pa21tsQ+XAC4D4K+s0GpLS00uzBp8vm3qXm1bvb1UWFyk752dlu/X+Dj5S0vOTnVebUAsUr+80/17AmIjvT9ghXCk94mhMEUBOg3t7ZpT7MGnd6OioZgCRyAsnc9EhUhI70PYRBT4T5/6nvcKYG1hElXAZggAAAAASUVORK5CYII=)");
                        });
                    $("#winClose").on('mouseleave',
                        function () {
                            $(this).css("background-image", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJeSURBVEhLvZbPq2lRFMf9B4bSTTIxZiBSMlCI9ycoKX+Bod7w/il3YIL4NyhFmYmBKD2Sp0ix3vqes/e529n74t33Op9astevr3PO2tvxvcLtdquzfbAtyAV8IlYX6d+DG7yxvbP9Fr2fglxR8ybavAYX/GD7Jfr8NahFD9HuMZz4U9Q5jEYjqlarFA6HiVPuDD7EkOMGvTjna9xi8/mcstmsJvKVIRc1Kl+K4haIHItut0t+v9/Y+JGhBrUq6M2xT9iBAXGeGQrY/U+miqI3NNhvw4t3EbNuyXeuzG3ood5eaLDfhhfO6JueWbPZtGKFQkGLNRoN2u/3FI/HtRh6SaDBPkusLnzWpMlkaRC7XC5WfLVaUTqddmKVSoVOp5MVG4/HlEql7mph6vRCC4IfYm2Nt7vAzW63o2KxSLVaja7Xq/DatFotrR49JdCCoHNcmfZZPp+n9XotMmxwVVwnVjbD4ZAikYhWj54SaN1dgjtZWiaToe12K7J0JpOJUUyaykuCsFwuR8fjUWR+slgsKBAIGGukqbwsiGdmElwul5RIJIw10lReEsQ0ns9nkaVzOBys226qhak8HRrsM7ktJLPZjDabjVjZYLBKpZJWrw0NfzzcFvj1KtPp1HpmsVjM2iIq/X5fqzdti4cbHycINjUYDAYUCoWcGA4BHAag1+tRMBi8q4VpGx/wl4dHWzKZpHa7TdFoVIuVy2XqdDrGSTUebYAXnh/e3v49AXZ49wcs4YB3rxgStyjApGG8TfsUPsTUaZQ8FZPgFrB585oo4QLvXoTdcIP/9Krv8/0BDUSOirKWU6wAAAAASUVORK5CYII=)");
                        });
                    $("#winClose").on('click',
                        function () {
                            $("#mask,#maskTop").fadeOut(function () {
                                $(this).remove();
                            });
                        });
                },
                open: function (width, height, src) {
                    var iframeHeight = height;
                    var marginLeft = width / 2;
                    var marginTop = height / 2;
                    var inntHtml = '';
                    inntHtml += '<div id="mask" style="width:100%; height:100%; position:fixed; top:0; left:0; z-inde:1999;background:#cccccc; filter:alpha(opacity=50); -moz-opacity:0.5; -khtml-opacity: 0.5; opacity:0.5;"></div>'
                    inntHtml += '<div id="maskTop" style="width: ' + width + 'px; height: ' + height + 'px; border: #999999 1px solid; background: #fff; color: #333; position: fixed; top: 50%; left: 50%; margin-left: -' + marginLeft + 'px; margin-top: -' + marginTop + 'px; z-index: 2999; filter: progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4); -moz-box-shadow: 2px 2px 10px #909090; -webkit-box-shadow: 2px 2px 10px #909090; box-shadow: 2px 2px 10px #909090;">'
                    inntHtml += '<div id="maskTitle" style="height: 0px;position: relative;">'
                    inntHtml += '<div id="winClose" style="width: 28px; height: 28px; cursor: pointer; position: absolute; top: -12px; right: -9px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJeSURBVEhLvZbPq2lRFMf9B4bSTTIxZiBSMlCI9ycoKX+Bod7w/il3YIL4NyhFmYmBKD2Sp0ix3vqes/e529n74t33Op9astevr3PO2tvxvcLtdquzfbAtyAV8IlYX6d+DG7yxvbP9Fr2fglxR8ybavAYX/GD7Jfr8NahFD9HuMZz4U9Q5jEYjqlarFA6HiVPuDD7EkOMGvTjna9xi8/mcstmsJvKVIRc1Kl+K4haIHItut0t+v9/Y+JGhBrUq6M2xT9iBAXGeGQrY/U+miqI3NNhvw4t3EbNuyXeuzG3ood5eaLDfhhfO6JueWbPZtGKFQkGLNRoN2u/3FI/HtRh6SaDBPkusLnzWpMlkaRC7XC5WfLVaUTqddmKVSoVOp5MVG4/HlEql7mph6vRCC4IfYm2Nt7vAzW63o2KxSLVaja7Xq/DatFotrR49JdCCoHNcmfZZPp+n9XotMmxwVVwnVjbD4ZAikYhWj54SaN1dgjtZWiaToe12K7J0JpOJUUyaykuCsFwuR8fjUWR+slgsKBAIGGukqbwsiGdmElwul5RIJIw10lReEsQ0ns9nkaVzOBys226qhak8HRrsM7ktJLPZjDabjVjZYLBKpZJWrw0NfzzcFvj1KtPp1HpmsVjM2iIq/X5fqzdti4cbHycINjUYDAYUCoWcGA4BHAag1+tRMBi8q4VpGx/wl4dHWzKZpHa7TdFoVIuVy2XqdDrGSTUebYAXnh/e3v49AXZ49wcs4YB3rxgStyjApGG8TfsUPsTUaZQ8FZPgFrB585oo4QLvXoTdcIP/9Krv8/0BDUSOirKWU6wAAAAASUVORK5CYII=);"></div>'
                    inntHtml += '</div>'
                    inntHtml += '<iframe width="' + width + '" height="' + iframeHeight + '" frameborder="0" scrolling="' + this.scrolling + '" src="' + src + '"></iframe>';
                    inntHtml += '</div>'
                    $("body").append(inntHtml);
                    this.int();
                },
                close: function () {
                    $("#winClose").click();
                }
            }
        }
    };
    window.ja = new JoinActivity();
}());
