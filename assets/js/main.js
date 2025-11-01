// Mobile nav toggle and small helpers
(function(){
  const toggle = document.querySelector('[data-menu-toggle]');
  const header = document.querySelector('[data-nav]');
  const nav = document.querySelector('.nav');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  if(!toggle || !header) return;
  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    nav.style.display = open ? 'flex' : 'none';
  });

  // Smooth scroll for same-page links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id && id.startsWith('#') && id.length > 1){
        const el = document.querySelector(id);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth'});
          header.classList.remove('open');
          toggle.setAttribute('aria-expanded','false');
          nav.style.display = 'none';
        }
      }
    })
  })
})();

// FAQ accordion: accessible, animated open/close
(function(){
  const faq = document.getElementById('faq');
  if(!faq) return;
  const items = faq.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const panel = item.querySelector('.faq-answer');
    if(!btn || !panel) return;
    // ensure panel initial state
    panel.style.transition = 'height .28s ease, opacity .22s ease';
    panel.style.height = '0px';
    panel.style.opacity = '0';
    btn.addEventListener('click', ()=>{
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // close all siblings (accordion behaviour)
      items.forEach(sib => {
        const sBtn = sib.querySelector('.faq-question');
        const sPanel = sib.querySelector('.faq-answer');
        if(!sBtn || !sPanel) return;
        if(sib !== item){
          sBtn.setAttribute('aria-expanded','false');
          sib.classList.remove('open');
          sPanel.style.height = '0px';
          sPanel.style.opacity = '0';
          sPanel.setAttribute('hidden','');
        }
      });

      if(isOpen){
        // close
        btn.setAttribute('aria-expanded','false');
        item.classList.remove('open');
        panel.style.height = '0px';
        panel.style.opacity = '0';
        // hide after transition
        setTimeout(()=> panel.setAttribute('hidden',''), 300);
      } else {
        // open
        btn.setAttribute('aria-expanded','true');
        item.classList.add('open');
        panel.removeAttribute('hidden');
        // set to scrollHeight for transition
        requestAnimationFrame(()=>{
          const full = panel.scrollHeight + 'px';
          panel.style.height = full;
          panel.style.opacity = '1';
        });
      }
    });
    // keyboard: allow Enter/Space to toggle
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); btn.click(); }
    });
  });
})();
  // Optional content loader: if window.HIMMA_CONTENT exists (from content/data.js), fill fields
  (function(){
    const C = window.HIMMA_CONTENT;
    if(!C) return; // nothing to do

    // Site-wide contact
    const email = document.getElementById('contact-email');
    const phone = document.getElementById('contact-phone');
    const address = document.getElementById('contact-address');
    if(email && C.site?.email) email.textContent = C.site.email;
    if(phone && C.site?.phone) phone.textContent = C.site.phone;
    if(address && C.site?.address) address.textContent = C.site.address;

    // Landing
    const heroTitle = document.getElementById('hero-title');
    const heroBody = document.getElementById('hero-body');
    if(heroTitle && C.landing?.heroTitle) heroTitle.textContent = C.landing.heroTitle;
    if(heroBody && C.landing?.heroBody) heroBody.textContent = C.landing.heroBody;
    const cardCoffeeTitle = document.getElementById('card-coffee-title');
    const cardCoffeeBody = document.getElementById('card-coffee-body');
    if(cardCoffeeTitle && C.landing?.cards?.coffee?.title) cardCoffeeTitle.textContent = C.landing.cards.coffee.title;
    if(cardCoffeeBody && C.landing?.cards?.coffee?.body) cardCoffeeBody.textContent = C.landing.cards.coffee.body;
    const cardMachinesTitle = document.getElementById('card-machines-title');
    const cardMachinesBody = document.getElementById('card-machines-body');
    if(cardMachinesTitle && C.landing?.cards?.machines?.title) cardMachinesTitle.textContent = C.landing.cards.machines.title;
    if(cardMachinesBody && C.landing?.cards?.machines?.body) cardMachinesBody.textContent = C.landing.cards.machines.body;
    const cardMaterialsTitle = document.getElementById('card-materials-title');
    const cardMaterialsBody = document.getElementById('card-materials-body');
    if(cardMaterialsTitle && C.landing?.cards?.materials?.title) cardMaterialsTitle.textContent = C.landing.cards.materials.title;
    if(cardMaterialsBody && C.landing?.cards?.materials?.body) cardMaterialsBody.textContent = C.landing.cards.materials.body;
    const aboutBullets = document.getElementById('about-bullets');
    if(aboutBullets && Array.isArray(C.landing?.aboutBullets)){
      aboutBullets.innerHTML = C.landing.aboutBullets.map(t => `<li>${t}</li>`).join('');
    }

    // Coffee page
    const coffee = C.coffee || {};
    const ct = document.getElementById('coffee-title');
    const ci = document.getElementById('coffee-intro');
    const cw = document.getElementById('coffee-what');
    const cs = document.getElementById('coffee-sidebar');
    const cm = document.getElementById('coffee-markets');
    const cta = document.getElementById('coffee-cta');
    if(ct && coffee.title) ct.textContent = coffee.title;
    if(ci && coffee.intro) ci.textContent = coffee.intro;
    if(cw && Array.isArray(coffee.what)) cw.innerHTML = coffee.what.map(t=>`<li>${t}</li>`).join('');
    if(cs && coffee.sidebar) cs.textContent = coffee.sidebar;
    if(cm && coffee.markets) cm.textContent = coffee.markets;
    if(cta && coffee.cta) cta.textContent = coffee.cta;
    const ch = coffee.highlights || [];
    const ch1 = document.getElementById('coffee-h1');
    const ch1p = document.getElementById('coffee-h1p');
    const ch2 = document.getElementById('coffee-h2');
    const ch2p = document.getElementById('coffee-h2p');
    const ch3 = document.getElementById('coffee-h3');
    const ch3p = document.getElementById('coffee-h3p');
    if(ch[0]){ if(ch1) ch1.textContent = ch[0].title; if(ch1p) ch1p.textContent = ch[0].text; }
    if(ch[1]){ if(ch2) ch2.textContent = ch[1].title; if(ch2p) ch2p.textContent = ch[1].text; }
    if(ch[2]){ if(ch3) ch3.textContent = ch[2].title; if(ch3p) ch3p.textContent = ch[2].text; }

    // Machines page
    const m = C.machines || {};
    const mt = document.getElementById('machines-title');
    const mi = document.getElementById('machines-intro');
    const mr = document.getElementById('machines-range');
    const ms = document.getElementById('machines-sidebar');
    const mcta = document.getElementById('machines-cta');
    if(mt && m.title) mt.textContent = m.title;
    if(mi && m.intro) mi.textContent = m.intro;
    if(mr && Array.isArray(m.range)) mr.innerHTML = m.range.map(t=>`<li>${t}</li>`).join('');
    if(ms && m.sidebar) ms.textContent = m.sidebar;
    if(mcta && m.cta) mcta.textContent = m.cta;
    const ms1 = document.getElementById('machines-h1');
    const ms1p = document.getElementById('machines-h1p');
    const ms2 = document.getElementById('machines-h2');
    const ms2p = document.getElementById('machines-h2p');
    const ms3 = document.getElementById('machines-h3');
    const ms3p = document.getElementById('machines-h3p');
    if(m.support?.[0]){ if(ms1) ms1.textContent = m.support[0].title; if(ms1p) ms1p.textContent = m.support[0].text; }
    if(m.support?.[1]){ if(ms2) ms2.textContent = m.support[1].title; if(ms2p) ms2p.textContent = m.support[1].text; }
    if(m.support?.[2]){ if(ms3) ms3.textContent = m.support[2].title; if(ms3p) ms3p.textContent = m.support[2].text; }

    // Materials page
    const r = C.materials || {};
    const rt = document.getElementById('materials-title');
    const ri = document.getElementById('materials-intro');
    const rp = document.getElementById('materials-products');
    const rs = document.getElementById('materials-sidebar');
    const rcta = document.getElementById('materials-cta');
    if(rt && r.title) rt.textContent = r.title;
    if(ri && r.intro) ri.textContent = r.intro;
    if(rp && Array.isArray(r.products)) rp.innerHTML = r.products.map(t=>`<li>${t}</li>`).join('');
    if(rs && r.sidebar) rs.textContent = r.sidebar;
    if(rcta && r.cta) rcta.textContent = r.cta;
    const r1 = document.getElementById('materials-h1');
    const r1p = document.getElementById('materials-h1p');
    const r2 = document.getElementById('materials-h2');
    const r2p = document.getElementById('materials-h2p');
    const r3 = document.getElementById('materials-h3');
    const r3p = document.getElementById('materials-h3p');
    if(r.value?.[0]){ if(r1) r1.textContent = r.value[0].title; if(r1p) r1p.textContent = r.value[0].text; }
    if(r.value?.[1]){ if(r2) r2.textContent = r.value[1].title; if(r2p) r2p.textContent = r.value[1].text; }
    if(r.value?.[2]){ if(r3) r3.textContent = r.value[2].title; if(r3p) r3p.textContent = r.value[2].text; }
  })();

  // WhatsApp floating button
  (function(){
    function onlyDigits(s){return (s||'').replace(/\D+/g,'');}
    // Prefer number from Contact section if present; then site.whatsapp; then site.phone; then cached value
    var domPhoneEl = document.getElementById('contact-phone');
    var domPhone = domPhoneEl ? (domPhoneEl.textContent||'').trim() : '';
    var number = domPhone || (window.HIMMA_CONTENT?.site?.whatsapp) || (window.HIMMA_CONTENT?.site?.phone) || localStorage.getItem('himma:phone') || '';
    if(domPhone) try{ localStorage.setItem('himma:phone', domPhone); }catch(e){}
    var clean = onlyDigits(number);
    var defaultMsg = window.HIMMA_CONTENT?.site?.whatsappMessage || 'Hello, I would like to know more about Himma Group.';
    var url = clean ? ('https://wa.me/' + clean + '?text=' + encodeURIComponent(defaultMsg)) : null;

    var a = document.createElement('a');
    a.className = 'whatsapp-fab';
    a.setAttribute('aria-label','Chat on WhatsApp');
    a.setAttribute('title','Chat on WhatsApp');
    if(url){
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
    }else{
      a.href = '#';
      a.addEventListener('click', function(e){
        e.preventDefault();
        alert('WhatsApp number not configured. Set site.whatsapp in content/data.js');
      });
    }
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.41 0 .06 5.35.06 11.96c0 2.1.56 4.16 1.62 5.97L0 24l6.24-1.64a11.95 11.95 0 0 0 5.78 1.48h.01c6.6 0 11.96-5.35 11.96-11.96 0-3.2-1.25-6.2-3.47-8.4Zm-8.5 18.5h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.7.97.99-3.61-.23-.37a9.92 9.92 0 0 1-1.52-5.29c0-5.48 4.46-9.93 9.95-9.93 2.65 0 5.15 1.03 7.03 2.9a9.86 9.86 0 0 1 2.9 7.03c0 5.48-4.46 9.93-9.95 9.93Zm5.67-7.44c-.31-.16-1.84-.9-2.13-1-.29-.11-.5-.16-.71.16-.21.32-.81 1-.99 1.21-.18.21-.37.24-.68.08-.31-.16-1.32-.49-2.51-1.56-.93-.83-1.55-1.86-1.73-2.17-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.36-.26-.63-.53-.54-.71-.55-.18-.01-.39-.01-.6-.01-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63 0 1.55 1.12 3.05 1.28 3.26.16.21 2.2 3.36 5.33 4.71.75.33 1.34.53 1.8.68.76.24 1.46.21 2.01.13.61-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.6-.37Z"/></svg>';
    document.body.appendChild(a);
  })();

  // Reveal-on-scroll using IntersectionObserver
  (function(){
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReduced || !('IntersectionObserver' in window)) return;
    const candidates = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-card');
    if(!candidates.length) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.style.animationPlayState = 'running';
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12, rootMargin:'0px 0px -10% 0px'});
    candidates.forEach(el=>{
      // Pause until visible
      el.style.animationPlayState = 'paused';
      io.observe(el);
    });
  })();

  // Enhanced hero slider with controls, dots, swipe and accessible fallbacks
  (function(){
    const slider = document.querySelector('[data-slider]');
    if(!slider) return;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    slider.setAttribute('role','region');
    slider.setAttribute('aria-roledescription','carousel');
    if(!slider.hasAttribute('aria-label')) slider.setAttribute('aria-label','Hero highlights');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    if(slides.length < 2) return;
    const autoPlay = slider.dataset.autoplay === 'true' && !prefersReducedMotion;
    slider.setAttribute('aria-live', autoPlay ? 'off' : 'polite');

    // Build controls (prev/next)
    const prevBtn = document.createElement('button'); prevBtn.className='slider-control prev'; prevBtn.setAttribute('aria-label','Previous slide'); prevBtn.innerHTML='‹';
    const nextBtn = document.createElement('button'); nextBtn.className='slider-control next'; nextBtn.setAttribute('aria-label','Next slide'); nextBtn.innerHTML='›';
    slider.appendChild(prevBtn); slider.appendChild(nextBtn);
    // Ensure safe arrow glyphs regardless of file encoding
    try{ prevBtn.textContent = '‹'; nextBtn.textContent = '›'; }catch(e){}

    // Build dots
    const dotsWrap = document.createElement('div'); dotsWrap.className='slider-dots';
    slides.forEach((s,i)=>{
      const d = document.createElement('button'); d.className='dot'; d.setAttribute('aria-label','Go to slide '+(i+1));
      if(s.classList.contains('active')) d.classList.add('active');
      dotsWrap.appendChild(d);
      d.addEventListener('click', ()=> goTo(i));
    });
    slider.appendChild(dotsWrap);

    let idx = slides.findIndex(s=>s.classList.contains('active')); if(idx<0) idx=0;
    let paused = !autoPlay; let touching=false; let startX=0,deltaX=0; const INTERVAL=6000; let timer=null;

    const heroTitleEl = document.getElementById('hero-title');
    const heroBodyEl = document.getElementById('hero-body');
    const slidesInner = slider.querySelector('.slides-inner');
    function setActive(i){
      // Update active classes for ARIA/visuals
      slides.forEach((s,j)=> s.classList.toggle('active', j===i));
      Array.from(dotsWrap.children).forEach((d,j)=> d.classList.toggle('active', j===i));
      // Move the inner container using transform for better cross-browser behavior
      if(slidesInner){
        slidesInner.style.transform = 'translate3d(' + (-i*100) + '% , 0, 0)';
      }
      // Update hero title/body if data attributes present (with smooth crossfade)
      const s = slides[i];
      if(s){
        const t = s.getAttribute('data-title');
        const b = s.getAttribute('data-body');
        if(heroTitleEl && heroBodyEl){
          // add fading class
          heroTitleEl.classList.add('fade-text','fading');
          heroBodyEl.classList.add('fade-text','fading');
          // after transition, swap text and remove fading
          setTimeout(()=>{
            if(t) heroTitleEl.textContent = t;
            if(b) heroBodyEl.textContent = b;
            heroTitleEl.classList.remove('fading');
            heroBodyEl.classList.remove('fading');
          }, 320);
        } else {
          if(heroTitleEl && t) heroTitleEl.textContent = t;
          if(heroBodyEl && b) heroBodyEl.textContent = b;
        }
      }
    }
    function goTo(i){ idx = (i+slides.length)%slides.length; setActive(idx); }
    function next(){ goTo(idx+1); }
    function prev(){ goTo(idx-1); }

    prevBtn.addEventListener('click', ()=>{ prev(); restartTimer(); });
    nextBtn.addEventListener('click', ()=>{ next(); restartTimer(); });

    function startTimer(){ if(!autoPlay || timer) return; timer = setInterval(()=>{ if(!paused) next(); }, INTERVAL); }
    function stopTimer(){ if(timer){ clearInterval(timer); timer=null; } }
    function restartTimer(){ if(!autoPlay) return; stopTimer(); startTimer(); }

    // Pause on hover/focus
    slider.addEventListener('mouseenter', ()=>{ paused=true; });
    slider.addEventListener('mouseleave', ()=>{ paused=false; });
    slider.addEventListener('focusin', ()=>{ paused=true; });
    slider.addEventListener('focusout', ()=>{ paused=false; });

    // Keyboard navigation
    slider.addEventListener('keydown', (e)=>{
      if(e.key==='ArrowLeft') { prev(); restartTimer(); }
      if(e.key==='ArrowRight') { next(); restartTimer(); }
    });

    // Touch / swipe support
    slider.addEventListener('touchstart', (e)=>{ touching=true; paused=true; startX = e.touches[0].clientX; deltaX=0; }, {passive:true});
    slider.addEventListener('touchmove', (e)=>{ if(!touching) return; deltaX = e.touches[0].clientX - startX; }, {passive:true});
    slider.addEventListener('touchend', ()=>{
      touching=false; paused=false;
      if(Math.abs(deltaX) > 40){ if(deltaX > 0) prev(); else next(); restartTimer(); }
      deltaX=0;
    });

    // Initialize
    setActive(idx);
    if(autoPlay) startTimer();
    // expose for debugging
    slider._himma = { next, prev, goTo, startTimer, stopTimer };
  })();

  // Progressive polish: enhance cards with full-bleed images and fix common mojibake
  (function(){
    // Promote inline thumbs to full-bleed headers
    document.querySelectorAll('.cards .card').forEach(card => {
      const thumb = card.querySelector('img.thumb');
      if(thumb && !card.querySelector('.card-top-image')){
        const top = document.createElement('img');
        top.className = 'card-top-image';
        top.loading = 'lazy';
        top.src = thumb.currentSrc || thumb.src;
        top.alt = thumb.alt || '';
        card.insertBefore(top, card.firstChild);
        card.classList.add('has-card-top-image');
      }
    });

    // Fix page titles or visible texts if misencoded glyphs are detected
    const fixGlyphs = (s)=> s.replace(/�?T/g, '’').replace(/�?"/g, '—').replace(/�?`/g, '-');
    if(document.title.includes('�')){
      // Set a clean, attractive default title per page
      if(document.getElementById('coffee-title')){
        document.title = 'Coffee Export | Himma Group';
      } else if(document.getElementById('machines-title')){
        document.title = 'Bakery Machinery & Food Imports | Himma Group';
      } else if(document.getElementById('materials-title')){
        document.title = 'Bakery Raw Materials | Himma Group';
      } else {
        document.title = 'Himma Group | Coffee Export | Bakery Machinery | Raw Materials';
      }
    }
    const heroTitle = document.getElementById('hero-title');
    const heroBody  = document.getElementById('hero-body');
    if(heroTitle && heroTitle.textContent.includes('�')) heroTitle.textContent = "Connecting Ethiopia's Finest Products to the World";
    if(heroBody && heroBody.textContent.includes('�')) heroBody.textContent = "Welcome to Himma Group, a dynamic Ethiopian company dedicated to excellence in global trade. We export the finest Ethiopian green coffee from the country's most celebrated origins and supply high-quality bakery machinery and food products across Ethiopia. Our commitment to quality, integrity, and sustainability defines everything we do, from our washing station in Guji to our trusted partnerships around the world.";
    // Footer copyright fix
    document.querySelectorAll('footer .wp-block-group').forEach(el=>{
      el.innerHTML = el.innerHTML.replace(/>Ac /,'>© ');
    });
  })();

// Global image fallback to a placeholder PNG
(function(){
  const PLACEHOLDER_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  const applyFallback = (img)=>{
    if(!img || img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.src = PLACEHOLDER_PNG;
    if(!img.alt) img.alt = 'Image unavailable';
  };
  const imgs = document.querySelectorAll('img');
  imgs.forEach(img => {
    if(img.complete && img.naturalWidth === 0){ applyFallback(img); }
    img.addEventListener('error', ()=> applyFallback(img), { once:false });
  });
})();

// Page-specific small fixes
(function(){
  // If on machines page and hero image is a missing SVG, switch to PNG asset
  const machinesTitle = document.getElementById('machines-title');
  const heroImg = document.querySelector('.hero img.hero-image');
  if(machinesTitle && heroImg && /machines\.svg(\?.*)?$/i.test(heroImg.getAttribute('src')||'')){
    heroImg.src = '../assets/img/machines.png';
  }
})();




