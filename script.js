document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. PARTICLE CANVAS — floating star field
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const randomBetween = (a, b) => a + Math.random() * (b - a);

    const COLORS = ['rgba(168,85,247,', 'rgba(6,182,212,', 'rgba(244,114,182,', 'rgba(52,211,153,'];

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x    = randomBetween(0, canvas.width);
        this.y    = randomBetween(0, canvas.height);
        this.r    = randomBetween(0.4, 1.6);
        this.vx   = randomBetween(-0.15, 0.15);
        this.vy   = randomBetween(-0.15, 0.15);
        this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.life = randomBetween(0.3, 1);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.col + this.life + ')';
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = Array.from({ length: 120 }, () => new Particle());
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(loop);
    };

    init();
    loop();
    window.addEventListener('resize', () => { resize(); });
  }

  /* ==========================================================================
     2. GLASS CARD MOUSE TRACKING — spotlight glow
     ========================================================================== */
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  /* ==========================================================================
     3. DYNAMIC TYPING EFFECT
     ========================================================================== */
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const roles = [
      'Full-Stack Developer',
      'Creative UI/UX Designer',
      'Problem Solver',
      'Tech Enthusiast'
    ];
    let roleIndex = 0, charIndex = 0, isDeleting = false, speed = 100;

    const type = () => {
      const cur = roles[roleIndex];
      typingElement.textContent = isDeleting
        ? cur.substring(0, charIndex - 1)
        : cur.substring(0, charIndex + 1);

      if (isDeleting) {
        charIndex--;
        speed = 45;
      } else {
        charIndex++;
        speed = 100;
      }

      if (!isDeleting && charIndex === cur.length) {
        speed = 2200; isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 500;
      }
      setTimeout(type, speed);
    };
    setTimeout(type, 1000);
  }

  /* ==========================================================================
     4. STICKY HEADER & BACK-TO-TOP
     ========================================================================== */
  const header     = document.getElementById('main-header');
  const backToTop  = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
    if (backToTop) {
      if (window.scrollY > 500) {
        backToTop.style.display  = 'flex';
        backToTop.style.opacity  = '1';
      } else {
        backToTop.style.opacity  = '0';
        setTimeout(() => {
          if (window.scrollY <= 500) backToTop.style.display = 'none';
        }, 300);
      }
    }
  });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ==========================================================================
     5. THEME TOGGLE
     ========================================================================== */
  const themeBtn  = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const saved     = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', saved);
  if (saved === 'light') themeIcon?.classList.replace('fa-moon', 'fa-sun');

  themeBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next   = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    themeIcon?.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', next);
  });

  /* ==========================================================================
     6. MOBILE MENU
     ========================================================================== */
  const mobileBtn = document.getElementById('mobile-toggle-btn');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  mobileBtn?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    mobileBtn.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars-staggered"></i>';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      if (mobileBtn) mobileBtn.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
    });
  });

  /* ==========================================================================
     7. PROJECT FILTERING
     ========================================================================== */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const match = val === 'all' || card.getAttribute('data-category') === val;
        card.classList.toggle('hide', !match);
        card.classList.toggle('show', match);
      });
    });
  });

  /* ==========================================================================
     8. NAV ACTIVE HIGHLIGHT (SCROLL OBSERVER)
     ========================================================================== */
  const isProjectsPage = window.location.pathname.includes('projects.html');

  if (!isProjectsPage) {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-20% 0px -40% 0px' });

    sections.forEach(s => observer.observe(s));
  } else {
    const projectsLink = document.getElementById('link-projects');
    navLinks.forEach(l => l.classList.remove('active'));
    projectsLink?.classList.add('active');
  }

  /* ==========================================================================
     9. TIMELINE ENTRANCE ANIMATIONS
     ========================================================================== */
  const timelineItems = document.querySelectorAll('.animate-timeline');
  const tlObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  timelineItems.forEach(item => tlObserver.observe(item));

  /* ==========================================================================
     10. CONTACT FORM VALIDATION
     ========================================================================== */
  const form       = document.getElementById('contact-form');
  const nameInput  = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const msgInput   = document.getElementById('form-message');
  const submitBtn  = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('form-success-msg');

  [nameInput, emailInput, msgInput].forEach(inp => {
    inp?.addEventListener('input', () => inp.parentElement.classList.remove('has-error'));
  });

  const validEmail = e => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(e).toLowerCase());

  form?.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim())               { nameInput.parentElement.classList.add('has-error');  valid = false; }
    if (!validEmail(emailInput.value))         { emailInput.parentElement.classList.add('has-error'); valid = false; }
    if (!msgInput.value.trim())                { msgInput.parentElement.classList.add('has-error');   valid = false; }

    if (valid) {
      submitBtn.disabled = true;
      const orig = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending <i class="fa-solid fa-spinner fa-spin"></i>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = orig;
        successMsg.style.display = 'flex';
        form.reset();

        setTimeout(() => {
          successMsg.style.opacity = '0';
          successMsg.style.transition = 'opacity 0.3s';
          setTimeout(() => {
            successMsg.style.display = 'none';
            successMsg.style.opacity = '';
          }, 300);
        }, 4000);
      }, 1500);
    }
  });

  /* ==========================================================================
     11. SCROLL REVEAL FADE-UP
     ========================================================================== */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    fadeEls.forEach(el => revealObs.observe(el));
  }

  /* ==========================================================================
     12. 3D TILT EFFECT
     ========================================================================== */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2, cy = r.height / 2;
      const rx = ((cy - y) / cy) * 10;
      const ry = ((x - cx) / cx) * 10;
      card.style.transition = 'none';
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });

});
