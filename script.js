// ===== FRENCH TRAVEL - JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking a link
  document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ===== HERO SLIDER =====
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots .dot');
  let currentSlide = 0;
  let heroInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  // Auto advance
  function startHeroSlider() {
    heroInterval = setInterval(nextSlide, 5000);
  }

  startHeroSlider();

  // Dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(heroInterval);
      goToSlide(index);
      startHeroSlider();
    });
  });

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.ceil(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    });
  }

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter animation when stats section is visible
        if (entry.target.closest('.stats') && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in class to animated elements
  const animatedElements = document.querySelectorAll(
    '.destino-card, .porque-item, .paquete-card, .video-card, .testimonio-card, .stat-item, .contacto-info, .contacto-form-wrapper, .video-nota'
  );

  animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Also observe stats section
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // ===== PAQUETES FILTER =====
  const filterBtns = document.querySelectorAll('.filtro-btn');
  const paqueteCards = document.querySelectorAll('.paquete-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      paqueteCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'todos' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ===== TESTIMONIOS SLIDER =====
  const testiTrack = document.getElementById('testimoniosTrack');
  const testiCards = document.querySelectorAll('.testimonio-card');
  const testiPrev = document.getElementById('testiPrev');
  const testiNext = document.getElementById('testiNext');
  const testiDotsContainer = document.getElementById('testiDots');

  let testiIndex = 0;
  let testiPerView = 3;
  let testiAutoInterval;

  function updateTestiPerView() {
    if (window.innerWidth <= 768) {
      testiPerView = 1;
    } else if (window.innerWidth <= 1024) {
      testiPerView = 2;
    } else {
      testiPerView = 3;
    }
  }

  function getTotalTestiPages() {
    return Math.ceil(testiCards.length / testiPerView);
  }

  function createTestiDots() {
    testiDotsContainer.innerHTML = '';
    const totalPages = getTotalTestiPages();
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        testiIndex = i;
        updateTestiSlider();
        resetTestiAuto();
      });
      testiDotsContainer.appendChild(dot);
    }
  }

  function updateTestiSlider() {
    const totalPages = getTotalTestiPages();
    if (testiIndex >= totalPages) testiIndex = 0;
    if (testiIndex < 0) testiIndex = totalPages - 1;

    const cardWidth = testiCards[0].offsetWidth + 20; // card width + margin
    const offset = testiIndex * testiPerView * cardWidth;
    testiTrack.style.transform = `translateX(-${offset}px)`;

    // Update dots
    const dots = testiDotsContainer.querySelectorAll('.dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === testiIndex);
    });
  }

  function resetTestiAuto() {
    clearInterval(testiAutoInterval);
    testiAutoInterval = setInterval(() => {
      testiIndex++;
      updateTestiSlider();
    }, 5000);
  }

  testiNext.addEventListener('click', () => {
    testiIndex++;
    updateTestiSlider();
    resetTestiAuto();
  });

  testiPrev.addEventListener('click', () => {
    testiIndex--;
    updateTestiSlider();
    resetTestiAuto();
  });

  // Initialize testimonios
  updateTestiPerView();
  createTestiDots();
  resetTestiAuto();

  // Recalculate on resize
  window.addEventListener('resize', () => {
    updateTestiPerView();
    createTestiDots();
    testiIndex = 0;
    updateTestiSlider();
  });

  // ===== VIDEO MODAL =====
  const videoPlaceholders = document.querySelectorAll('.video-placeholder');
  const videoModal = document.getElementById('videoModal');

  videoPlaceholders.forEach(placeholder => {
    placeholder.addEventListener('click', () => {
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // ===== SMOOTH SCROLL for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ===== PARALLAX EFFECT ON HERO =====
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrolled / 700);
    }
  });

});

// ===== GLOBAL FUNCTIONS =====

// Close video modal
function closeVideoModal() {
  const videoModal = document.getElementById('videoModal');
  videoModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVideoModal();
  }
});

// Newsletter subscription
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const email = input.value;

  if (email) {
    // Show success message
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ¡Suscrito!';
    btn.style.background = '#2d5a27';
    input.value = '';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 3000);
  }
}

// Contact form submission
function enviarFormulario(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('.btn-submit');
  const originalText = btn.innerHTML;

  // Simulate sending
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Enviado con éxito!';
    btn.style.background = '#2d5a27';

    // Show thank you message
    const thankYou = document.createElement('div');
    thankYou.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;';
    thankYou.innerHTML = `
      <div style="background:white;padding:50px;border-radius:20px;text-align:center;max-width:450px;margin:20px;animation:fadeUp 0.5s ease;">
        <div style="font-size:4rem;color:#b8860b;margin-bottom:20px;">✈️</div>
        <h2 style="font-family:'Playfair Display',serif;margin-bottom:15px;color:#1a1a1a;">¡Gracias por contactarnos!</h2>
        <p style="color:#6b6b6b;margin-bottom:25px;line-height:1.6;">Hemos recibido tu solicitud. Un asesor de French Travel se pondrá en contacto contigo en las próximas 24 horas para ayudarte a planear tu viaje soñado.</p>
        <button onclick="this.closest('div[style]').parentElement.remove()" style="background:#b8860b;color:white;border:none;padding:12px 30px;border-radius:50px;font-size:1rem;font-weight:700;cursor:pointer;font-family:'Lato',sans-serif;">Entendido</button>
      </div>
    `;
    document.body.appendChild(thankYou);

    // Reset form
    form.reset();

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 2000);
}

// ===== TOUCH/SWIPE SUPPORT FOR TESTIMONIOS =====
(function() {
  const slider = document.getElementById('testimoniosSlider');
  if (!slider) return;

  let startX = 0;
  let isDragging = false;

  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
  });

  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        document.getElementById('testiNext').click();
      } else {
        document.getElementById('testiPrev').click();
      }
    }
  });
})();
