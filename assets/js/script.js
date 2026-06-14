/**
 * Yogaraj S - Portfolio Core Actions (Upgraded Version)
 * Includes: Theme Toggle, Custom Cursor, Canvas Particles, Typing Effect, 
 * Project Filters, Terminal Simulator, Stats Counter, Form Validator, Scroll Observer
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Manager (Light/Dark Mode) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  // Apply saved theme on startup
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('light-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      let theme = 'dark';
      if (document.body.classList.contains('light-theme')) {
        theme = 'light';
        themeToggleBtn.textContent = '☀️';
      } else {
        themeToggleBtn.textContent = '🌙';
      }
      localStorage.setItem('theme', theme);
    });
  }

  // --- 2. Custom Trailing Cursor ---
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorOutline = document.querySelector('.custom-cursor-outline');
  
  if (cursorDot && cursorOutline) {
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    let mouseX = 0, mouseY = 0;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });

    // Lerp (Linear Interpolation) for smooth trailing
    function animateCursor() {
      if (isMoving) {
        dotX += (mouseX - dotX) * 1;
        dotY += (mouseY - dotY) * 1;
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
      }
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Scaling outline on interactive elements hover
    const hoverables = document.querySelectorAll('a, button, .tag, .filter-btn, .view-cert-btn');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '45px';
        cursorOutline.style.height = '45px';
        cursorOutline.style.borderColor = 'var(--neon-cyan)';
        cursorOutline.style.backgroundColor = 'rgba(56, 189, 248, 0.08)';
      });
      item.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '30px';
        cursorOutline.style.height = '30px';
        cursorOutline.style.borderColor = 'var(--neon-purple)';
        cursorOutline.style.backgroundColor = 'transparent';
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
      isMoving = false;
    });
  }

  // --- 3. Canvas Particle Background ---
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 100 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
        this.pulseDir = 1;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 2;
        ctx.fill();
        ctx.restore();
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 1.5;
            this.y += (dy / distance) * force * 1.5;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha > 0.6 || this.alpha < 0.1) {
          this.pulseDir = -this.pulseDir;
        }

        this.draw();
      }
    }

    function initParticles() {
      particles = [];
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 80);
      const colors = ['#38bdf8', '#8b5cf6', '#0ea5e9', '#6366f1'];
      
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() * 0.3) - 0.15;
        const directionY = (Math.random() * 0.3) - 0.15;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animateParticles();
  }

  // --- 4. Dynamic Typing Effect (Hero) ---
  const typingElement = document.getElementById('typing-role');
  if (typingElement) {
    const roles = [
      'B.E CSE Student',
      'Web Application Security Enthusiast',
      'Developer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // pause before typing next
      }

      setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 800);
  }

  // --- 5. Project Filtering System ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  // --- 6. Security Console (Terminal) Simulator ---
  const consoleBody = document.getElementById('console-terminal');
  if (consoleBody) {
    const termLines = [
      { cmd: 'whoami', output: 'guest-visitor@yogaraj-sec:~$ Yogaraj S | Cybersecurity Enthusiast | B.E CSE Student' },
      { cmd: 'skills --list', output: 'Security: Kali Linux, Nmap, Burp Suite, Wireshark, Metasploit, Splunk, John the Ripper\nProgramming: Java, C, C++, Spring Boot, SQL, HTML/CSS' },
      { cmd: 'projects --show', output: '1. College Event Manager (Spring Boot / MySQL)\n2. Bank Management System (C++ / OOP)\n3. Remote Sensing GIS Classifier (Python / Machine Learning)\n4. School Mapping & Suitability Analysis (GIS / Python)' },
      { cmd: 'contact --email', output: 'Primary Email: yogaraj4656@gmail.com\nTryHackMe: https://tryhackme.com/p/YRxHex5ploit' }
    ];
    let sequenceIndex = 0;

    function runTerminalCycle() {
      const line = termLines[sequenceIndex];
      
      // Create element for the input prompt
      const inputLine = document.createElement('div');
      inputLine.className = 'console-line';
      inputLine.innerHTML = `<span class="console-prompt">yogaraj@sec:~$</span><span class="console-cmd"></span>`;
      consoleBody.appendChild(inputLine);
      consoleBody.scrollTop = consoleBody.scrollHeight;

      const cmdText = line.cmd;
      const cmdSpan = inputLine.querySelector('.console-cmd');
      let charIdx = 0;

      // Type the command letter by letter
      function typeCmd() {
        if (charIdx < cmdText.length) {
          cmdSpan.textContent += cmdText[charIdx];
          charIdx++;
          setTimeout(typeCmd, 100);
        } else {
          // Finished typing, print response after a tiny delay
          setTimeout(() => {
            const outputLine = document.createElement('div');
            outputLine.className = 'console-output';
            outputLine.textContent = line.output;
            consoleBody.appendChild(outputLine);
            consoleBody.scrollTop = consoleBody.scrollHeight;

            // Move to next cycle after pause
            setTimeout(() => {
              sequenceIndex = (sequenceIndex + 1) % termLines.length;
              
              // Clear screen if starting over to keep it neat
              if (sequenceIndex === 0) {
                setTimeout(() => {
                  consoleBody.innerHTML = '';
                  runTerminalCycle();
                }, 3000);
              } else {
                runTerminalCycle();
              }
            }, 3000);
          }, 3500);
        }
      }

      setTimeout(typeCmd, 500);
    }

    runTerminalCycle();
  }

  // --- 7. Animated Statistics Counter ---
  const statValues = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    statValues.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 1500; // ms
      const stepTime = Math.max(Math.floor(duration / target), 15);
      
      const timer = setInterval(() => {
        current += Math.ceil(target / 40); // increment steps
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = current + suffix;
        }
      }, stepTime);
    });
  }

  // Observer to start counter when stats section is visible
  const statsSection = document.getElementById('about');
  if (statsSection && statValues.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
          countersAnimated = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    statsObserver.observe(statsSection);
  }

  // --- 8. Contact Form Validator & Popup ---
  const contactForm = document.getElementById('contact-form');
  const successPopup = document.getElementById('success-popup');

  if (contactForm) {
    const fields = ['name', 'email', 'subject', 'message'];
    
    // Clear validation styling on typing
    fields.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name (min 2 characters)
      const name = document.getElementById('name');
      if (name.value.trim().length < 2) {
        name.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Subject (min 3 characters)
      const subject = document.getElementById('subject');
      if (subject.value.trim().length < 3) {
        subject.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Message (min 10 characters)
      const message = document.getElementById('message');
      if (message.value.trim().length < 10) {
        message.classList.add('is-invalid');
        isValid = false;
      }

      if (isValid) {
        // Validation passes -> show success message
        successPopup.classList.add('active');
        contactForm.reset();
        
        // Hide success message after 4s
        setTimeout(() => {
          successPopup.classList.remove('active');
        }, 4000);
      }
    });
  }

  // --- 9. Sticky Header & Navigation Highlighting ---
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // --- 10. Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const navLinksList = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinksList) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinksList.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinksList.classList.remove('active');
      });
    });
  }

  // --- 11. Scroll Fade-in animation ---
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
  });

  const cardsToReveal = document.querySelectorAll('.grid > .glass-card, .cert-grid > .cert-item, .timeline-item, .console-wrapper');
  cardsToReveal.forEach((card, idx) => {
    card.classList.add('fade-in-section');
    card.style.transitionDelay = `${(idx % 3) * 0.08}s`;
    observer.observe(card);
  });
});

// --- 12. Certificate Viewer Modal ---
const certificateImages = {
  'cert1': 'assets/extracted_image_1.jpg',
  'cert2': 'assets/extracted_image_2.jpg',
  'cert3': 'assets/extracted_image_3.jpg',
  'cert4': 'assets/extracted_image_4.jpg',
  'cert5': 'assets/extracted_image_5.jpg',
  'cert6': 'assets/extracted_image_6.jpg',
  'cert7': 'assets/extracted_image_7.jpg',
  'cert8': 'assets/extracted_image_8.jpg',
  'cert9': 'assets/extracted_image_9.jpg',
  'cert10': 'assets/extracted_image_10.jpg',
  'cert11': 'assets/extracted_image_11.jpg',
  'cert12': 'assets/extracted_image_12.jpg',
  'cert13': 'assets/extracted_image_13.jpg',
  'cert14': 'assets/extracted_image_14.jpg',
  'cert15': 'assets/extracted_image_15.jpg',
  'cert16': 'assets/extracted_image_16.jpg',
  'cert17': 'assets/extracted_image_17.jpg',
  'cert18': 'assets/extracted_image_18.jpg',
  'cert19': 'assets/extracted_image_19.jpg',
  'cert20': 'assets/extracted_image_20.jpg',
  'cert21': 'assets/extracted_image_21.jpg',
  'cert22': 'assets/extracted_image_22.jpg',
  'cert23': 'assets/extracted_image_23.jpg'
};

function openCertificate(id) {
  const modal = document.getElementById('certificateModal');
  const modalImage = document.getElementById('certificateModalImage');
  if (modal && modalImage && certificateImages[id]) {
    modalImage.src = certificateImages[id];
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
  }
}

function closeCertificate(event) {
  const modal = document.getElementById('certificateModal');
  const modalImage = document.getElementById('certificateModalImage');
  if (modal) {
    if (
      !event || 
      event.target.id === 'certificateModal' ||
      event.target.classList.contains('certificate-close') ||
      event.key === 'Escape'
    ) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        modal.style.display = 'none';
        if (modalImage) modalImage.src = '';
      }, 300);
    }
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeCertificate(event);
    closeProjectDetails(event);
  }
});

// --- 13. Project Details Modal ---
const projectDetailsData = {
  'school-mapping': {
    title: 'School Mapping and Suitability Analysis',
    category: 'GIS / Remote Sensing / Data Analysis',
    description: 'This project analyzes school locations using QGIS, Python, raster data, shapefiles, and suitability scoring methods. It includes school location mapping, buffer analysis, road and amenity proximity analysis, vegetation and built-up analysis, climate risk layers, and final suitability classification. The project helps identify whether a school location is Suitable, Moderately Suitable, or Not Suitable based on multiple spatial and environmental factors.',
    technologies: ['Python', 'QGIS', 'GeoPandas', 'Rasterio', 'Pandas', 'NumPy', 'Shapely', 'Google Earth Engine', 'Remote Sensing', 'GIS', 'CSV / Shapefile / GeoTIFF'],
    features: [
      'School location mapping',
      '500m buffer analysis',
      'Road network and nearby amenity analysis',
      'Vegetation, water, built-up, and open land analysis',
      'Climate risk analysis using raster layers',
      'Flood, landslide, heat, cyclone, and sea level rise risk evaluation',
      'Suitability classification: Suitable, Moderately Suitable, Not Suitable',
      'Final report, PPT, QGIS project, output files, shapefiles, and raster data included'
    ],
    highlights: [
      'Data Code',
      'Final Model',
      'Output',
      'Shapefile',
      'Tif',
      'PPT file',
      'Project Report PDF',
      'QGIS project file',
      'CSV dataset'
    ],
    github: 'https://github.com/Yogaraj02/School-Mapping-and-Analysis'
  }
};

function openProjectDetails(id) {
  const modal = document.getElementById('projectDetailsModal');
  const project = projectDetailsData[id];
  if (!modal || !project) return;
  
  document.getElementById('projectDetailsTitle').textContent = project.title;
  document.getElementById('projectDetailsCategory').textContent = project.category;
  
  let techBadges = project.technologies.map(t => `<span class="tag">${t}</span>`).join(' ');
  let featuresList = project.features.map(f => `<li>${f}</li>`).join('');
  let highlightsList = project.highlights.map(h => `<li>${h}</li>`).join('');
  
  const bodyContent = `
    <h4 style="color: var(--text-bright); font-size: 16px; margin: 20px 0 10px 0; font-weight: 700; border-left: 3px solid var(--neon-purple); padding-left: 10px;">Project Overview</h4>
    <p style="color: var(--text-muted); font-size: 15px; line-height: 1.7; margin-bottom: 15px;">${project.description}</p>
    
    <h4 style="color: var(--text-bright); font-size: 16px; margin: 20px 0 10px 0; font-weight: 700; border-left: 3px solid var(--neon-purple); padding-left: 10px;">Technologies & Tools Used</h4>
    <div class="tags" style="margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 8px;">
      ${techBadges}
    </div>
    
    <h4 style="color: var(--text-bright); font-size: 16px; margin: 20px 0 10px 0; font-weight: 700; border-left: 3px solid var(--neon-purple); padding-left: 10px;">Key Features</h4>
    <ul style="margin-left: 20px; color: var(--text-muted); font-size: 14px; margin-bottom: 15px; list-style-type: disc;">
      ${featuresList}
    </ul>
    
    <h4 style="color: var(--text-bright); font-size: 16px; margin: 20px 0 10px 0; font-weight: 700; border-left: 3px solid var(--neon-purple); padding-left: 10px;">Repository Folder Highlights</h4>
    <ul style="margin-left: 20px; color: var(--text-muted); font-size: 14px; margin-bottom: 15px; list-style-type: disc;">
      ${highlightsList}
    </ul>
  `;
  
  document.getElementById('projectDetailsBody').innerHTML = bodyContent;
  document.getElementById('projectDetailsGitHubLink').href = project.github;
  
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  document.body.style.overflow = 'hidden';
}

function closeProjectDetails(event) {
  const modal = document.getElementById('projectDetailsModal');
  if (modal) {
    if (
      !event || 
      event.target.id === 'projectDetailsModal' ||
      event.target.classList.contains('project-close') ||
      event.key === 'Escape' ||
      event.target.textContent === 'Close'
    ) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }
}
