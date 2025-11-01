// Dark Mode Toggle
(function(){
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = themeToggle?.querySelector('.sun-icon');
  const moonIcon = themeToggle?.querySelector('.moon-icon');

  // Check for saved theme preference or default to 'light' mode
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply the saved or default theme
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Update icon based on current theme
  function updateIcon(theme) {
    if (!sunIcon || !moonIcon) return;
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  updateIcon(currentTheme);

  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);

      // Add a small rotation animation
      themeToggle.querySelector('svg').style.transform = 'rotate(360deg)';
      setTimeout(() => {
        themeToggle.querySelector('svg').style.transform = 'rotate(0deg)';
      }, 300);
    });
  }
})();

// Mobile menu toggle and year
(function(){
  const toggle = document.querySelector('[data-menu-toggle]');
  const header = document.querySelector('[data-nav]');
  const nav = document.querySelector('.nav');
  const year = document.getElementById('year');
  
  if (year) year.textContent = new Date().getFullYear();
  
  if (toggle && header && nav) {
    toggle.addEventListener('click', ()=>{
      const open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      
      // Animate hamburger icon
      const spans = toggle.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
    
    // Close menu when clicking nav links
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }
})();

// Full-width hero slider
(function() {
  const slider = document.querySelector('.hero-slider-fullwidth');
  if (!slider) return;
  
  const slides = slider.querySelectorAll('.slide');
  const indicators = slider.querySelectorAll('.indicator');
  const prevBtn = slider.querySelector('.slider-nav.prev');
  const nextBtn = slider.querySelector('.slider-nav.next');
  
  let currentIndex = 0;
  let autoplayInterval;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }
  
  function nextSlide() {
    const newIndex = (currentIndex + 1) % slides.length;
    showSlide(newIndex);
  }
  
  function prevSlide() {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  }
  
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }
  
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }
  
  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
    startAutoplay();
  });
  
  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
    startAutoplay();
  });
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSlide(index);
      stopAutoplay();
      startAutoplay();
    });
  });
  
  // Start autoplay
  startAutoplay();
  
  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
})();

// Advanced Image Lazy Loading with WebP Support
(function() {
  // Check if browser supports IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers - load all images immediately
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    });
    return;
  }

  // Check WebP support
  function checkWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Lazy load images
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }

        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }

        // Add loaded class for fade-in animation
        img.classList.add('lazy-loaded');

        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px', // Start loading 50px before image enters viewport
    threshold: 0.01
  });

  // Observe all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });

  // Initialize WebP support check
  checkWebPSupport().then(supportsWebP => {
    document.documentElement.classList.add(supportsWebP ? 'webp' : 'no-webp');
  });
})();

// Advanced Scroll Animations
(function() {
  if (!('IntersectionObserver' in window)) return;

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Optional: unobserve after animation to prevent re-triggering
        // animateOnScroll.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Add animation classes to elements
  document.querySelectorAll('.card, .feature-grid, .section-title, .hero p').forEach(el => {
    el.classList.add('animate-on-scroll');
    animateOnScroll.observe(el);
  });
})();

// Performance: Preload critical resources
(function() {
  // Preload hero images
  const heroImages = document.querySelectorAll('.hero-slider-fullwidth .slide');
  if (heroImages.length > 0) {
    const firstSlideImg = heroImages[0].style.backgroundImage;
    if (firstSlideImg) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = firstSlideImg.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1];
      if (link.href) document.head.appendChild(link);
    }
  }
})();

// Google Analytics Event Tracking
(function() {
  if (typeof window.trackEvent !== 'function') return;

  // Track button clicks
  document.querySelectorAll('.btn, .button').forEach(btn => {
    btn.addEventListener('click', function() {
      window.trackEvent('button_click', {
        button_text: this.textContent.trim(),
        button_location: window.location.pathname
      });
    });
  });

  // Track WhatsApp button
  const whatsappBtn = document.querySelector('.whatsapp-fab');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      window.trackEvent('whatsapp_click', {
        location: window.location.pathname
      });
    });
  }

  // Track theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme');
      window.trackEvent('theme_toggle', {
        theme: theme === 'dark' ? 'light' : 'dark'
      });
    });
  }

  // Track navigation clicks
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', function() {
      window.trackEvent('navigation_click', {
        link_text: this.textContent.trim(),
        link_url: this.href
      });
    });
  });

  // Track scroll depth
  let maxScroll = 0;
  let scrollTracked = {25: false, 50: false, 75: false, 100: false};

  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;

      Object.keys(scrollTracked).forEach(threshold => {
        if (scrollPercent >= threshold && !scrollTracked[threshold]) {
          scrollTracked[threshold] = true;
          window.trackEvent('scroll_depth', {
            percent: threshold,
            page: window.location.pathname
          });
        }
      });
    }
  });

  // Track form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      window.trackEvent('form_submit', {
        form_id: this.id || 'contact_form',
        page: window.location.pathname
      });
    });
  });
})();

// Image Lightbox Gallery
(function() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  // Create lightbox HTML structure
  const lightboxHTML = `
    <div class="lightbox-overlay" id="lightbox">
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">×</button>
        <button class="lightbox-nav prev" aria-label="Previous image">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <img class="lightbox-image" src="" alt="">
        <button class="lightbox-nav next" aria-label="Next image">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <div class="lightbox-counter"></div>
      </div>
    </div>
  `;

  // Add lightbox to page
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav.next');
  const counter = lightbox.querySelector('.lightbox-counter');

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt || ''
  }));

  function showImage(index) {
    currentIndex = index;
    lightboxImage.src = images[index].src;
    lightboxImage.alt = images[index].alt;
    counter.textContent = `${index + 1} / ${images.length}`;

    // Track view in analytics
    if (typeof window.trackEvent === 'function') {
      window.trackEvent('gallery_view', {
        image_index: index + 1,
        total_images: images.length
      });
    }
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    const newIndex = (currentIndex + 1) % images.length;
    showImage(newIndex);
  }

  function prevImage() {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(newIndex);
  }

  // Event listeners
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', nextImage);
  prevBtn.addEventListener('click', prevImage);

  // Close on overlay click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
})();

// Animated counters when in view
(function(){
  const counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length === 0) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1200;
    const start = performance.now();
    const startVal = 0;

    function tick(now){
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(startVal + (target - startVal) * eased);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const seen = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !seen.has(entry.target)){
        seen.add(entry.target);
        animate(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => io.observe(c));
})();

// FAQ accordion
(function(){
  document.querySelectorAll('.accordion .accordion-item').forEach(item => {
    const btn = item.querySelector('.accordion-trigger');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
})();

// Machines page: gallery slider + dynamic manifest loading
(function(){
  const carousel = document.querySelector('[data-machines-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-track]');
  const prev = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');

  function scrollByAmount(dir = 1){
    const amount = Math.round(carousel.clientWidth * 0.85);
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }

  prev?.addEventListener('click', () => scrollByAmount(-1));
  next?.addEventListener('click', () => scrollByAmount(1));

  // Load image list from manifest and inject slides
  fetch('/static/img/machines-gallery/manifest.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : [])
    .then(list => {
      if (!Array.isArray(list)) list = [];
      list.forEach((file) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide gallery-item';
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = `/static/img/machines-gallery/${file}`;
        img.alt = 'Bakery equipment';
        slide.appendChild(img);
        track.appendChild(slide);
      });
    })
    .catch(()=>{});
})();
