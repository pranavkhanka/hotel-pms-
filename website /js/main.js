/**
 * Hotel Nature Valley - Main JavaScript
 * 
 * Features:
 * - Smooth scroll navigation
 * - Header scroll effects
 * - Mobile navigation toggle
 * - Intersection Observer for animations
 * - Lightbox gallery
 * - Form validation
 */

(function() {
  'use strict';

  // ==============================================
  // DOM Elements
  // ==============================================
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav__link');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__nav--prev');
  const lightboxNext = document.querySelector('.lightbox__nav--next');
  const galleryItems = document.querySelectorAll('.gallery__item');
  const contactForm = document.getElementById('contact-form');

  // Lightbox state
  let currentImageIndex = 0;
  let galleryImages = [];

  // ==============================================
  // Header Scroll Effect
  // ==============================================
  function handleHeaderScroll() {
    if (window.scrollY > 100) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleHeaderScroll();
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ==============================================
  // Mobile Navigation
  // ==============================================
  function toggleMobileNav() {
    const isOpen = navList.classList.contains('nav__list--open');
    
    navList.classList.toggle('nav__list--open');
    navToggle.classList.toggle('nav__toggle--open');
    navOverlay.classList.toggle('nav__overlay--visible');
    navToggle.setAttribute('aria-expanded', !isOpen);
    
    // Prevent body scroll when nav is open
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMobileNav() {
    navList.classList.remove('nav__list--open');
    navToggle.classList.remove('nav__toggle--open');
    navOverlay.classList.remove('nav__overlay--visible');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileNav);
  navOverlay.addEventListener('click', closeMobileNav);

  // Close nav on link click
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMobileNav();
    });
  });

  // Close nav on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeLightbox();
    }
  });

  // ==============================================
  // Smooth Scroll Navigation
  // ==============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==============================================
  // Active Navigation Link
  // ==============================================
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(function(link) {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  // ==============================================
  // Intersection Observer for Animations
  // ==============================================
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add(entry.target.classList.contains('fade-in') ? 'fade-in--visible' : 
                                   entry.target.classList.contains('fade-in-left') ? 'fade-in-left--visible' : 
                                   'fade-in-right--visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(function(element) {
    observer.observe(element);
  });

  // ==============================================
  // Lightbox Gallery
  // ==============================================
  function setupGallery() {
    galleryItems.forEach(function(item, index) {
      const img = item.querySelector('img');
      if (img) {
        galleryImages.push(img.src);
        item.addEventListener('click', function() {
          openLightbox(index);
        });
      }
    });
  }

  function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = galleryImages[index];
    lightboxImage.alt = 'Gallery Image ' + (index + 1);
    lightbox.classList.add('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
      currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
      currentImageIndex = 0;
    }
    
    lightboxImage.src = galleryImages[currentImageIndex];
    lightboxImage.alt = 'Gallery Image ' + (currentImageIndex + 1);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function() {
      navigateLightbox(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function() {
      navigateLightbox(1);
    });
  }

  // Close lightbox on overlay click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function(e) {
    if (lightbox.classList.contains('lightbox--open')) {
      if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    }
  });

  // ==============================================
  // Contact Form Validation & Submission
  // ==============================================
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach(function(value, key) {
        data[key] = value;
      });
      
      // Basic validation
      if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }
      
      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // For static site, we'll show success message
      // In production, replace with actual form endpoint (Formspree, Netlify Forms, etc.)
      setTimeout(function() {
        showNotification('Thank you for your message! We will get back to you shortly.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // ==============================================
  // Notification Helper
  // ==============================================
  function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification notification--' + type;
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; top: 100px; right: 20px; padding: 16px 24px; border-radius: 8px; z-index: 1000; font-family: var(--font-body); font-size: 14px; max-width: 400px; animation: slideIn 0.3s ease;';
    
    if (type === 'success') {
      notification.style.background = '#2D5A3D';
      notification.style.color = '#fff';
    } else {
      notification.style.background = '#C53030';
      notification.style.color = '#fff';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(function() {
        notification.remove();
      }, 300);
    }, 4000);
  }

  // Add notification animations to document
  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
  document.head.appendChild(style);

  // ==============================================
  // Video Lazy Loading & Error Handling
  // ==============================================
  const heroVideo = document.querySelector('.hero__video');
  
  if (heroVideo) {
    heroVideo.addEventListener('error', function() {
      // If video fails to load, show poster image instead
      heroVideo.style.display = 'none';
    });
    
    // Attempt to play video
    heroVideo.play().catch(function() {
      // Autoplay failed (likely due to browser policy), that's okay
      console.log('Video autoplay was prevented');
    });
  }

  // ==============================================
  // Testimonials (Google Reviews Simulation)
  // ==============================================
  const testimonials = [
    {
      name: "Amit Verma",
      location: "Chandigarh",
      text: "Absolutely stunning location! The staff went above and beyond to make our stay comfortable. The food was delicious and home-like.",
      rating: 5
    },
    {
      name: "Sarah Jenkins",
      location: "UK",
      text: "A hidden gem in Dalhousie. Waking up to that mountain view was the highlight of our India trip. Highly recommended for peace lovers.",
      rating: 5
    },
    {
      name: "Rahul & Neha",
      location: "Mumbai",
      text: "We hosted our wedding here and it was magical. The arrangements were flawless and the venue is just picture perfect.",
      rating: 5
    },
    {
      name: "Dr. K.L. Gupta",
      location: "Delhi",
      text: "Clean rooms, polite staff, and great amenities. The swimming pool with the valley view is amazing.",
      rating: 5
    }
  ];

  function renderTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    let html = '';
    testimonials.forEach(function(t) {
      const stars = Array(t.rating).fill('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('');
      
      html += `
        <div class="testimonial-card fade-in" style="display: none;">
          <p class="testimonial-card__text">"${t.text}"</p>
          <div class="testimonial-card__author">
            <span class="testimonial-card__name">${t.name}</span>
            <span class="testimonial-card__location">${t.location}</span>
            <div class="testimonial-card__stars">${stars}</div>
            <div style="font-size: 12px; color: #888; margin-top: 5px;">Via Google Reviews</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Simple slider logic
    let currentIndex = 0;
    const cards = container.querySelectorAll('.testimonial-card');
    
    function showNext() {
      cards.forEach(c => c.style.display = 'none');
      cards[currentIndex].style.display = 'block';
      cards[currentIndex].classList.add('fade-in--visible'); // Ensure animation triggers
      currentIndex = (currentIndex + 1) % cards.length;
    }

    if (cards.length > 0) {
      showNext();
      setInterval(showNext, 5000); // Rotate every 5 seconds
    }
  }
  
  // ==============================================
  // Wedding Form Handler
  // ==============================================
  const weddingForm = document.getElementById('wedding-form');
  if (weddingForm) {
    weddingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = weddingForm.querySelector('button');
      const originalText = btn.textContent;
      
      btn.textContent = 'Sending...';
      btn.disabled = true;
      
      setTimeout(function() {
        showNotification('Enquiry sent! We will contact you soon to plan your dream wedding.', 'success');
        weddingForm.reset();
        document.getElementById('wedding-modal').classList.remove('modal--open');
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    });
  }

  // Close modal on outside click
  window.addEventListener('click', function(e) {
    const modal = document.getElementById('wedding-modal');
    if (e.target === modal) {
      modal.classList.remove('modal--open');
    }
  });

  // ==============================================
  // Initialize
  // ==============================================
  function init() {
    handleHeaderScroll();
    updateActiveNavLink();
    setupGallery();
    renderTestimonials();
    
    // Trigger initial animations for visible elements
    setTimeout(function() {
      animateElements.forEach(function(element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          observer.unobserve(element);
          element.classList.add(element.classList.contains('fade-in') ? 'fade-in--visible' : 
                               element.classList.contains('fade-in-left') ? 'fade-in-left--visible' : 
                               'fade-in-right--visible');
        }
      });
    }, 100);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
