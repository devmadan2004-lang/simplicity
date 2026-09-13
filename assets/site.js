/* Simplicity — feature guide. Shared script for every page.
   Pages tag <body data-page="home|role|help|404" [data-role="employee"]>.
   All content comes from catalog.json (fetched at runtime, never cached). */
(function () {
  'use strict';

  /* ---------- site root (works at / and at /simplicity/) ---------- */
  var ROOT = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/assets\/site\.js.*$/, '') : './';
  })();

  var LINKS = {
    android: 'https://github.com/devmadan2004-lang/simplicity-download/releases/latest/download/simplicity.apk',
    ios: 'https://testflight.apple.com/join/XgGwYsH2',
    testflight: 'https://apps.apple.com/app/testflight/id899247664',
    download_page: 'https://devmadan2004-lang.github.io/simplicity-download/',
    help: 'https://devmadan2004-lang.github.io/simplicity/help/',
    privacy: 'https://devmadan2004-lang.github.io/simplicity-download/privacy.html'
  };
  var SUPPORT_URL = 'https://ejiugojnbdzsshywekmq.supabase.co/functions/v1/support-ticket';

  var UA = navigator.userAgent || '';
  var isAndroid = /Android/i.test(UA);
  var isIOS = /iPhone|iPad|iPod/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  /* ---------- APK resolver (copied from the download page) ----------
     Ask GitHub which assets the latest release actually has instead of
     assuming the filename; fall back to the stable URL after 2.5 s. */
  window.__resolveApk = function (cb) {
    var APK = LINKS.android, done = false, fin = function (u) { if (!done) { done = true; cb(u); } };
    setTimeout(function () { fin(APK); }, 2500);
    try {
      fetch('https://api.github.com/repos/devmadan2004-lang/simplicity-download/releases/latest')
        .then(function (r) { return r.json(); })
        .then(function (j) {
          var a = (j && j.assets || []).filter(function (x) { return /\.apk$/i.test(x.name || ''); });
          fin(a.length ? a[0].browser_download_url : APK);
        }).catch(function () { fin(APK); });
    } catch (e) { fin(APK); }
  };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtDur(sec) {
    sec = Math.max(0, Math.round(Number(sec) || 0));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function fmtTotal(sec) {
    sec = Math.round(Number(sec) || 0);
    if (sec < 60) return sec + ' sec';
    var m = Math.round(sec / 60);
    return '~' + m + ' min';
  }
  function safeUrl(u) {
    u = String(u || '').trim();
    return /^https?:\/\//i.test(u) ? u : '';
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function $(id) { return document.getElementById(id); }
  function qsa(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

  /* ---------- icons (24px stroke set, Feather-style) ---------- */
  var ICONS = {
    download: '<path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/>',
    apple: { fill: true, d: '<path d="M17.6 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8M15.3 5.8c.6-.8 1.1-1.9.9-3-1 0-2.1.7-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.6 2.9-1.3"/>' },
    android: { fill: true, d: '<path d="M16.6 5.8l1.1-2a.3.3 0 1 0-.5-.3l-1.1 2a6.9 6.9 0 0 0-5.2 0l-1.1-2a.3.3 0 0 0-.5.3l1.1 2A6.3 6.3 0 0 0 7 11h10a6.3 6.3 0 0 0-3.4-5.2M9.5 9a.8.8 0 1 1 .8-.8.8.8 0 0 1-.8.8m5 0a.8.8 0 1 1 .8-.8.8.8 0 0 1-.8.8M7 12v6.5A1.5 1.5 0 0 0 8.5 20H9v2.5a1.5 1.5 0 0 0 3 0V20h1v2.5a1.5 1.5 0 0 0 3 0V20h.5a1.5 1.5 0 0 0 1.5-1.5V12H7M4.5 12A1.5 1.5 0 0 0 3 13.5v4a1.5 1.5 0 0 0 3 0v-4A1.5 1.5 0 0 0 4.5 12m15 0A1.5 1.5 0 0 0 18 13.5v4a1.5 1.5 0 0 0 3 0v-4A1.5 1.5 0 0 0 19.5 12"/>' },
    'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/>',
    key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
    'map-pin': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M21 21v-4M17 21h4M14 21h.01"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    /* UI-only */
    play: { fill: true, d: '<path d="M6 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5z"/>' },
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'chevron-right': '<path d="M9 6l6 6-6 6"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    film: '<rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
    refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    'help-circle': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'
  };
  var TONE = { 'map-pin': 'cyan', globe: 'cyan', truck: 'cyan', camera: 'violet', image: 'violet', 'file-text': 'violet', qr: 'green', check: 'green', calendar: 'green', clock: 'green', trophy: 'amber', star: 'amber', receipt: 'amber', message: 'rose', bell: 'rose', help: 'rose', apple: 'slate' };
  function icon(name) {
    var d = ICONS[name] || ICONS.star;
    if (d && d.fill) return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + d.d + '</svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  function tile(name, extra) {
    return '<div class="tile ' + (TONE[name] || '') + (extra ? ' ' + extra : '') + '">' + icon(name) + '</div>';
  }
  window.SimplicityIcons = { icon: icon, tile: tile };

  /* ---------- download buttons (order follows the device) ---------- */
  function downloadHTML(variant) {
    var a = '<div class="dl-item" data-plat="android"><a class="btn" href="' + esc(LINKS.android) + '" data-apk>' + icon('android') + '<span>Download for Android</span></a></div>';
    var i = '<div class="dl-item" data-plat="ios"><a class="btn" href="' + esc(LINKS.ios) + '" data-ios>' + icon('apple') + '<span>Install on iPhone</span></a>' +
      '<div class="dl-note">Pehle TestFlight install karo (App Store, free), phir ye tap karo. <a href="' + esc(LINKS.testflight) + '" target="_blank" rel="noopener">Get TestFlight &#8599;</a></div></div>';
    var order = (!isAndroid && isIOS) ? [i, a] : [a, i];
    return '<div class="dl' + (variant ? ' ' + variant : '') + '">' + order.join('') + '</div>';
  }
  function mountDownloads(el) {
    if (!el) return;
    el.innerHTML = downloadHTML(el.getAttribute('data-dl') || '');
    var btns = qsa('.btn', el);
    btns.forEach(function (b, n) { b.classList.add(n === 0 ? 'btn-primary' : 'btn-ghost'); });
    qsa('a[data-apk]', el).forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.preventDefault();
        b.classList.add('busy');
        window.__resolveApk(function (u) { b.classList.remove('busy'); location.href = u; });
      });
    });
  }
  function mountAllDownloads() { qsa('[data-dl]').forEach(mountDownloads); }

  /* ---------- catalog ---------- */
  var catalogPromise = null;
  function loadCatalog(force) {
    if (!catalogPromise || force) {
      catalogPromise = fetch(ROOT + 'catalog.json', { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function (cat) {
        if (cat && cat.links) {
          ['android', 'ios', 'download_page', 'help', 'privacy'].forEach(function (k) {
            var v = safeUrl(cat.links[k]); if (v) LINKS[k] = v;
          });
          mountAllDownloads();
        }
        return cat;
      });
    }
    return catalogPromise;
  }
  function roleFeatures(role) {
    var list = [];
    (role && role.sections || []).forEach(function (s) {
      (s.features || []).forEach(function (f) { list.push(f); });
    });
    return list;
  }
  function withVideo(f) { return !!safeUrl(f && f.video); }

  /* ---------- video modal ---------- */
  var M = { el: null, list: [], idx: -1, open: false, lastFocus: null, pushed: false };

  function ensureModal() {
    if (M.el) return M.el;
    var ov = document.createElement('div');
    ov.className = 'ov'; ov.id = 'player'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Video');
    ov.innerHTML =
      '<div class="sheet">' +
        '<div class="sheet-top"><div class="sheet-t"><div class="sheet-hi" id="mHi"></div><div class="sheet-en" id="mEn"></div></div><button class="xb" type="button" data-close aria-label="Close">&#10005;</button></div>' +
        '<div class="sheet-body">' +
          '<div class="player-col"><div class="phone" id="mPhone"></div></div>' +
          '<div class="info-col">' +
            '<div class="info-head"><div class="eyebrow" id="mSec"></div><div class="info-hi" id="mHi2"></div><div class="info-en" id="mEn2"></div></div>' +
            '<p class="sheet-desc" id="mDesc"></p>' +
            '<div class="strip"><div class="strip-l">Download the app</div><div data-dl="sm"></div></div>' +
            '<button class="next" type="button" id="mNext"></button>' +
            '<div class="next-sub" id="mNextSub"></div>' +
          '</div>' +
        '</div>' +
        '<button class="xb desk" type="button" data-close aria-label="Close">&#10005;</button>' +
      '</div>';
    document.body.appendChild(ov);
    mountDownloads(ov.querySelector('[data-dl]'));
    qsa('[data-close]', ov).forEach(function (b) { b.addEventListener('click', function () { closeModal(); }); });
    ov.addEventListener('click', function (ev) { if (ev.target === ov) closeModal(); });
    $('mNext').addEventListener('click', function () {
      var n = nextPlayable(M.idx);
      if (n < 0) closeModal(); else openItem(n, { replace: true });
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && M.open) closeModal(); });
    M.el = ov;
    return ov;
  }
  function nextPlayable(from) {
    for (var i = from + 1; i < M.list.length; i++) if (withVideo(M.list[i])) return i;
    return -1;
  }
  function indexOfSlug(slug) {
    if (!slug) return -1;
    for (var i = 0; i < M.list.length; i++) if (M.list[i].slug === slug) return i;
    return -1;
  }
  function stopVideo() {
    var ph = $('mPhone'); if (!ph) return;
    var v = ph.querySelector('video');
    if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) { /* ignore */ } }
    ph.innerHTML = ''; ph.className = 'phone'; ph.style.aspectRatio = '';
  }
  function mountVideo(it) {
    var ph = $('mPhone');
    stopVideo();
    var v = document.createElement('video');
    v.controls = true; v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', ''); v.preload = 'metadata';
    v.autoplay = true;
    var poster = safeUrl(it.poster); if (poster) v.poster = poster;
    v.src = safeUrl(it.video);
    v.addEventListener('loadedmetadata', function () {
      if (v.videoWidth && v.videoHeight) {
        ph.classList.toggle('wide', v.videoWidth > v.videoHeight);
        ph.style.aspectRatio = v.videoWidth + ' / ' + v.videoHeight;
      }
    });
    v.addEventListener('error', function () {
      if (ph.querySelector('.verr')) return;
      var e = document.createElement('div'); e.className = 'verr';
      e.innerHTML = '<div>Video load nahi hua &mdash; network check karke dobara try karo.</div><button type="button">' + 'Retry</button>';
      e.querySelector('button').addEventListener('click', function () { mountVideo(it); });
      ph.appendChild(e);
    });
    ph.appendChild(v);
    var p = v.play(); if (p && p.catch) p.catch(function () { /* autoplay blocked: user taps play */ });
  }
  function fillModal(it) {
    var hi = it.title_hi || it.title_en || '', en = it.title_en || '';
    $('mHi').textContent = hi; $('mEn').textContent = en;
    $('mHi2').textContent = hi; $('mEn2').textContent = en;
    $('mSec').textContent = it._section ? ((it._section.title_hi || '') + (it._section.title_en ? ' · ' + it._section.title_en : '')) : (it._eyebrow || '');
    $('mDesc').textContent = it.desc || '';
    $('mDesc').style.display = it.desc ? '' : 'none';
    var n = nextPlayable(M.idx), nb = $('mNext'), ns = $('mNextSub');
    if (n >= 0) {
      nb.className = 'next';
      nb.innerHTML = '<span>Next feature</span>' + icon('arrow-right');
      ns.textContent = (M.list[n].title_hi || '') + (M.list[n].title_en ? ' · ' + M.list[n].title_en : '');
    } else {
      nb.className = 'next done';
      nb.innerHTML = icon('check') + '<span>Done</span>';
      ns.textContent = '';
    }
    mountVideo(it);
  }
  function openItem(idx, opts) {
    opts = opts || {};
    var it = M.list[idx];
    if (!it || !withVideo(it)) return;
    ensureModal();
    var wasOpen = M.open;
    M.idx = idx; M.open = true;
    fillModal(it);
    if (!wasOpen) {
      M.lastFocus = document.activeElement;
      M.el.classList.add('on');
      document.documentElement.classList.add('lock');
      M.el.querySelector('.sheet').scrollTop = 0;
      var xb = M.el.querySelector('.xb'); if (xb) try { xb.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    }
    var hash = '#' + it.slug;
    if (opts.viaHash) { M.pushed = false; /* URL already carries it (deep link / back-forward) */ }
    else if (opts.replace || wasOpen) history.replaceState({ simp: it.slug }, '', hash);
    else { history.pushState({ simp: it.slug }, '', hash); M.pushed = true; }
  }
  function closeModal(opts) {
    opts = opts || {};
    if (!M.open) return;
    M.open = false; M.idx = -1;
    stopVideo();
    M.el.classList.remove('on');
    document.documentElement.classList.remove('lock');
    if (M.lastFocus && M.lastFocus.focus) { try { M.lastFocus.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    if (!opts.fromPop) {
      if (M.pushed) history.back();
      else if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    }
    M.pushed = false;
  }
  window.addEventListener('popstate', function () {
    var idx = indexOfSlug(location.hash.replace(/^#/, ''));
    if (idx >= 0 && withVideo(M.list[idx])) openItem(idx, { viaHash: true });
    else closeModal({ fromPop: true });
  });
  function openDeepLink() {
    var idx = indexOfSlug(decodeURIComponent(location.hash.replace(/^#/, '')));
    if (idx >= 0 && withVideo(M.list[idx])) openItem(idx, { viaHash: true });
  }

  /* ---------- feature cards ---------- */
  function featureCard(f, n, idx) {
    var has = withVideo(f);
    var foot = has
      ? '<span class="chip">' + icon('clock') + fmtDur(f.duration) + '</span><span class="play">' + icon('play') + '<span>देखें</span></span>'
      : '<span class="chip soon">' + icon('clock') + 'जल्द आ रहा है</span>';
    return '<article class="feat ' + (has ? 'has-video' : 'soon-card') + '" data-idx="' + idx + '" id="f-' + esc(f.slug) + '"' +
      (has ? ' role="button" tabindex="0" aria-label="' + esc((f.title_hi || '') + ' — ' + (f.title_en || '')) + '"' : '') + '>' +
      '<div class="num">' + pad2(n) + '</div>' +
      '<div class="feat-top">' + tile(f.icon) + '<div class="feat-t"><div class="feat-hi">' + esc(f.title_hi || f.title_en) + '</div><div class="feat-en">' + esc(f.title_en) + '</div></div></div>' +
      (f.desc ? '<p class="feat-desc">' + esc(f.desc) + '</p>' : '') +
      '<div class="feat-foot">' + foot + '</div>' +
    '</article>';
  }
  function bindCards(container) {
    qsa('.feat.has-video', container).forEach(function (card) {
      var idx = Number(card.getAttribute('data-idx'));
      card.addEventListener('click', function () { openItem(idx); });
      card.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openItem(idx); }
      });
    });
  }

  /* ---------- role page ---------- */
  function initRole() {
    var roleId = document.body.getAttribute('data-role');
    var host = $('sections'), heroEl = $('rhero');
    function fail(msg) {
      host.innerHTML = '<div class="errbox"><span>' + esc(msg) + '</span><button type="button">' + 'Retry</button></div>';
      host.querySelector('button').addEventListener('click', function () { host.innerHTML = skeleton(4); run(true); });
    }
    function run(force) {
      loadCatalog(force).then(function (cat) {
        var role = (cat.roles || []).filter(function (r) { return r.id === roleId; })[0];
        if (!role) { fail('Ye page catalog mein nahi mila.'); return; }
        var list = [], n = 0;
        (role.sections || []).forEach(function (s) {
          (s.features || []).forEach(function (f) { f._section = s; list.push(f); });
        });
        M.list = list;
        /* hero */
        var vids = list.filter(withVideo), total = vids.reduce(function (a, f) { return a + (Number(f.duration) || 0); }, 0);
        if (heroEl) {
          heroEl.querySelector('h1').textContent = role.title_hi || role.title_en || '';
          heroEl.querySelector('.ren').textContent = role.title_en || '';
          heroEl.querySelector('.sub').textContent = role.tagline || '';
          var st = heroEl.querySelector('.rstats');
          if (st) st.innerHTML =
            '<span class="stat">' + icon('list') + list.length + ' feature' + (list.length === 1 ? '' : 's') + '</span>' +
            '<span class="stat">' + icon('film') + vids.length + ' video' + (vids.length === 1 ? '' : 's') + '</span>' +
            (total ? '<span class="stat">' + icon('clock') + fmtTotal(total) + ' total</span>' : '');
        }
        document.title = (role.title_en || 'Guide') + ' — Simplicity';
        /* sections */
        var html = '';
        (role.sections || []).forEach(function (s) {
          if (!(s.features || []).length) return;
          html += '<div class="sectlabel"><span class="hi">' + esc(s.title_hi || '') + '</span>' + (s.title_en ? '<span class="en">' + esc(s.title_en) + '</span>' : '') + '</div>';
          html += '<div class="grid">' + s.features.map(function (f) { n++; return featureCard(f, n, list.indexOf(f)); }).join('') + '</div>';
        });
        if (!html) html = '<div class="card" style="padding:26px;text-align:center;color:#9fb0d6;font-size:14px">इस role के videos जल्द आ रहे हैं — abhi ke liye app download karke explore karo.</div>';
        host.innerHTML = html;
        bindCards(host);
        openDeepLink();
      }).catch(function (e) {
        fail('Feature list load nahi hui (' + (e && e.message ? e.message : 'network') + '). Internet check karke retry karo.');
      });
    }
    host.innerHTML = skeleton(4);
    run(false);
  }
  function skeleton(n) {
    var s = '<div class="grid">';
    for (var i = 0; i < n; i++) s += '<div class="skel"></div>';
    return s + '</div>';
  }

  /* ---------- landing ---------- */
  function initHome() {
    var rolesEl = $('roles'), walkEl = $('walk');
    var ROLE_ICON = { employee: 'briefcase', admin: 'shield', hr: 'users' };
    function fail(msg) {
      rolesEl.innerHTML = '<div class="errbox"><span>' + esc(msg) + '</span><button type="button">Retry</button></div>';
      rolesEl.querySelector('button').addEventListener('click', function () { rolesEl.innerHTML = skeleton(3); run(true); });
    }
    function run(force) {
      loadCatalog(force).then(function (cat) {
        rolesEl.innerHTML = (cat.roles || []).map(function (r) {
          var feats = roleFeatures(r), vids = feats.filter(withVideo).length;
          return '<a class="card role" href="' + esc(ROOT + r.id + '/') + '">' + tile(ROLE_ICON[r.id] || 'star') +
            '<div class="role-t"><div class="role-hi">' + esc(r.title_hi || r.title_en) + '</div><div class="role-en">' + esc(r.title_en) + '</div>' +
            '<div class="role-tag">' + esc(r.tagline || '') + '</div>' +
            '<span class="role-n">' + icon('film') + feats.length + ' feature' + (feats.length === 1 ? '' : 's') + (vids ? ' · ' + vids + ' video' + (vids === 1 ? '' : 's') : '') + '</span></div>' +
            '<span class="role-arrow">' + icon('chevron-right') + '</span></a>';
        }).join('');
        /* complete walkthrough */
        var c = cat.compilation || {};
        var item = { slug: 'walkthrough', title_hi: c.title_hi || 'पूरा परिचय', title_en: c.title_en || 'Complete walkthrough', video: c.video, poster: c.poster, duration: c.duration, desc: '', _eyebrow: 'Sabhi features · ek video' };
        M.list = [item];
        walkEl.querySelector('h2').textContent = item.title_hi;
        var meta = walkEl.querySelector('.walk-meta');
        if (withVideo(item)) {
          meta.innerHTML = (item.duration ? '<span class="chip">' + icon('clock') + fmtDur(item.duration) + '</span>' : '') +
            '<button class="playbig" type="button">' + icon('play') + '<span>पूरा video देखें</span></button>';
          meta.querySelector('.playbig').addEventListener('click', function () { openItem(0); });
        } else {
          meta.innerHTML = '<span class="chip soon">' + icon('clock') + 'जल्द आ रहा है</span>';
        }
        openDeepLink();
      }).catch(function (e) {
        fail('Catalog load nahi hua (' + (e && e.message ? e.message : 'network') + '). Internet check karke retry karo.');
      });
    }
    rolesEl.innerHTML = skeleton(3);
    run(false);
  }

  /* ---------- help / report a problem ---------- */
  function initHelp() {
    var form = $('hf'); if (!form) return;
    var q = new URLSearchParams(location.search);
    var name = $('fName'), phone = $('fPhone'), code = $('fCode'), area = $('fArea'), desc = $('fDesc'), fileIn = $('fFiles');
    var drop = $('drop'), thumbs = $('thumbs'), fileNote = $('fileNote'), errEl = $('formErr'), btn = $('fSubmit');
    var MAX = 4, MAX_RAW = 5 * 1024 * 1024, shots = [];
    var platform = '';

    /* prefill from the app deep-link */
    if (q.get('name')) name.value = q.get('name');
    if (q.get('phone')) phone.value = q.get('phone');
    if (q.get('code')) code.value = String(q.get('code')).toUpperCase();
    code.addEventListener('input', function () {
      var p = code.selectionStart; code.value = code.value.toUpperCase();
      try { code.setSelectionRange(p, p); } catch (e) { /* ignore */ }
    });
    var qp = String(q.get('platform') || '').toLowerCase();
    if (/android/.test(qp)) platform = 'Android';
    else if (/ios|iphone|ipad|apple/.test(qp)) platform = 'iPhone';
    else if (qp) platform = 'Other';
    else platform = isAndroid ? 'Android' : (isIOS ? 'iPhone' : 'Other');
    var chips = qsa('.chipbtn', form);
    function paintChips() { chips.forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-v') === platform); c.setAttribute('aria-pressed', c.getAttribute('data-v') === platform ? 'true' : 'false'); }); }
    chips.forEach(function (c) { c.addEventListener('click', function () { platform = c.getAttribute('data-v'); paintChips(); }); });
    paintChips();

    /* screenshots */
    function fmtSize(b) { return b > 1024 * 1024 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
    function setNote(msg, warn) { fileNote.textContent = msg || ''; fileNote.className = 'note' + (warn ? ' warn' : ''); }
    function renderThumbs() {
      thumbs.innerHTML = shots.map(function (s, i) {
        return '<div class="thumb">' + (s.url ? '<img src="' + s.url + '" alt="">' : '<div class="file">' + icon('image') + '</div>') +
          '<button type="button" class="rm" data-i="' + i + '" aria-label="Remove">&#10005;</button><div class="sz">' + fmtSize(s.blob.size) + '</div></div>';
      }).join('');
      qsa('.rm', thumbs).forEach(function (b) {
        b.addEventListener('click', function () {
          var s = shots.splice(Number(b.getAttribute('data-i')), 1)[0];
          if (s && s.url) URL.revokeObjectURL(s.url);
          renderThumbs();
          if (!shots.length) setNote('');
        });
      });
      drop.style.display = shots.length >= MAX ? 'none' : '';
    }
    function decode(file) {
      /* returns Promise<{w,h,draw(ctx,w,h)}> or rejects when the browser can't decode (e.g. HEIC on Android) */
      return new Promise(function (resolve, reject) {
        var tryImg = function () {
          var url = URL.createObjectURL(file), img = new Image();
          img.onload = function () { resolve({ w: img.naturalWidth, h: img.naturalHeight, src: img, done: function () { URL.revokeObjectURL(url); } }); };
          img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('decode')); };
          img.src = url;
        };
        if (window.createImageBitmap) {
          var p; try { p = createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { p = null; }
          if (p && p.then) { p.then(function (bm) { resolve({ w: bm.width, h: bm.height, src: bm, done: function () { if (bm.close) bm.close(); } }); }).catch(tryImg); return; }
        }
        tryImg();
      });
    }
    function shrink(file) {
      return decode(file).then(function (im) {
        var maxSide = 1600, w = im.w, h = im.h, scale = Math.min(1, maxSide / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
        var c = document.createElement('canvas'); c.width = cw; c.height = ch;
        var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cw, ch); ctx.drawImage(im.src, 0, 0, cw, ch);
        im.done();
        return new Promise(function (resolve, reject) {
          c.toBlob(function (b) { b ? resolve(b) : reject(new Error('encode')); }, 'image/jpeg', 0.82);
        }).then(function (blob) {
          return { name: file.name.replace(/\.[^.]+$/, '') + '.jpg', type: 'image/jpeg', blob: blob, url: URL.createObjectURL(blob) };
        });
      });
    }
    function addFiles(files) {
      files = Array.prototype.slice.call(files || []);
      if (!files.length) return;
      var room = MAX - shots.length, skipped = [], notes = [];
      if (files.length > room) { notes.push('Sirf ' + MAX + ' screenshots ja sakte hain — pehli ' + room + ' li gayi.'); files = files.slice(0, room); }
      setNote('Screenshots ready ho rahe hain…');
      var chain = Promise.resolve();
      files.forEach(function (f) {
        chain = chain.then(function () {
          return shrink(f).catch(function () {
            if (f.size <= MAX_RAW) return { name: f.name, type: f.type || 'application/octet-stream', blob: f, url: '', raw: true };
            skipped.push(f.name); return null;
          }).then(function (s) { if (s) shots.push(s); renderThumbs(); });
        });
      });
      chain.then(function () {
        if (skipped.length) notes.push(skipped.join(', ') + ' skip ho gayi (5 MB se badi aur open nahi hui — JPG/PNG bhejo).');
        var raw = shots.filter(function (s) { return s.raw; }).length;
        if (raw && !skipped.length) notes.push('Ek file preview nahi ho payi (HEIC?) — waise hi bhej denge.');
        setNote(notes.join(' '), notes.length > 0);
      });
    }
    fileIn.addEventListener('change', function () { addFiles(fileIn.files); fileIn.value = ''; });
    drop.addEventListener('click', function (ev) { if (ev.target !== fileIn) fileIn.click(); });
    drop.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fileIn.click(); } });
    ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (ev) { ev.preventDefault(); drop.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function (ev) { ev.preventDefault(); drop.classList.remove('over'); }); });
    drop.addEventListener('drop', function (ev) { if (ev.dataTransfer && ev.dataTransfer.files) addFiles(ev.dataTransfer.files); });

    function toBase64(blob) {
      return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () { resolve(String(r.result).split(',')[1] || ''); };
        r.onerror = function () { reject(new Error('read')); };
        r.readAsDataURL(blob);
      });
    }
    function showErr(msg) { errEl.textContent = msg; errEl.style.display = ''; errEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    function busy(on, label) {
      btn.disabled = on;
      btn.innerHTML = on ? '<span class="spin"></span><span>' + esc(label || 'Bhej rahe hain…') + '</span>' : icon('arrow-right') + '<span>Problem bhejo</span>';
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      errEl.style.display = 'none';
      var nm = name.value.trim(), ds = desc.value.trim();
      if (!nm) { showErr('Apna naam likho.'); name.focus(); return; }
      if (!ds) { showErr('Kya hua — thoda likho, tabhi fix ho payega.'); desc.focus(); return; }
      busy(true, shots.length ? 'Screenshots pack ho rahi hain…' : 'Bhej rahe hain…');
      Promise.all(shots.map(function (s) { return toBase64(s.blob).then(function (b64) { return { name: s.name, type: s.type, data: b64 }; }); }))
        .then(function (screens) {
          busy(true, 'Bhej rahe hain…');
          var body = { name: nm, phone: phone.value.trim(), code: code.value.trim().toUpperCase(), platform: platform, app_area: area.value, description: ds, page: location.href, screenshots: screens };
          var ctrl = window.AbortController ? new AbortController() : null;
          var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 90000) : null;
          return fetch(SUPPORT_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl ? ctrl.signal : undefined })
            .then(function (r) { return r.json().catch(function () { return { error: 'HTTP ' + r.status }; }).then(function (j) { return { status: r.status, json: j }; }); })
            .then(function (res) { if (timer) clearTimeout(timer); return res; }, function (e) { if (timer) clearTimeout(timer); throw e; });
        })
        .then(function (res) {
          var j = res.json || {};
          if (res.status >= 200 && res.status < 300 && j.ok) { success(j); return; }
          showErr((j.error ? String(j.error) : 'Server ne error diya (' + res.status + ')') + ' — dobara try karo.');
          busy(false);
        })
        .catch(function (e) {
          showErr(e && e.name === 'AbortError' ? 'Network slow hai — screenshot kam karke dobara try karo.' : 'Bhej nahi paye — internet check karke dobara try karo.');
          busy(false);
        });
    });

    function success(j) {
      var n = Array.isArray(j.screenshots) ? j.screenshots.length : (typeof j.screenshots === 'number' ? j.screenshots : null);
      var card = document.createElement('div');
      card.className = 'card success';
      card.innerHTML = '<div class="bigcheck">' + icon('check') + '</div>' +
        '<div class="tno">Ticket <b>#' + esc(j.ticket_no != null ? j.ticket_no : j.id) + '</b> mil gaya</div>' +
        '<p>Dev ko notification chali gayi — jaldi fix hoga. Bade issue pe wo khud aapko call karega.' + (n ? '<br><span style="color:#7fe3ff">' + n + ' screenshot' + (n === 1 ? '' : 's') + ' attach ho gayi.</span>' : '') + '</p>' +
        '<a class="again" href="' + esc(location.pathname + location.search) + '">' + icon('refresh') + '<span>Ek aur problem bhejo</span></a>';
      form.parentNode.replaceChild(card, form);
      var h = $('helpHero'); if (h) h.querySelector('.sub').textContent = 'Shukriya! Ticket ban gaya.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    busy(false);
  }

  /* ---------- boot ---------- */
  function boot() {
    mountAllDownloads();
    var page = document.body.getAttribute('data-page');
    if (page === 'home') initHome();
    else if (page === 'role') initRole();
    else if (page === 'help') initHelp();
    /* privacy link in footer honours the catalog when it loads */
    loadCatalog().then(function () {
      qsa('a[data-link]').forEach(function (a) { var v = LINKS[a.getAttribute('data-link')]; if (v) a.href = v; });
    }).catch(function () { /* footer keeps its static links */ });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
