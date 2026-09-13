/* Simplicity — app catalogue. Shared script for every page.
   Pages tag <body data-page="catalogue|help|404" [data-role="employee"]>.
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
    visitor: 'https://devmadan2004-lang.github.io/simplicity-visitor/',
    help: 'https://devmadan2004-lang.github.io/simplicity/help/',
    privacy: 'https://devmadan2004-lang.github.io/simplicity-download/privacy.html',
    catalogue_employee: 'https://devmadan2004-lang.github.io/simplicity/Simplicity-App-Employees.pdf',
    catalogue_admin: 'https://devmadan2004-lang.github.io/simplicity/Simplicity-App-Admins.pdf',
    catalogue_hr: 'https://devmadan2004-lang.github.io/simplicity/Simplicity-App-HR.pdf'
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
    return m + ' min';
  }
  function safeUrl(u) {
    u = String(u || '').trim();
    return /^https?:\/\//i.test(u) ? u : '';
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
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
    external: '<path d="M7 17L17 7M8 7h9v9"/>',
    film: '<rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
    refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'
  };
  var TONE = { 'map-pin': 'cyan', globe: 'cyan', truck: 'cyan', camera: 'violet', image: 'violet', 'file-text': 'violet', qr: 'green', check: 'green', calendar: 'green', clock: 'green', trophy: 'amber', star: 'amber', receipt: 'amber', message: 'rose', bell: 'rose', help: 'rose', apple: 'slate' };
  var ROLE_ICON = { employee: 'briefcase', admin: 'shield', hr: 'users' };
  var ROLE_TONE = { employee: '', admin: 'violet', hr: 'cyan' };
  function icon(name) {
    var d = ICONS[name] || ICONS.star;
    if (d && d.fill) return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + d.d + '</svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  function tile(name, tone) {
    return '<div class="tile ' + (tone != null ? tone : (TONE[name] || '')) + '">' + icon(name) + '</div>';
  }
  window.SimplicityIcons = { icon: icon, tile: tile };

  /* ---------- download buttons (modal strip; order follows the device) ---------- */
  function downloadHTML() {
    var a = '<div class="dl-item" data-plat="android"><a class="btn" href="' + esc(LINKS.android) + '" data-apk>' + icon('android') + '<span>Download for Android</span></a></div>';
    var i = '<div class="dl-item" data-plat="ios"><a class="btn" href="' + esc(LINKS.ios) + '" data-ios>' + icon('apple') + '<span>Install on iPhone</span></a>' +
      '<div class="dl-note">Pehle TestFlight install karo (App Store, free), phir ye tap karo. <a href="' + esc(LINKS.testflight) + '" target="_blank" rel="noopener">Get TestFlight &#8599;</a></div></div>';
    var order = (!isAndroid && isIOS) ? [i, a] : [a, i];
    return '<div class="dl">' + order.join('') + '</div>';
  }
  function bindApk(el) {
    qsa('a[data-apk]', el).forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        window.__resolveApk(function (u) { location.href = u; });
      });
    });
  }
  function mountDownloads(el) {
    if (!el) return;
    el.innerHTML = downloadHTML();
    qsa('.btn', el).forEach(function (b, n) { b.classList.add(n === 0 ? 'btn-primary' : 'btn-ghost'); });
    bindApk(el);
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
          ['android', 'ios', 'download_page', 'visitor', 'help', 'privacy'].forEach(function (k) {
            var v = safeUrl(cat.links[k]); if (v) LINKS[k] = v;
          });
          mountAllDownloads();
        }
        return cat;
      });
    }
    return catalogPromise;
  }
  function withVideo(f) { return !!safeUrl(f && f.video); }
  function walkItem(cat) {
    var c = cat && cat.compilation || {};
    return { slug: 'walkthrough', title_hi: c.title_hi || 'पूरा परिचय — सारे फ़ीचर एक वीडियो में', title_en: c.title_en || 'Complete walkthrough',
      video: safeUrl(c.video), poster: safeUrl(c.poster), duration: Number(c.duration) || 0, desc: 'Sab features ek hi video mein — install se approvals tak.', _eyebrow: 'Complete walkthrough' };
  }

  /* ---------- video modal ---------- */
  var M = { el: null, list: [], idx: -1, open: false, lastFocus: null, pushed: false };

  function ensureModal() {
    if (M.el) return M.el;
    var ov = document.createElement('div');
    ov.className = 'ov'; ov.id = 'player'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Video');
    ov.innerHTML =
      '<div class="sheet">' +
        '<div class="sheet-top"><div class="sheet-t"><div class="sheet-title" id="mTitle"></div><div class="sheet-sub" id="mSub"></div></div><button class="xb" type="button" data-close aria-label="Close">&#10005;</button></div>' +
        '<div class="sheet-body">' +
          '<div class="player-col"><div class="phone" id="mPhone"></div></div>' +
          '<div class="info-col">' +
            '<div class="info-head"><div class="eyebrow" id="mSec"></div><div class="info-title" id="mTitle2"></div><div class="info-sub" id="mSub2"></div></div>' +
            '<p class="sheet-desc" id="mDesc"></p>' +
            '<div class="mrow"><span class="chip" id="mDur"></span><a class="act link" id="mLink" target="_blank" rel="noopener">' + icon('external') + '<span>Video link</span></a></div>' +
            '<div class="strip"><div class="strip-l">Download the app</div><div data-dl></div></div>' +
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
      e.innerHTML = '<div>Video load nahi hua &mdash; network check karke dobara try karo.</div><button type="button">Retry</button>';
      e.querySelector('button').addEventListener('click', function () { mountVideo(it); });
      ph.appendChild(e);
    });
    ph.appendChild(v);
    var p = v.play(); if (p && p.catch) p.catch(function () { /* autoplay blocked: user taps play */ });
  }
  function fillModal(it) {
    var en = it.title_en || it.title_hi || '', hi = it.title_hi || '';
    $('mTitle').textContent = en; $('mSub').textContent = hi;
    $('mTitle2').textContent = en; $('mSub2').textContent = hi;
    var sec = it._section ? ((it._role ? it._role.title_en + ' · ' : '') + (it._section.title_en || '')) : (it._eyebrow || '');
    $('mSec').textContent = sec;
    $('mDesc').textContent = it.desc || '';
    $('mDesc').style.display = it.desc ? '' : 'none';
    var d = Number(it.duration) || 0;
    $('mDur').innerHTML = icon('clock') + fmtDur(d); $('mDur').style.display = d ? '' : 'none';
    $('mLink').href = safeUrl(it.video);
    var n = nextPlayable(M.idx), nb = $('mNext'), ns = $('mNextSub');
    if (n >= 0) {
      nb.className = 'next';
      nb.innerHTML = '<span>Next feature</span>' + icon('arrow-right');
      ns.textContent = (M.list[n].title_en || '') + (M.list[n].title_hi ? ' · ' + M.list[n].title_hi : '');
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
  function openSlug(slug) { var i = indexOfSlug(slug); if (i >= 0) openItem(i); }

  /* ---------- links block ---------- */
  function linkRow(o) {
    var attrs = o.blank ? ' target="_blank" rel="noopener"' : '';
    return '<a class="lrow" href="' + esc(o.href) + '"' + attrs + (o.apk ? ' data-apk' : '') + '>' + tile(o.icon, o.tone) +
      '<span class="lbody"><span class="llabel">' + esc(o.label) + '</span><span class="ldesc">' + esc(o.desc) + '</span></span>' +
      '<span class="lgo">' + icon('external') + '</span></a>';
  }
  function walkRow(walk, loaded) {
    var has = walk && withVideo(walk);
    var desc = has ? ((walk.duration ? fmtTotal(walk.duration) + ' · ' : '') + walk.title_hi) : (loaded ? 'Coming soon · जल्द आ रहा है' : 'Sab features ek video mein');
    var acts = has
      ? '<span class="lacts"><button class="act play" type="button" data-watch="walkthrough">' + icon('play') + '<span>Watch</span></button><a class="act link only" href="' + esc(walk.video) + '" target="_blank" rel="noopener" aria-label="Video link">' + icon('external') + '</a></span>'
      : '<span class="lacts"><span class="chip soon">' + icon('clock') + 'Coming soon</span></span>';
    return '<div class="lrow walk" id="walk">' + tile('film', 'cyan') +
      '<span class="lbody"><span class="llabel">' + esc(walk ? walk.title_en : 'Complete walkthrough') + '</span><span class="ldesc">' + esc(desc) + '</span></span>' + acts + '</div>';
  }
  function catalogueRows() {
    var role = (document.body && document.body.getAttribute('data-role')) || '';
    var meta = { employee: 'Employees', admin: 'Admins', hr: 'HR' };
    var ids = role && meta[role] ? [role] : ['employee', 'admin', 'hr'];
    return ids.map(function (id) {
      return linkRow({ icon: 'file-text', tone: 'blue', label: meta[id] + ' catalogue (PDF)', desc: 'Every feature · tap to watch · share on WhatsApp', href: LINKS['catalogue_' + id], blank: true });
    }).join('');
  }
  function renderLinks(el, cat) {
    if (!el) return;
    var walk = walkItem(cat);
    el.innerHTML = '<div class="sectlabel"><span class="en">Links</span><span class="hi">डाउनलोड · वीडियो · मदद</span></div><div class="lgrid">' +
      walkRow(walk, !!cat) +
      catalogueRows() +
      linkRow({ icon: 'android', tone: 'green', label: 'Download for Android', desc: 'APK · seedha download', href: LINKS.android, apk: true }) +
      linkRow({ icon: 'apple', tone: 'slate', label: 'Install on iPhone', desc: 'TestFlight · pehle TestFlight install karo', href: LINKS.ios }) +
      linkRow({ icon: 'globe', tone: 'cyan', label: 'Visitor check-in site', desc: 'Visitors ke liye alag website', href: LINKS.visitor, blank: true }) +
      linkRow({ icon: 'message', tone: 'rose', label: 'Report a problem', desc: 'Screenshot bhejo — fix hoke aayega', href: LINKS.help }) +
      linkRow({ icon: 'shield', tone: 'blue', label: 'Privacy policy', desc: 'Aapka data kaise use hota hai', href: LINKS.privacy, blank: true }) +
      '</div>';
    bindApk(el);
    var w = el.querySelector('[data-watch]');
    if (w) w.addEventListener('click', function () { openSlug('walkthrough'); });
  }

  /* ---------- feature rows ---------- */
  function media(f) {
    var p = safeUrl(f.poster);
    if (p) return '<img class="fposter" src="' + esc(p) + '" alt="" loading="lazy" decoding="async">';
    return '<div class="ftile ' + (TONE[f.icon] || '') + '">' + icon(f.icon) + '</div>';
  }
  function featureRow(f, n, idx) {
    var has = withVideo(f);
    var foot = has
      ? '<span class="chip">' + icon('clock') + fmtDur(f.duration) + '</span>' +
        '<span class="facts"><button class="act play" type="button">' + icon('play') + '<span>Watch</span></button>' +
        '<a class="act link" href="' + esc(f.video) + '" target="_blank" rel="noopener">' + icon('external') + '<span>Link</span></a></span>'
      : '<span class="chip soon">' + icon('clock') + 'Coming soon <small>· जल्द आ रहा है</small></span>';
    return '<article class="frow ' + (has ? 'has-video' : 'soon-card') + '" data-idx="' + idx + '" id="f-' + esc(f.slug) + '"' +
      (has ? ' role="button" tabindex="0" aria-label="' + esc((f.title_en || '') + ' — ' + (f.title_hi || '')) + '"' : '') + '>' +
      '<div class="fmedia">' + media(f) + '</div>' +
      '<div class="fbody">' +
        '<div class="ftop"><span class="fnum">' + pad2(n) + '</span><span class="ftitle">' + esc(f.title_en || f.title_hi) + '</span></div>' +
        (f.title_hi ? '<div class="fhi">' + esc(f.title_hi) + '</div>' : '') +
        (f.desc ? '<p class="fdesc">' + esc(f.desc) + '</p>' : '') +
        '<div class="ffoot">' + foot + '</div>' +
      '</div>' +
    '</article>';
  }
  function bindRows(container) {
    qsa('.frow.has-video', container).forEach(function (row) {
      var idx = Number(row.getAttribute('data-idx'));
      row.addEventListener('click', function (ev) {
        if (ev.target.closest('a')) return; /* the ↗ Link anchor navigates on its own */
        openItem(idx);
      });
      row.addEventListener('keydown', function (ev) {
        if ((ev.key === 'Enter' || ev.key === ' ') && ev.target === row) { ev.preventDefault(); openItem(idx); }
      });
    });
    qsa('img.fposter', container).forEach(function (img) {
      img.addEventListener('error', function () {
        var row = img.closest('.frow'), f = row && M.list[Number(row.getAttribute('data-idx'))];
        img.outerHTML = '<div class="ftile ' + (f ? (TONE[f.icon] || '') : '') + '">' + icon(f ? f.icon : 'star') + '</div>';
      });
    });
  }
  function sectLabel(s) {
    return '<div class="sectlabel"><span class="en">' + esc(s.title_en || '') + '</span>' + (s.title_hi ? '<span class="hi">' + esc(s.title_hi) + '</span>' : '') + '</div>';
  }
  function roleSection(r, feats, body, linkToPage) {
    var vids = feats.filter(withVideo).length;
    var count = '<span class="rcount">' + icon('film') + plural(feats.length, 'feature') + (vids ? ' · ' + plural(vids, 'video') : '') + (linkToPage ? ' ' + icon('external') : '') + '</span>';
    var head = '<' + (linkToPage ? 'a href="' + esc(ROOT + r.id + '/') + '"' : 'div') + ' class="rolehead">' + tile(ROLE_ICON[r.id] || 'star', ROLE_TONE[r.id] || '') +
      '<div class="rhead-t"><h2>' + esc(r.title_en || '') + (r.title_hi ? '<small>' + esc(r.title_hi) + '</small>' : '') + '</h2>' +
      (r.tagline ? '<div class="rtag">' + esc(r.tagline) + '</div>' : '') + '</div>' + count + '</' + (linkToPage ? 'a' : 'div') + '>';
    return '<section class="rolesec" id="role-' + esc(r.id) + '">' + head + body + '</section>';
  }
  function skeleton(n, cls) {
    var s = '<div class="rows">';
    for (var i = 0; i < n; i++) s += '<div class="skel' + (cls ? ' ' + cls : '') + '"></div>';
    return s + '</div>';
  }

  /* ---------- catalogue page (landing = all roles, role page = one role) ---------- */
  function initCatalogue() {
    var roleFilter = document.body.getAttribute('data-role') || '';
    var linksEl = $('links'), host = $('sections'), intro = $('intro');
    renderLinks(linksEl, null);
    host.innerHTML = skeleton(5);
    function fail(msg) {
      host.innerHTML = '<div class="errbox"><span>' + esc(msg) + '</span><button type="button">Retry</button></div>';
      host.querySelector('button').addEventListener('click', function () { host.innerHTML = skeleton(5); run(true); });
    }
    function run(force) {
      loadCatalog(force).then(function (cat) {
        var roles = (cat.roles || []).filter(function (r) { return !roleFilter || r.id === roleFilter; });
        if (roleFilter && !roles.length) { fail('Ye role catalog mein nahi mila.'); return; }
        var list = [], walk = walkItem(cat), html = '', all = [];
        list.push(walk);
        roles.forEach(function (r) {
          var feats = [], n = 0, body = '';
          (r.sections || []).forEach(function (s) {
            if (!(s.features || []).length) return;
            body += sectLabel(s) + '<div class="rows">' + s.features.map(function (f) {
              f._section = s; f._role = r; list.push(f); feats.push(f); n++;
              return featureRow(f, n, list.length - 1);
            }).join('') + '</div>';
          });
          if (!body) body = '<div class="errbox" style="color:#aebbdd;background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1)">Is role ke videos jald aa rahe hain.</div>';
          all = all.concat(feats);
          html += roleFilter ? '<section class="rolesec" id="role-' + esc(r.id) + '">' + body + '</section>' : roleSection(r, feats, body, true);
        });
        M.list = list;
        host.innerHTML = html;
        bindRows(host);
        renderLinks(linksEl, cat);
        /* intro */
        var vids = all.filter(withVideo), total = vids.reduce(function (a, f) { return a + (Number(f.duration) || 0); }, 0);
        if (intro) {
          if (roleFilter) {
            var r = roles[0];
            intro.querySelector('h1').textContent = r.title_en || '';
            var hi = intro.querySelector('.hi'); if (hi) hi.textContent = r.title_hi || '';
            intro.querySelector('.sub').textContent = r.tagline || '';
            document.title = (r.title_en || 'Guide') + ' — Simplicity app catalogue';
          }
          var st = intro.querySelector('.rstats');
          if (st) st.innerHTML = '<span class="stat">' + icon('list') + plural(all.length, 'feature') + '</span>' +
            '<span class="stat">' + icon('film') + plural(vids.length, 'video') + '</span>' +
            (total ? '<span class="stat">' + icon('clock') + fmtTotal(total) + ' total</span>' : '') +
            (cat.updated ? '<span class="stat">Updated ' + esc(cat.updated) + '</span>' : '');
        }
        openDeepLink();
      }).catch(function (e) {
        fail('Catalogue load nahi hua (' + (e && e.message ? e.message : 'network') + '). Internet check karke retry karo.');
      });
    }
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
      btn.innerHTML = on ? '<span class="spin"></span><span>' + esc(label || 'Bhej rahe hain…') + '</span>' : icon('arrow-right') + '<span>Send report</span>';
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
    if (page === 'catalogue') initCatalogue();
    else if (page === 'help') initHelp();
    loadCatalog().then(function () {
      qsa('a[data-link]').forEach(function (a) { var v = LINKS[a.getAttribute('data-link')]; if (v) a.href = v; });
    }).catch(function () { /* footer keeps its static links */ });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
