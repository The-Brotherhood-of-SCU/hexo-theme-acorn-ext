document.onscroll = function() {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var headerShadow = document.getElementById("header");
  if (scrollTop > 10)
  // headerShadow.classList.add("header-fixed"); //增加
  // headerShadow.classList.remove("header-fixed"); //去除
  headerShadow.classList.replace("header-absolute","header-fixed"); //替换
  else
  headerShadow.classList.replace("header-fixed","header-absolute"); //替换
}

feather.replace()

//
// 滚动进入动画（scroll reveal）
// 使用 IntersectionObserver + Web Animations API，
// 卡片/标题/引言进入视口时淑淡上浮，同一行内错落出现。
// 尊重 prefers-reduced-motion；不支持时直接显示（渐进增强）。
//
;(function () {
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SELECTOR = '.card, .culture-card, .member-card, .section-heading, .blockquote';
  var targets = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
  if (!targets.length) return;

  // 环境不支持或用户偏好减少动效：保持可见，不做动画
  if (REDUCE || !Element.prototype.animate) return;

  // 初始隐藏（仅 opacity，不影响布局）
  targets.forEach(function (el) { el.classList.add('reveal'); });

  // 同一栅格行内按序错落延迟
  function staggerDelay(el) {
    var col = el.closest('[class*="col-"]') || el;
    var row = col.parentElement;
    if (!row || !row.classList || !(row.classList.contains('row') || row.classList.contains('members-grid'))) return 0;
    var items = Array.prototype.filter.call(row.children, function (c) {
      return c === col || (c.matches && c.matches('[class*="col-"], .member-card'));
    });
    var idx = items.indexOf(col);
    return idx > -1 ? (idx % 4) * 90 : 0;
  }

  // 显示单个元素：移除隐藏态并播放上浮动画
  function revealEl(el) {
    if (!el.classList.contains('reveal')) return;
    el.classList.remove('reveal');
    el.classList.add('is-revealed');
    var delay = staggerDelay(el);
    var anim = el.animate(
      [
        { opacity: 0, transform: 'translateY(26px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      {
        duration: 700,
        delay: delay,
        easing: 'cubic-bezier(.21,.6,.35,1)',
        fill: 'backwards'
      }
    );
    // 安全网：动画结束后元素本应回到自然可见态；
    // 若极端环境下动画时间轴未推进，超时后取消动画以保证内容必然可见。
    setTimeout(function () {
      if (anim && anim.playState !== 'finished') {
        try { anim.cancel(); } catch (e) {}
      }
    }, delay + 700 + 250);
  }

  // 主方案：IntersectionObserver（高效，现代浏览器）
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealEl(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // 兜底：滚动/缩放时检查视口内仍隐藏的元素，
  // 保证在 IntersectionObserver 被节流/不可用时内容不会被永久隐藏。
  function revealInView() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    Array.prototype.slice.call(document.querySelectorAll('.reveal')).forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.96 && rect.bottom > 0) revealEl(el);
    });
  }
  var scrollTimer = null;
  function onScroll() {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () { scrollTimer = null; revealInView(); }, 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // 页面就绪后先检查一次首屏
  if (document.readyState === 'complete') revealInView();
  else window.addEventListener('load', revealInView);
})();

//
// Dark mode 切换
// data-theme 初始值由 head.ejs 内联脚本设定（防闪烁）；
// 图标（日/月）显隐由 CSS 根据 html[data-theme] 控制。
// 这里负责：点击切换 + localStorage 记忆 + 无手动选择时跟随系统变化。
//
;(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function stored() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function persist(value) {
    try { localStorage.setItem('theme', value); } catch (e) {}
  }
  function apply(value) {
    root.setAttribute('data-theme', value);
  }

  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      persist(next);
    });
  }

  // 无手动选择时，实时跟随系统深色偏好变化
  if (media && !stored()) {
    var onChange = function (e) { apply(e.matches ? 'dark' : 'light'); };
    if (media.addEventListener) media.addEventListener('change', onChange);
    else if (media.addListener) media.addListener(onChange);
  }
})();
