(() => {
  // EDIT-MODE GATE: only load the editor when the URL has ?edit=1
  // Clients on the bare URL see nothing — no toolbar, no edit affordances.
  if (new URLSearchParams(location.search).get('edit') !== '1') return;

  const STYLE = `
    .fb-edit-toolbar{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;gap:.5rem;font-family:Inter,sans-serif;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;flex-wrap:wrap;max-width:40vw;justify-content:flex-end}
    .fb-edit-toolbar button{background:#1a1a17;color:#f6f2e8;border:1px solid #1a1a17;padding:.8rem 1.2rem;cursor:pointer;letter-spacing:inherit;font-family:inherit;font-size:inherit;transition:all .2s}
    .fb-edit-toolbar button:hover{background:#2d3a28;border-color:#2d3a28}
    .fb-edit-toolbar button.fb-off{background:transparent;color:#1a1a17}
    .fb-edit-toolbar button:disabled{opacity:.35;cursor:not-allowed}
    body.fb-editing [data-editable]{outline:1px dashed rgba(122,138,110,.45);outline-offset:4px;cursor:text;min-height:1em}
    body.fb-editing [data-editable]:hover{outline-color:#4a5a42}
    body.fb-editing [data-editable]:focus{outline:2px solid #4a5a42;outline-offset:4px;background:rgba(255,255,255,.4)}
    body.fb-editing [data-section]{position:relative}
    body.fb-editing [data-section]:hover .fb-ctrls{opacity:1}
    .fb-ctrls{position:absolute;top:1rem;right:1rem;z-index:50;display:flex;gap:.4rem;opacity:0;transition:opacity .2s}
    .fb-ctrls button{width:auto;min-width:32px;height:32px;padding:0 .7rem;border-radius:16px;background:#1a1a17;color:#f6f2e8;border:none;font-family:Inter,sans-serif;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center}
    .fb-ctrls button:hover{background:#4a5a42}
    .fb-ctrls button.fb-del-btn:hover{background:#b85c4e}
    .fb-toast{position:fixed;bottom:5rem;right:1.5rem;background:#2d3a28;color:#f6f2e8;padding:.9rem 1.3rem;font-family:Inter,sans-serif;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;z-index:10000;opacity:0;transition:opacity .3s;pointer-events:none}
    .fb-toast.show{opacity:1}
    body.fb-editing [data-section][data-has-bg]{background-size:cover !important;background-position:center !important;background-repeat:no-repeat !important}
    body.fb-editing .fb-inline-img{display:block;max-width:100%;margin:1.5rem auto;cursor:pointer;outline:1px dashed rgba(122,138,110,.45);outline-offset:4px}
    body.fb-editing .fb-inline-img:hover{outline-color:#4a5a42}
    .fb-hidden-input{position:absolute;left:-9999px;opacity:0}
    body.fb-editing .fb-img-wrap{position:relative;display:block;max-width:100%;margin:1.5rem auto}
    body.fb-editing .fb-img-wrap .fb-inline-img{margin:0}
    body.fb-editing .fb-img-wrap .fb-img-del{position:absolute;top:.6rem;right:.6rem;width:30px;height:30px;border-radius:50%;background:#1a1a17;color:#f6f2e8;border:none;cursor:pointer;opacity:0;transition:opacity .2s;font-size:1rem;line-height:1;display:flex;align-items:center;justify-content:center}
    body.fb-editing .fb-img-wrap:hover .fb-img-del{opacity:1}
    body.fb-editing .fb-img-wrap .fb-img-del:hover{background:#b85c4e}
    body.fb-editing .site-nav a{position:relative}
    body.fb-editing .site-nav a:hover .fb-nav-del{opacity:1}
    .fb-nav-del{position:absolute;top:-10px;right:-10px;width:18px;height:18px;border-radius:50%;background:#1a1a17;color:#f6f2e8;border:none;font-size:.7rem;line-height:1;cursor:pointer;opacity:0;transition:opacity .2s;display:flex;align-items:center;justify-content:center}
    .fb-nav-del:hover{background:#b85c4e}
    body.fb-editing .fb-nav-add{background:transparent;border:1px dashed #4a5a42;color:#4a5a42;font-family:Inter,sans-serif;font-size:.7rem;padding:.2rem .6rem;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;margin-left:.6rem}
    body.fb-editing .fb-nav-add:hover{background:#4a5a42;color:#f6f2e8}
    .fb-nav-pages-popup{position:absolute;top:100%;right:0;margin-top:.4rem;background:#1a1a17;border-radius:4px;padding:.6rem;min-width:200px;display:none;flex-direction:column;gap:.2rem;z-index:60;font-family:Inter,sans-serif}
    .fb-nav-pages-popup.open{display:flex}
    .fb-nav-pages-popup button{background:transparent;color:#f6f2e8;border:none;text-align:left;font-family:inherit;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;padding:.5rem .6rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:.6rem}
    .fb-nav-pages-popup button:hover{background:#2d3a28}
    .fb-nav-pages-popup button .fb-chk{width:14px;height:14px;border:1px solid rgba(246,242,232,.4);display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;line-height:1}
    .fb-nav-pages-popup button.on .fb-chk{background:#7a8a6e;border-color:#7a8a6e}
    .fb-page-select{background:transparent;color:#1a1a17;border:1px solid #1a1a17;padding:.8rem 1rem;font-family:Inter,sans-serif;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}
    .fb-color-group{display:inline-flex;align-items:stretch;border:1px solid #1a1a17;background:transparent;overflow:hidden}
    .fb-color-group label{display:flex;align-items:center;padding:0 .8rem;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:#1a1a17;cursor:pointer}
    .fb-color-group input[type=color]{border:none;padding:0;margin:0;width:30px;height:auto;background:transparent;cursor:pointer;-webkit-appearance:none}
    .fb-color-group input[type=color]::-webkit-color-swatch-wrapper{padding:4px}
    .fb-color-group input[type=color]::-webkit-color-swatch{border:none;border-radius:0}
    .fb-swatches{display:inline-flex;gap:.3rem;align-items:center;margin-left:.3rem;flex-wrap:wrap;max-width:260px}
    .fb-swatches button{width:20px;height:20px;border-radius:50%;border:1px solid rgba(0,0,0,.15);padding:0;cursor:pointer;background-clip:padding-box}
    .fb-swatches button:hover{transform:scale(1.15)}
    .fb-swatch-popup{position:absolute;top:2.3rem;right:0;background:#1a1a17;padding:.7rem;display:none;gap:.4rem;align-items:center;border-radius:4px;z-index:60;flex-wrap:wrap;max-width:220px}
    .fb-swatch-popup.open{display:flex}
    .fb-swatch-popup button{width:24px;height:24px;border-radius:50%;border:1px solid rgba(246,242,232,.25);padding:0;cursor:pointer;flex-shrink:0}
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  document.querySelectorAll('main section, footer').forEach(s => s.setAttribute('data-section',''));
  document.querySelectorAll('h1,h2,h3,h4,p,a.brand,.eyebrow,.pillar-num,.entry-meta,.footer-brand,.footer-meta').forEach(el => {
    if (!el.closest('.fb-edit-toolbar')) el.setAttribute('data-editable','');
  });

  const bar = document.createElement('div');
  bar.className = 'fb-edit-toolbar';
  bar.innerHTML = `
    <button id="fb-toggle" class="fb-off">Edit</button>
    <select id="fb-page-select" class="fb-page-select" style="display:none"></select>
    <button id="fb-add-page" style="display:none">+ Page</button>
    <button id="fb-del-page" style="display:none">× Page</button>
    <span class="fb-color-group" id="fb-text-color-wrap" style="display:none"><label for="fb-text-color">Text</label><input type="color" id="fb-text-color" value="#1a1a17" /><span class="fb-swatches" id="fb-text-swatches"></span></span>
    <button id="fb-undo" style="display:none" disabled>Undo</button>
    <button id="fb-add-img" style="display:none">+ Image</button>
    <button id="fb-save" style="display:none">Save HTML</button>
  `;
  document.body.appendChild(bar);

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.className = 'fb-hidden-input';
  document.body.appendChild(fileInput);

  const toast = document.createElement('div');
  toast.className = 'fb-toast';
  document.body.appendChild(toast);
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  };

  const toggleBtn = document.getElementById('fb-toggle');
  const saveBtn = document.getElementById('fb-save');
  const addImgBtn = document.getElementById('fb-add-img');
  const undoBtn = document.getElementById('fb-undo');
  const pageSelect = document.getElementById('fb-page-select');
  const addPageBtn = document.getElementById('fb-add-page');
  const delPageBtn = document.getElementById('fb-del-page');
  const textColor = document.getElementById('fb-text-color');
  const textColorWrap = document.getElementById('fb-text-color-wrap');

  // Brand palette
  const PALETTE = [
    { name: 'Cream',       hex: '#faf5ea' },
    { name: 'Warm Ivory',  hex: '#f0e6d2' },
    { name: 'Dusty Rose',  hex: '#d4a5a5' },
    { name: 'Rosewood',    hex: '#9c6b65' },
    { name: 'Sage',        hex: '#7a8a6e' },
  ];

  // Populate text-color swatches
  const textSwatches = document.getElementById('fb-text-swatches');
  PALETTE.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.title = c.name + ' · ' + c.hex;
    b.style.background = c.hex;
    b.addEventListener('click', (e) => {
      e.preventDefault();
      applyTextColor(c.hex);
    });
    textSwatches.appendChild(b);
  });

  let editing = false;
  let ctrls = [];
  const undoStack = [];
  const MAX_UNDO = 60;

  const mainEl = () => document.querySelector('main');
  const footerEl = () => document.querySelector('footer');

  const snapshot = () => ({
    main: mainEl()?.innerHTML || '',
    footer: footerEl()?.innerHTML || '',
  });

  const refreshUndoBtn = () => {
    undoBtn.disabled = undoStack.length === 0;
  };

  const pushUndo = () => {
    unmountCtrls();
    undoStack.push(snapshot());
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    if (editing) mountCtrls();
    refreshUndoBtn();
  };

  const restoreSnapshot = (s) => {
    unmountCtrls();
    if (mainEl()) mainEl().innerHTML = s.main;
    if (footerEl()) footerEl().innerHTML = s.footer;
    // re-mark sections + editables (new DOM after innerHTML set)
    document.querySelectorAll('main section, footer').forEach(sec => sec.setAttribute('data-section',''));
    document.querySelectorAll('h1,h2,h3,h4,p,a.brand,.eyebrow,.pillar-num,.entry-meta,.footer-brand,.footer-meta').forEach(el => {
      if (!el.closest('.fb-edit-toolbar')) el.setAttribute('data-editable','');
    });
    if (editing) {
      setEditable(true);
      mountCtrls();
      mountImgDelButtons();
      mountNavCtrls();
      rebuildPageSelect();
    }
  };

  const doUndo = () => {
    if (!undoStack.length) return;
    const s = undoStack.pop();
    restoreSnapshot(s);
    refreshUndoBtn();
    showToast('Undone');
  };

  const readAsDataURL = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const pickImage = () => new Promise((res) => {
    fileInput.value = '';
    const onChange = async () => {
      fileInput.removeEventListener('change', onChange);
      const f = fileInput.files[0];
      if (!f) return res(null);
      const d = await readAsDataURL(f);
      res(d);
    };
    fileInput.addEventListener('change', onChange);
    fileInput.click();
  });

  const setBackground = async (sec) => {
    const d = await pickImage();
    if (!d) return;
    pushUndo();
    sec.style.backgroundImage = `url('${d}')`;
    sec.setAttribute('data-has-bg','');
    showToast('Background set');
  };

  const clearBackground = (sec) => {
    if (!sec.style.backgroundImage && !sec.style.backgroundColor) return;
    pushUndo();
    sec.style.backgroundImage = '';
    sec.style.backgroundColor = '';
    sec.removeAttribute('data-has-bg');
    showToast('Background cleared');
  };

  const wrapImage = (img) => {
    if (img.parentElement && img.parentElement.classList.contains('fb-img-wrap')) return img.parentElement;
    const wrap = document.createElement('span');
    wrap.className = 'fb-img-wrap';
    img.parentElement.insertBefore(wrap, img);
    wrap.appendChild(img);
    return wrap;
  };

  const ensureImgDelBtn = (wrap) => {
    if (wrap.querySelector(':scope > .fb-img-del')) return;
    const b = document.createElement('button');
    b.className = 'fb-img-del';
    b.type = 'button';
    b.title = 'Delete image';
    b.textContent = '×';
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      pushUndo();
      wrap.remove();
      showToast('Image deleted');
    });
    wrap.appendChild(b);
  };

  const mountImgDelButtons = () => {
    document.querySelectorAll('.fb-inline-img').forEach(img => {
      const wrap = wrapImage(img);
      ensureImgDelBtn(wrap);
    });
  };

  const unmountImgDelButtons = () => {
    document.querySelectorAll('.fb-img-wrap .fb-img-del').forEach(b => b.remove());
  };

  const insertImageInto = async (sec) => {
    const d = await pickImage();
    if (!d) return;
    pushUndo();
    const img = document.createElement('img');
    img.src = d;
    img.className = 'fb-inline-img';
    img.alt = '';
    const container = sec.querySelector('.container') || sec;
    container.appendChild(img);
    if (editing) {
      const wrap = wrapImage(img);
      ensureImgDelBtn(wrap);
    }
    showToast('Image added');
  };

  // ---------- PAGES ----------
  const getPages = () => Array.from(document.querySelectorAll('.fb-page'));
  const currentPage = () => {
    const pages = getPages();
    if (!pages.length) return null;
    const hash = (location.hash || '').replace(/^#\/?/, '');
    return document.querySelector('.fb-page[data-page="'+hash+'"]') || pages[0];
  };

  const slugify = (s) => s.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,32) || 'page';

  const rebuildPageSelect = () => {
    const pages = getPages();
    const cur = currentPage();
    pageSelect.innerHTML = '';
    pages.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.dataset.page;
      opt.textContent = p.dataset.title || p.dataset.page;
      if (p === cur) opt.selected = true;
      pageSelect.appendChild(opt);
    });
    delPageBtn.disabled = pages.length <= 1;
  };

  const rebuildNav = () => {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    // Remove only orphaned auto-links (pointing to pages that no longer exist)
    nav.querySelectorAll('a[data-fb-page]').forEach(a => {
      const slug = (a.getAttribute('href') || '').replace(/^#\/?/,'');
      if (!document.querySelector('.fb-page[data-page="'+slug+'"]')) {
        const next = a.nextElementSibling;
        if (next && next.classList.contains('nav-divider')) next.remove();
        else {
          const prev = a.previousElementSibling;
          if (prev && prev.classList.contains('nav-divider')) prev.remove();
        }
        a.remove();
      }
    });
    // Add links for any new pages missing a link
    const pages = getPages();
    pages.forEach(p => {
      const slug = p.dataset.page;
      const existing = nav.querySelector('a[href="#/'+slug+'"]');
      if (existing) return;
      if (nav.lastElementChild && nav.lastElementChild.tagName === 'A') {
        const div = document.createElement('span');
        div.className = 'nav-divider';
        div.textContent = '·';
        nav.appendChild(div);
      }
      const a = document.createElement('a');
      a.dataset.fbPage = '';
      a.href = '#/' + slug;
      a.textContent = p.dataset.title || slug;
      a.setAttribute('data-editable','');
      nav.appendChild(a);
    });
  };

  const mountNavCtrls = () => {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    // make every link editable + give it a × button
    nav.querySelectorAll('a').forEach(a => {
      a.setAttribute('data-editable','');
      if (a.querySelector(':scope > .fb-nav-del')) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'fb-nav-del';
      b.title = 'Remove this link';
      b.textContent = '×';
      b.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        pushUndo();
        // remove neighbouring divider
        const next = a.nextElementSibling;
        if (next && next.classList.contains('nav-divider')) next.remove();
        else {
          const prev = a.previousElementSibling;
          if (prev && prev.classList.contains('nav-divider')) prev.remove();
        }
        a.remove();
        showToast('Link removed');
      });
      a.appendChild(b);
    });
    // add "+ Pages" and "+ Link" buttons at the end (only one set)
    if (!nav.querySelector(':scope > .fb-nav-pages-btn')) {
      const pagesBtn = document.createElement('button');
      pagesBtn.type = 'button';
      pagesBtn.className = 'fb-nav-add fb-nav-pages-btn';
      pagesBtn.textContent = '+ Pages';
      pagesBtn.style.position = 'relative';
      const popup = document.createElement('span');
      popup.className = 'fb-nav-pages-popup';
      pagesBtn.appendChild(popup);
      pagesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        renderPagesPopup(popup);
        document.querySelectorAll('.fb-nav-pages-popup.open').forEach(p => { if (p !== popup) p.classList.remove('open'); });
        popup.classList.toggle('open');
      });
      nav.appendChild(pagesBtn);
    }
    if (!nav.querySelector(':scope > .fb-nav-link-btn')) {
      const plus = document.createElement('button');
      plus.type = 'button';
      plus.className = 'fb-nav-add fb-nav-link-btn';
      plus.textContent = '+ Link';
      plus.addEventListener('click', (e) => {
        e.preventDefault();
        addNavLink();
      });
      nav.appendChild(plus);
    }
  };

  const isPageInNav = (slug) => {
    const nav = document.querySelector('.site-nav');
    return !!nav && !!nav.querySelector('a[href="#/'+slug+'"]');
  };

  const togglePageInNav = (slug) => {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    pushUndo();
    const existing = nav.querySelector('a[href="#/'+slug+'"]');
    if (existing) {
      const next = existing.nextElementSibling;
      if (next && next.classList.contains('nav-divider')) next.remove();
      else {
        const prev = existing.previousElementSibling;
        if (prev && prev.classList.contains('nav-divider')) prev.remove();
      }
      existing.remove();
      showToast('Removed from nav');
    } else {
      const page = document.querySelector('.fb-page[data-page="'+slug+'"]');
      if (!page) return;
      const pagesBtn = nav.querySelector('.fb-nav-pages-btn');
      // insert a divider if there's already a link
      if (nav.querySelector('a')) {
        const div = document.createElement('span');
        div.className = 'nav-divider';
        div.textContent = '·';
        nav.insertBefore(div, pagesBtn);
      }
      const a = document.createElement('a');
      a.dataset.fbPage = '';
      a.href = '#/' + slug;
      a.textContent = page.dataset.title || slug;
      a.setAttribute('data-editable','');
      nav.insertBefore(a, pagesBtn);
      showToast('Added to nav');
    }
    mountNavCtrls();
  };

  const renderPagesPopup = (popup) => {
    popup.innerHTML = '';
    const pages = getPages();
    if (!pages.length) {
      popup.innerHTML = '<button disabled>No pages yet</button>';
      return;
    }
    pages.forEach(p => {
      const slug = p.dataset.page;
      const title = p.dataset.title || slug;
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<span>'+ title.replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])) +'</span><span class="fb-chk"></span>';
      if (isPageInNav(slug)) b.classList.add('on');
      b.querySelector('.fb-chk').textContent = isPageInNav(slug) ? '✓' : '';
      b.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePageInNav(slug);
        renderPagesPopup(popup); // refresh checkmarks
      });
      popup.appendChild(b);
    });
  };

  // close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (!editing) return;
    const inside = e.target.closest('.fb-nav-pages-btn');
    if (!inside) {
      document.querySelectorAll('.fb-nav-pages-popup.open').forEach(p => p.classList.remove('open'));
    }
  });

  const unmountNavCtrls = () => {
    document.querySelectorAll('.site-nav .fb-nav-del, .site-nav .fb-nav-add, .site-nav .fb-nav-pages-popup').forEach(n => n.remove());
  };

  const addNavLink = () => {
    const pages = getPages();
    const lines = pages.map((p,i) => `${i+1}. ${p.dataset.title || p.dataset.page}`).join('\n');
    const ask = 'Enter a page number below, or a custom URL (e.g. https://instagram.com/...)\n\n' + lines + '\n\nOr type label=URL (e.g. Instagram=https://instagram.com/florabotanica)';
    const input = prompt(ask);
    if (!input) return;
    pushUndo();
    let label, href;
    // case 1: number -> page
    const n = parseInt(input.trim(), 10);
    if (!isNaN(n) && n >= 1 && n <= pages.length) {
      const p = pages[n-1];
      label = p.dataset.title || p.dataset.page;
      href = '#/' + p.dataset.page;
    } else if (input.includes('=')) {
      // label=URL
      const idx = input.indexOf('=');
      label = input.slice(0, idx).trim();
      href = input.slice(idx+1).trim();
    } else {
      // bare URL
      href = input.trim();
      label = prompt('Link label', 'Link') || 'Link';
    }
    const nav = document.querySelector('.site-nav');
    // insert before the + button and any existing add/del controls
    const addBtn = nav.querySelector('.fb-nav-add');
    if (nav.querySelector('a')) {
      const div = document.createElement('span');
      div.className = 'nav-divider';
      div.textContent = '·';
      nav.insertBefore(div, addBtn);
    }
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.setAttribute('data-editable','');
    nav.insertBefore(a, addBtn);
    mountNavCtrls();
    showToast('Link added');
  };

  const switchPage = (slug) => {
    location.hash = '#/' + slug;
    // router in index.html handles display
    rebuildPageSelect();
    if (editing) { mountCtrls(); mountImgDelButtons(); setEditable(true); }
  };

  const TEMPLATES = {
    blank: {
      title: 'Blank',
      html: (t) => `
        <section class="section" data-section>
          <div class="container center">
            <p class="eyebrow" data-editable>${t}</p>
            <h1 data-editable>A new <em>page</em>.</h1>
            <p class="lead" data-editable>Replace this with your copy. Click to edit.</p>
          </div>
        </section>`
    },
    about: {
      title: 'About',
      html: (t) => `
        <section class="hero" data-section>
          <div class="container center">
            <p class="eyebrow" data-editable>Our Story</p>
            <h1 data-editable>A practice <em>rooted</em> in listening.</h1>
            <p class="lead" data-editable>Terrain-based botanical medicine, slow consultations, and the long arc of healing.</p>
          </div>
        </section>
        <section class="section" data-section>
          <div class="container two-col">
            <div class="col">
              <p class="eyebrow" data-editable>The Founder</p>
              <h2 data-editable>Ava Morse <em>— founder &amp; practitioner</em></h2>
            </div>
            <div class="col">
              <p data-editable>Write your story here. Years of study, formative teachers, the moment you knew this was the work.</p>
              <p data-editable>Add a second paragraph about your method, training, or the values that guide the practice.</p>
            </div>
          </div>
        </section>
        <section class="section pillars-section" data-section>
          <div class="container">
            <div class="pillars">
              <article class="pillar"><p class="pillar-num" data-editable>01</p><h3 data-editable>Lineage</h3><p data-editable>A paragraph about your teachers, your training, your inheritance.</p></article>
              <article class="pillar"><p class="pillar-num" data-editable>02</p><h3 data-editable>Method</h3><p data-editable>How you work — terrain, microscopy, seasonal protocols.</p></article>
              <article class="pillar"><p class="pillar-num" data-editable>03</p><h3 data-editable>Why This</h3><p data-editable>What drives you to this particular form of medicine.</p></article>
            </div>
          </div>
        </section>`
    },
    services: {
      title: 'Services',
      html: (t) => `
        <section class="hero" data-section>
          <div class="container center">
            <p class="eyebrow" data-editable>Offerings</p>
            <h1 data-editable>Consultations, <em>protocols</em>, and the apothecary.</h1>
            <p class="lead" data-editable>A quiet menu of services — read slowly.</p>
          </div>
        </section>
        <section class="section" data-section>
          <div class="container">
            <div class="pillars">
              <article class="pillar"><p class="pillar-num" data-editable>01</p><h3 data-editable>Initial Consultation</h3><p data-editable>90 minutes. Terrain assessment, intake, and the first protocol.</p></article>
              <article class="pillar"><p class="pillar-num" data-editable>02</p><h3 data-editable>Live Blood Microscopy</h3><p data-editable>A window into terrain — oxidative stress, mineral status, systemic patterns.</p></article>
              <article class="pillar"><p class="pillar-num" data-editable>03</p><h3 data-editable>Seasonal Protocol</h3><p data-editable>In-house botanical formulations, reviewed and adjusted quarterly.</p></article>
            </div>
          </div>
        </section>
        <section class="section" data-section>
          <div class="container center">
            <p class="eyebrow" data-editable>Rates</p>
            <h2 data-editable>Fees, on request.</h2>
            <p class="lead" data-editable>Inquire through Contact for a current menu and fee schedule.</p>
          </div>
        </section>`
    },
    membership: {
      title: 'Membership',
      html: (t) => `
        <section class="section section-dark" data-section style="min-height:70vh;display:flex;align-items:center">
          <div class="container center">
            <p class="eyebrow light" data-editable>Membership</p>
            <h1 class="light" data-editable>By <em>application</em>, by invitation.</h1>
            <p class="lead light" data-editable>A Private Membership Association for those committed to the slow work.</p>
            <div class="hero-cta"><a href="#/contact" class="btn btn-primary-light" data-editable>Request Application</a></div>
          </div>
        </section>
        <section class="section" data-section>
          <div class="container two-col">
            <div class="col">
              <p class="eyebrow" data-editable>What's included</p>
              <h2 data-editable>The membership <em>offering</em>.</h2>
            </div>
            <div class="col">
              <p data-editable>Quarterly consultations, custom protocols, access to the apothecary, and members-only journal entries.</p>
              <p data-editable>Priority scheduling and a direct line for seasonal questions.</p>
            </div>
          </div>
        </section>`
    },
    contact: {
      title: 'Contact',
      html: (t) => `
        <section class="hero" data-section>
          <div class="container center">
            <p class="eyebrow" data-editable>Contact</p>
            <h1 data-editable>Begin the <em>conversation</em>.</h1>
            <p class="lead" data-editable>For membership inquiries, applications, and correspondence.</p>
          </div>
        </section>
        <section class="section section-contact" data-section>
          <div class="container center">
            <p class="contact-line" data-editable><a href="mailto:hello@florabotanica.com">hello@florabotanica.com</a></p>
            <p class="contact-line soft" data-editable>By appointment · Members only</p>
            <p class="contact-line soft" data-editable>Rumford · Rhode Island</p>
          </div>
        </section>`
    },
    journal: {
      title: 'Journal',
      html: (t) => `
        <section class="hero" data-section>
          <div class="container center">
            <p class="eyebrow" data-editable>Journal</p>
            <h1 data-editable>Field notes from the <em>apothecary</em>.</h1>
            <p class="lead" data-editable>Seasonal essays on plants, terrain, and the slow work of healing.</p>
          </div>
        </section>
        <section class="section" data-section>
          <div class="container">
            <div class="journal-grid">
              <article class="entry"><p class="entry-meta" data-editable>Spring · Terrain</p><h3 data-editable>On the Quiet Medicine of Nettle</h3><p data-editable>A plant that arrives without being asked, and asks very little in return.</p></article>
              <article class="entry"><p class="entry-meta" data-editable>Summer · Microscopy</p><h3 data-editable>What Blood Tells Us About Stress</h3><p data-editable>The shapes under the lens — and why they change before symptoms do.</p></article>
              <article class="entry"><p class="entry-meta" data-editable>Autumn · Practice</p><h3 data-editable>The Slow Protocol</h3><p data-editable>Why changes that hold take a season, not a week.</p></article>
              <article class="entry"><p class="entry-meta" data-editable>Winter · Apothecary</p><h3 data-editable>Elixirs for the Dark Months</h3><p data-editable>Rosehip, elder, bitter roots. Building a winter shelf.</p></article>
              <article class="entry"><p class="entry-meta" data-editable>New Entry</p><h3 data-editable>Click to edit the title</h3><p data-editable>Click to edit the excerpt. Duplicate this card for more entries.</p></article>
              <article class="entry"><p class="entry-meta" data-editable>New Entry</p><h3 data-editable>Click to edit the title</h3><p data-editable>Click to edit the excerpt.</p></article>
            </div>
          </div>
        </section>`
    },
  };

  const addPage = () => {
    // template picker (simple prompt-based menu to avoid building a modal)
    const keys = Object.keys(TEMPLATES);
    const menu = keys.map((k,i) => `${i+1}. ${TEMPLATES[k].title}`).join('\n');
    const choice = prompt('Choose a template (enter number):\n\n' + menu, '2');
    if (!choice) return;
    const idx = parseInt(choice, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= keys.length) { alert('Invalid choice'); return; }
    const tpl = TEMPLATES[keys[idx]];
    const title = prompt('Page title', tpl.title);
    if (!title) return;
    const slug = slugify(title);
    if (document.querySelector('.fb-page[data-page="'+slug+'"]')) {
      alert('A page with that name already exists.'); return;
    }
    pushUndo();
    const main = document.querySelector('main');
    const page = document.createElement('div');
    page.className = 'fb-page';
    page.dataset.page = slug;
    page.dataset.title = title;
    page.innerHTML = tpl.html(title);
    main.appendChild(page);
    rebuildNav();
    switchPage(slug);
    showToast(tpl.title + ' page added');
  };

  const deleteCurrentPage = () => {
    const pages = getPages();
    if (pages.length <= 1) { showToast('Cannot delete the only page'); return; }
    const cur = currentPage();
    if (!cur) return;
    if (!confirm('Delete page "'+ (cur.dataset.title || cur.dataset.page) +'"?')) return;
    pushUndo();
    const idx = pages.indexOf(cur);
    cur.remove();
    rebuildNav();
    const next = getPages()[Math.max(0, idx-1)];
    switchPage(next.dataset.page);
    showToast('Page deleted');
  };

  const mountCtrls = () => {
    document.querySelectorAll('[data-section]').forEach(sec => {
      if (sec.querySelector(':scope > .fb-ctrls')) return;
      const wrap = document.createElement('div');
      wrap.className = 'fb-ctrls';
      wrap.innerHTML = `
        <button type="button" class="fb-bg-btn" title="Set background image">BG</button>
        <button type="button" class="fb-bg-color-btn" title="Section background color">COLOR</button>
        <button type="button" class="fb-bg-clear" title="Clear background">CLR</button>
        <button type="button" class="fb-img-btn" title="Insert image into section">IMG</button>
        <button type="button" class="fb-del-btn" title="Delete section">×</button>
        <div class="fb-swatch-popup"></div>
        <input type="color" class="fb-bg-color-input" style="position:absolute;opacity:0;width:0;height:0;pointer-events:none">
      `;
      wrap.querySelector('.fb-bg-btn').addEventListener('click', (e) => { e.preventDefault(); setBackground(sec); });
      wrap.querySelector('.fb-bg-clear').addEventListener('click', (e) => { e.preventDefault(); clearBackground(sec); });
      wrap.querySelector('.fb-img-btn').addEventListener('click', (e) => { e.preventDefault(); insertImageInto(sec); });

      const popup = wrap.querySelector('.fb-swatch-popup');
      const bgColorInput = wrap.querySelector('.fb-bg-color-input');
      const colorBtn = wrap.querySelector('.fb-bg-color-btn');
      // Build palette swatches + "custom" trigger
      PALETTE.forEach(c => {
        const sw = document.createElement('button');
        sw.type = 'button';
        sw.title = c.name + ' · ' + c.hex;
        sw.style.background = c.hex;
        sw.addEventListener('click', (e) => {
          e.preventDefault();
          pushUndo();
          sec.style.backgroundColor = c.hex;
          popup.classList.remove('open');
          showToast(c.name + ' applied');
        });
        popup.appendChild(sw);
      });
      const custom = document.createElement('button');
      custom.type = 'button';
      custom.title = 'Custom color';
      custom.textContent = '+';
      custom.style.background = 'transparent';
      custom.style.color = '#f6f2e8';
      custom.style.fontSize = '12px';
      custom.addEventListener('click', (e) => {
        e.preventDefault();
        bgColorInput.click();
      });
      popup.appendChild(custom);

      colorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // close any other popups
        document.querySelectorAll('.fb-swatch-popup.open').forEach(p => { if (p !== popup) p.classList.remove('open'); });
        popup.classList.toggle('open');
      });

      let bgColorBaseline = null;
      bgColorInput.addEventListener('focus', () => { bgColorBaseline = sec.style.backgroundColor; });
      bgColorInput.addEventListener('input', (e) => { sec.style.backgroundColor = e.target.value; });
      bgColorInput.addEventListener('change', (e) => {
        const post = e.target.value;
        sec.style.backgroundColor = bgColorBaseline || '';
        pushUndo();
        sec.style.backgroundColor = post;
        popup.classList.remove('open');
        showToast('Background color set');
      });
      wrap.querySelector('.fb-del-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Delete this section?')) { pushUndo(); sec.remove(); }
      });
      sec.appendChild(wrap);
      ctrls.push(wrap);
    });
  };

  const unmountCtrls = () => {
    ctrls.forEach(c => c.remove());
    ctrls = [];
  };

  const setEditable = (on) => {
    document.querySelectorAll('[data-editable]').forEach(el => {
      if (on) {
        el.setAttribute('contenteditable','true');
        el.setAttribute('spellcheck','true');
      } else {
        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
      }
    });
  };

  // Click inline image in edit mode to replace it
  document.addEventListener('click', async (e) => {
    if (!editing) return;
    const img = e.target.closest('.fb-inline-img');
    if (!img) return;
    e.preventDefault();
    const d = await pickImage();
    if (d) { pushUndo(); img.src = d; }
  });

  // Text edit snapshotting: baseline on focus, push on blur if content changed
  let focusBaseline = null;
  document.addEventListener('focusin', (e) => {
    if (!editing) return;
    const el = e.target.closest('[data-editable]');
    if (!el) return;
    focusBaseline = { el, html: el.innerHTML };
  });
  document.addEventListener('focusout', (e) => {
    if (!editing || !focusBaseline) return;
    const el = e.target.closest('[data-editable]');
    if (el && el === focusBaseline.el && el.innerHTML !== focusBaseline.html) {
      // swap: push snapshot representing the pre-edit state
      const post = el.innerHTML;
      el.innerHTML = focusBaseline.html;
      pushUndo();
      el.innerHTML = post;
    }
    focusBaseline = null;
  });

  // Cmd/Ctrl-Z
  document.addEventListener('keydown', (e) => {
    if (!editing) return;
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
      // only when NOT inside a contenteditable (let browser handle inline text undo first)
      const inEditable = e.target.closest('[contenteditable="true"]');
      if (!inEditable) {
        e.preventDefault();
        doUndo();
      }
    }
  });

  undoBtn.addEventListener('click', (e) => { e.preventDefault(); doUndo(); });
  addPageBtn.addEventListener('click', (e) => { e.preventDefault(); addPage(); });
  delPageBtn.addEventListener('click', (e) => { e.preventDefault(); deleteCurrentPage(); });
  pageSelect.addEventListener('change', (e) => { switchPage(e.target.value); });
  window.addEventListener('hashchange', () => { if (editing) { rebuildPageSelect(); mountCtrls(); mountImgDelButtons(); } });

  // ---------- TEXT COLOR ----------
  // Remember the last editable target when the user clicks the color input (focus leaves text)
  let lastTextTarget = null;
  let lastSelectionRange = null;
  document.addEventListener('selectionchange', () => {
    if (!editing) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const node = sel.anchorNode;
    if (!node) return;
    const el = (node.nodeType === 1 ? node : node.parentElement)?.closest('[data-editable]');
    if (el) {
      lastTextTarget = el;
      if (!sel.isCollapsed) {
        lastSelectionRange = sel.getRangeAt(0).cloneRange();
      } else {
        lastSelectionRange = null;
      }
    }
  });

  const wrapSelectionInColor = (range, color) => {
    const span = document.createElement('span');
    span.style.color = color;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
    } catch (err) {
      console.warn('color apply failed', err);
    }
  };

  function applyTextColor(color) {
    if (!lastTextTarget) { showToast('Click text first, then pick color'); return; }
    pushUndo();
    if (lastSelectionRange) {
      wrapSelectionInColor(lastSelectionRange, color);
      lastSelectionRange = null;
    } else {
      lastTextTarget.style.color = color;
    }
    showToast('Text color set');
  }

  textColor.addEventListener('input', (e) => applyTextColor(e.target.value));

  toggleBtn.addEventListener('click', () => {
    editing = !editing;
    document.body.classList.toggle('fb-editing', editing);
    setEditable(editing);
    if (editing) {
      mountCtrls();
      mountImgDelButtons();
      mountNavCtrls();
      rebuildPageSelect();
      toggleBtn.textContent = 'Done';
      toggleBtn.classList.remove('fb-off');
      saveBtn.style.display = 'inline-block';
      addImgBtn.style.display = 'inline-block';
      undoBtn.style.display = 'inline-block';
      pageSelect.style.display = 'inline-block';
      addPageBtn.style.display = 'inline-block';
      delPageBtn.style.display = 'inline-block';
      textColorWrap.style.display = 'inline-flex';
      refreshUndoBtn();
      showToast('Edit mode — hover sections for controls');
    } else {
      unmountCtrls();
      unmountImgDelButtons();
      unmountNavCtrls();
      toggleBtn.textContent = 'Edit';
      toggleBtn.classList.add('fb-off');
      saveBtn.style.display = 'none';
      addImgBtn.style.display = 'none';
      undoBtn.style.display = 'none';
      pageSelect.style.display = 'none';
      addPageBtn.style.display = 'none';
      delPageBtn.style.display = 'none';
      textColorWrap.style.display = 'none';
    }
  });

  addImgBtn.addEventListener('click', async () => {
    // insert into whichever section the caret is in, else the first one
    let sec = document.activeElement?.closest('[data-section]');
    if (!sec) sec = document.querySelector('[data-section]');
    if (sec) insertImageInto(sec);
  });

  // ---------- SAVE DIRECT (File System Access API) ----------
  const HANDLE_DB = 'fb-editor', HANDLE_STORE = 'handles', HANDLE_KEY = 'index-html';
  const idbOpen = () => new Promise((res, rej) => {
    const r = indexedDB.open(HANDLE_DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(HANDLE_STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  const idbGet = async (k) => {
    const db = await idbOpen();
    return new Promise((res, rej) => {
      const tx = db.transaction(HANDLE_STORE, 'readonly');
      const req = tx.objectStore(HANDLE_STORE).get(k);
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  };
  const idbPut = async (k, v) => {
    const db = await idbOpen();
    return new Promise((res, rej) => {
      const tx = db.transaction(HANDLE_STORE, 'readwrite');
      tx.objectStore(HANDLE_STORE).put(v, k);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  };

  const verifyPerm = async (handle) => {
    const opts = { mode: 'readwrite' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    if ((await handle.requestPermission(opts)) === 'granted') return true;
    return false;
  };

  const buildCleanHTML = () => {
    const clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll('.fb-edit-toolbar, .fb-toast, .fb-ctrls, .fb-hidden-input, .fb-img-del, .fb-swatch-popup, .fb-nav-del, .fb-nav-add, .fb-nav-pages-popup').forEach(n => n.remove());
    clone.querySelectorAll('style').forEach(s => {
      if (s.textContent.includes('fb-edit-toolbar')) s.remove();
    });
    clone.querySelectorAll('[data-editable]').forEach(el => {
      el.removeAttribute('data-editable');
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
    });
    clone.querySelectorAll('[data-section]').forEach(el => {
      el.removeAttribute('data-section');
      el.removeAttribute('data-has-bg');
    });
    clone.querySelectorAll('.fb-img-wrap').forEach(w => {
      const img = w.querySelector('.fb-inline-img');
      if (img) { w.parentNode.insertBefore(img, w); }
      w.remove();
    });
    clone.querySelectorAll('.fb-inline-img').forEach(el => {
      el.classList.remove('fb-inline-img');
      el.style.display = 'block';
      el.style.maxWidth = '100%';
      el.style.margin = '1.5rem auto';
    });
    clone.querySelectorAll('.fb-page').forEach(p => { p.style.display = ''; });
    clone.querySelectorAll('script[src^="editor.js"]').forEach(s => s.remove());
    clone.querySelectorAll('body').forEach(b => b.classList.remove('fb-editing'));
    return '<!DOCTYPE html>\n' + clone.outerHTML;
  };

  const downloadFallback = (html) => {
    try {
      const blob = new Blob([html], {type: 'text/html'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 2000);
      // Blocking alert so user sees it — browsers download silently otherwise
      setTimeout(() => {
        alert('index.html downloaded to your Downloads folder.\n\nDrag it into ~/Desktop/florbotanica-site/ to replace the old index.html.\n\nTip: run serve.command in that folder to enable direct save with no download step.');
      }, 300);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Save failed. Error: ' + (err && err.message ? err.message : err) + '\n\nTry opening the site via serve.command for a more reliable save.');
    }
  };

  const canUseFSAccess = () => {
    if (!('showSaveFilePicker' in window)) return false;
    // File System Access API is blocked on file:// — must be http(s) or localhost
    if (location.protocol === 'file:') return false;
    return true;
  };

  const saveDirect = async () => {
    const html = buildCleanHTML();
    if (!canUseFSAccess()) {
      downloadFallback(html);
      return;
    }
    try {
      let handle = null;
      try { handle = await idbGet(HANDLE_KEY); } catch (_) {}
      if (handle) {
        try {
          if (!(await verifyPerm(handle))) handle = null;
        } catch (_) { handle = null; }
      }
      if (!handle) {
        handle = await window.showSaveFilePicker({
          suggestedName: 'index.html',
          types: [{ description: 'HTML', accept: { 'text/html': ['.html'] } }],
        });
        try { await idbPut(HANDLE_KEY, handle); } catch (_) {}
      }
      const writable = await handle.createWritable();
      await writable.write(html);
      await writable.close();
      showToast('Saved to ' + handle.name);
    } catch (err) {
      if (err && err.name === 'AbortError') return; // user cancelled
      console.warn('Direct save failed, falling back to download', err);
      showToast('Direct save failed — downloading instead');
      downloadFallback(html);
    }
  };

  // "Save As…" — always prompts for a location, updates the remembered handle
  const saveAs = async () => {
    const html = buildCleanHTML();
    if (!('showSaveFilePicker' in window)) {
      downloadFallback(html);
      return;
    }
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'index.html',
        types: [{ description: 'HTML', accept: { 'text/html': ['.html'] } }],
      });
      await idbPut(HANDLE_KEY, handle);
      const writable = await handle.createWritable();
      await writable.write(html);
      await writable.close();
      showToast('Saved to ' + handle.name);
    } catch (err) {
      if (err.name !== 'AbortError') console.warn(err);
    }
  };

  saveBtn.addEventListener('click', (e) => { e.preventDefault(); saveDirect(); });
  // Alt-click (or right-click) = Save As
  saveBtn.addEventListener('contextmenu', (e) => { e.preventDefault(); saveAs(); });
  saveBtn.title = 'Save · Right-click to Save As';

  // Cmd/Ctrl-S
  document.addEventListener('keydown', (e) => {
    if (!editing) return;
    if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      saveDirect();
    }
  });

})();
