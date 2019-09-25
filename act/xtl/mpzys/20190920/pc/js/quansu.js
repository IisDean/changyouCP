(function ($) {
  jQuery.extend( jQuery.easing,{
    easeOutCubic: function (x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    }
  });
  var quansu = {

    /*simple*/
    tab: function (o1, o2, event, fn) {
      var o1 = $(o1), o2 = $(o2);
      o1.first().addClass('on');
      o2.first().addClass('dis');
      if (typeof fn == 'function') fn(0);
      o1.bind(event || 'mouseover', function (i) {
        var e = o1.index(this);
        o1.removeClass('on');
        o1.eq(e).addClass('on');
        o2.removeClass('dis');
        o2.eq(e).addClass('dis');
        if (typeof fn == 'function') fn(e);
      });
    },
    /*slide*/
    slide: function (setting) {
      var s = {
        item: null,
        nav: null,
        delay: 4000,
        duration: 500,
        event: 'click',
        prev: '',
        next: '',
        callback: null
      };
      $.extend(s, setting);
      if (!$(s.item) || $(s.item).length < 2) return;
      var o = $(s.item), p = o.parent(), t = $(s.nav), len = o.length, timer = null, w = o.width(), curr = 0;
      if (s.delay) timer = setTimeout(next, s.delay);
      o.each(function () {
        var i = o.index(this);
        t.append('<a href="javascript:void(0)"' + (i == 0 ? ' class="on"' : '') + '></a>');
      });
      p.width(w * len);
      t = t.find('a');
      t.bind(s.event, function () {
        var i = t.index(this);
        if (curr != i) {
          curr = i;
          current();
        }
      });
      if ($(s.prev)) $(s.prev).bind('click', prev);
      if ($(s.next)) $(s.next).bind('click', next);
      function current() {
        clearTimeout(timer);
        t.removeClass('on');
        t.eq(curr).addClass('on');
        p.stop(true, true).animate({ marginLeft: -curr * w }, s.duration, 'easeOutCubic', function () {
          if (typeof s.callback == 'function') s.callback(curr);
        });
        if (s.delay) timer = setTimeout(next, s.delay + s.duration);
      }
      function next() {
        if (++curr > len - 1) curr = 0;
        current();
      }
      function prev() {
        if (--curr < 0) curr = len - 1;
        current();
      }
    },

    /*fade*/
    fade: function (setting) {
      var s = {
        item: null,
        nav: null,
        delay: 4000,
        duration: 500,
        event: 'click',
        prev: '',
        next: '',
        callback: null
      };
      $.extend(s, setting);
      if (!$(s.item) || $(s.item).length < 2) return;
      var o = $(s.item), t = $(s.nav), len = o.length, timer = null, z = -1000, curr = 0;
      if (s.delay) timer = setTimeout(next, s.delay);
      o.each(function () {
        var i = o.index(this);
        t.append('<a href="javascript:void(0)"' + (i == 0 ? ' class="on"' : '') + '></a>');
        $(this).css({ zIndex: i == 0 ? z + 1 : z });
      });
      z++;
      t = t.find('a');
      t.bind(s.event, function () {
        var i = t.index(this);
        if (curr != i) {
          curr = i;
          current();
        }
      });
      if ($(s.prev)) $(s.prev).bind('click', prev);
      if ($(s.next)) $(s.next).bind('click', next);
      function current() {
        clearTimeout(timer);
        t.removeClass('on');
        t.eq(curr).addClass('on');
        o.eq(curr).stop().css({ zIndex: ++z, opacity: 0 }).animate({ opacity: 1 }, s.duration, function () {
          if (typeof s.callback == 'function') s.callback(curr);
        });
        if (s.delay) timer = setTimeout(next, s.delay + s.duration);
      }
      function next() {
        if (++curr > len - 1) curr = 0;
        current();
      }
      function prev() {
        if (--curr < 0) curr = len - 1;
        current();
      }
    },

    /*roll*/
    roll: function (setting) {
      var s = {
        item: null,
        num: 3,
        delay: 4000,
        duration: 500,
        enable: true,
        prev: '',
        next: '',
        callback: null
      };
      $.extend(s, setting);
      if (!$(s.item) || $(s.item).length <= s.num) return;
      var o = $(s.item), p = o.parent(), w = o.outerWidth(true), len = o.length, timer = null, curr = 0;
      p.append(o.clone());
      p.width(len * 2 * w);
      if (s.delay) timer = setTimeout(next, s.delay);
      if ($(s.prev)) $(s.prev).bind('click', prev);
      if ($(s.next)) $(s.next).bind('click', next);
      function setto() {
        p.css({ marginLeft: -w * curr });
      }
      function current() {
        clearTimeout(timer);
        p.stop().animate({ marginLeft: -w * curr }, s.duration, function () {
          if (typeof s.callback == 'function') s.callback(curr);
        });
        if (s.delay) timer = setTimeout(next, s.delay + s.duration);
      }
      function next() {
        if (!s.enable && curr == len - s.num) return;
        if (curr == len) {
          curr = 0;
          setto();
        }
        curr++;
        current();
      }
      function prev() {
        if (!s.enable && curr == 0) return;
        if (curr == 0) {
          curr = len;
          setto();
        }
        curr--;
        current();
      }
    },

    /*scroll*/
    scroll: function (setting) {
      var s = {
        item: null,
        num: 3,
        delay: 4000,
        duration: 500,
        enable: true,
        prev: '',
        next: '',
        callback: null
      };
      $.extend(s, setting);
      if (!$(s.item) || $(s.item).length <= s.num) return;
      var o = $(s.item), p = o.parent(), h = o.outerHeight(true), len = o.length, timer = null, curr = 0, max = Math.ceil(len / s.num);
      p.wrap('<div></div>');
      var m = p.parent();
      m.append(p.clone());
      if (s.delay) timer = setTimeout(next, s.delay);
      if ($(s.prev)) $(s.prev).bind('click', prev);
      if ($(s.next)) $(s.next).bind('click', next);
      function setto() {
        m.css({ marginTop: -h * curr });
      }
      function current() {
        clearTimeout(timer);
        m.stop().animate({ marginTop: -h * curr }, s.duration, function () {
          if (typeof s.callback == 'function') s.callback(curr);
        });
        if (s.delay) timer = setTimeout(next, s.delay + s.duration);
      }
      function next() {
        if (!s.enable && curr == max - 1) return;
        if (curr == max) {
          curr = 0;
          setto();
        }
        curr++;
        current();
      }
      function prev() {
        if (!s.enable && curr == 0) return;
        if (curr == 0) {
          curr = max;
          setto();
        }
        curr--;
        current();
      }
    }

  };

  window['quansu'] = quansu;
})(jQuery);