// Improved lightbox: caption animation and keyboard navigation
(function(){
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('.caption');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.nav.prev');
  const nextBtn = lightbox.querySelector('.nav.next');

  const figures = Array.from(document.querySelectorAll('figure img'));
  let currentIndex = -1;

  function showIndex(i){
    if(i < 0 || i >= figures.length) return;
    const el = figures[i];
    const src = el.dataset.full || el.src;
    const alt = el.alt || el.closest('figure')?.querySelector('figcaption')?.textContent || '';
    // update image and caption
    lbImg.src = src;
    lbImg.alt = alt;
    // animate caption
    lbCaption.classList.remove('show');
    // small delay to allow transition when replacing text
    requestAnimationFrame(()=>{
      lbCaption.textContent = alt;
      requestAnimationFrame(()=> lbCaption.classList.add('show'));
    });
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    currentIndex = i;
    // focus close for keyboard users
    closeBtn.focus();
  }

  function openFromElement(el){
    const i = figures.indexOf(el);
    if(i !== -1) showIndex(i);
  }

  function close(){
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = '';
    lbCaption.textContent = '';
    lbCaption.classList.remove('show');
    document.body.style.overflow = '';
    currentIndex = -1;
  }

  function next(){
    if(figures.length === 0) return;
    const ni = (currentIndex + 1) % figures.length;
    showIndex(ni);
  }

  function prev(){
    if(figures.length === 0) return;
    const pi = (currentIndex - 1 + figures.length) % figures.length;
    showIndex(pi);
  }

  // click figures to open
  document.addEventListener('click', function(e){
    const img = e.target.closest('figure img');
    if(img){
      openFromElement(img);
    }
  });

  // close handlers (overlay click or close button)
  lightbox.addEventListener('click', function(e){
    if(e.target === lightbox || e.target.classList.contains('close')) close();
  });

  // nav buttons
  if(prevBtn) prevBtn.addEventListener('click', function(e){ e.stopPropagation(); prev(); });
  if(nextBtn) nextBtn.addEventListener('click', function(e){ e.stopPropagation(); next(); });

  // keyboard navigation
  document.addEventListener('keydown', function(e){
    if(lightbox.style.display !== 'flex') return;
    if(e.key === 'Escape') { close(); return; }
    if(e.key === 'ArrowRight') { next(); return; }
    if(e.key === 'ArrowLeft') { prev(); return; }
  });
})();
