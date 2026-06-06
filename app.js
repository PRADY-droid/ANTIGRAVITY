/* ==========================================================================
   Aura Cyber - Interactive Portfolio JS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Custom Cursor Trailing Effect
     ========================================================================== */
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate dot movement
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  // Smooth trailing logic using linear interpolation (lerp)
  function animateCursor() {
    const lerpFactor = 0.12; // Controls trailing lag
    cursorX += (mouseX - cursorX) * lerpFactor;
    cursorY += (mouseY - cursorY) * lerpFactor;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Custom Cursor Interactive Hover States
  const hoverElements = document.querySelectorAll('a, button, .project-card, .tab-btn, input, textarea');
  
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    elem.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
  /* ==========================================================================
     2. Interactive Canvas Particle Background
     ========================================================================== */
  const canvas = document.getElementById('canvas-bg');
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  let particleCount = 70;
  const connectionDistance = 120;
  
  // Mouse position tracker for canvas interactions
  let canvasMouse = {
    x: null,
    y: null,
    radius: 150
  };
  
  window.addEventListener('mousemove', (e) => {
    canvasMouse.x = e.clientX;
    canvasMouse.y = e.clientY;
  });
  
  window.addEventListener('mouseleave', () => {
    canvasMouse.x = null;
    canvasMouse.y = null;
  });
  
  // Resize handler
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Adjust density based on screen width
    if (window.innerWidth < 768) {
      particleCount = 35;
    } else {
      particleCount = 75;
    }
    initParticles();
  }
  
  // Particle definition
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Screen bounds bounce
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      
      // Mouse interaction (gentle attraction)
      if (canvasMouse.x !== null && canvasMouse.y !== null) {
        let dx = canvasMouse.x - this.x;
        let dy = canvasMouse.y - this.y;
        let distance = Math.hypot(dx, dy);
        
        if (distance < canvasMouse.radius) {
          const force = (canvasMouse.radius - distance) / canvasMouse.radius;
          this.x += (dx / distance) * force * 0.8;
          this.y += (dy / distance) * force * 0.8;
        }
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.fill();
    }
  }
  
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.hypot(dx, dy);
        
        if (distance < connectionDistance) {
          // Fade connection lines out based on distance
          let opacity = (connectionDistance - distance) / connectionDistance * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`; // Violet links
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateParticles();
  /* ==========================================================================
     3. Header Scroll Behavior & Sticky Navigation Highlight
     ========================================================================== */
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  // Active Link Switcher using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Triggers near screen center
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
  /* ==========================================================================
     4. Mobile Navigation Menu Toggle
     ========================================================================== */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuLinks = document.querySelectorAll('.nav-link');
  
  function toggleMenu() {
    menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  }
  
  menuToggle.addEventListener('click', toggleMenu);
  
  // Close menu when clicking a link
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
  /* ==========================================================================
     5. Tabs Component (About Section)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Deactivate current tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Activate target tab
      button.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
  /* ==========================================================================
     6. Showcase Project Filters
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');
      
      // Update active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          card.style.animation = 'fade-in-tab 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
  /* ==========================================================================
     7. Dynamic Project Modal Dialog
     ========================================================================== */
  const projectDialog = document.getElementById('project-details-dialog');
  const dialogCloseBtn = projectDialog.querySelector('.dialog-close-btn');
  const dialogImg = document.getElementById('dialog-img');
  const dialogTag = document.getElementById('dialog-tag');
  const dialogTitle = document.getElementById('dialog-title');
  const dialogDesc = document.getElementById('dialog-desc');
  const dialogTech = document.getElementById('dialog-tech');
  const dialogLink = document.getElementById('dialog-link');
  
  // Add triggers to all project cards
  projectCards.forEach(card => {
    // Both overlay expand icon and details button open the modal
    const openTriggers = card.querySelectorAll('.view-btn, .project-link-btn');
    
    openTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Extract data fields
        const title = card.getAttribute('data-title');
        const tag = card.getAttribute('data-tag');
        const img = card.getAttribute('data-img');
        const desc = card.getAttribute('data-desc');
        const tech = card.getAttribute('data-tech');
        const link = card.getAttribute('data-link');
        
        // Populate modal contents
        dialogImg.src = img;
        dialogImg.alt = `${title} Preview`;
        dialogTag.textContent = tag;
        dialogTitle.textContent = title;
        dialogDesc.textContent = desc;
        dialogTech.textContent = tech;
        dialogLink.href = link;
        
        // Open native modal dialog
        projectDialog.showModal();
      });
    });
  });
  
  // Close dialog on close button click
  dialogCloseBtn.addEventListener('click', () => {
    projectDialog.close();
  });
  
  // Close dialog on clicking outside content area (on backdrop)
  projectDialog.addEventListener('click', (e) => {
    const dialogDimensions = projectDialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      projectDialog.close();
    }
  });
  /* ==========================================================================
     8. Contact Form Validation & Submission Dialog
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const successDialog = document.getElementById('success-dialog');
  const successCloseBtn = document.getElementById('success-dialog-close');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      const formGroup = input.parentElement;
      
      // Perform simple validation check
      if (input.value.trim() === '') {
        formGroup.classList.add('has-error');
        isFormValid = false;
      } else if (input.type === 'email' && !validateEmail(input.value)) {
        formGroup.classList.add('has-error');
        isFormValid = false;
      } else {
        formGroup.classList.remove('has-error');
      }
      
      // Clear error style on typing
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          formGroup.classList.remove('has-error');
        }
      });
    });
    
    if (isFormValid) {
      // Show custom success modal
      successDialog.showModal();
      // Clear form inputs
      contactForm.reset();
    }
  });
  
  successCloseBtn.addEventListener('click', () => {
    successDialog.close();
  });
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  /* ==========================================================================
     9. Scroll to Top Button
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.pointerEvents = 'auto';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.pointerEvents = 'none';
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});