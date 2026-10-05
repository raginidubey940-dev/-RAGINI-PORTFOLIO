/**
 * AI & ML STUDENT PORTFOLIO - CORE ENGINE
 * Spec: 1st Year B.Tech CSE (AI & ML) @ JECRC University
 */

// ================= Config & State =================
const PORTFOLIO_CONFIG = {
  studentName: "Aspirant AI Engineer", // User can change their name here
  email: "student.jecrc.aiml@gmail.com", // User's email ID
  university: "JECRC University, Jaipur",
  degree: "B.Tech CSE (AI & ML) - 1st Year (2025-2029)"
};

let isSoundEnabled = false;
let audioCtx = null;

// ================= Audio Synthesizer (Zero-dependency Web Audio API) =================
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
  if (!isSoundEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.debug("Audio play error", e);
  }
}

function playHoverSound() {
  playTone(880, 'sine', 0.04, 0.02);
}

function playClickSound() {
  playTone(523.25, 'triangle', 0.1, 0.06);
  setTimeout(() => playTone(659.25, 'sine', 0.12, 0.05), 40);
}

function playSuccessChime() {
  if (!isSoundEnabled || !audioCtx) return;
  playTone(523.25, 'sine', 0.1, 0.05);
  setTimeout(() => playTone(659.25, 'sine', 0.1, 0.05), 80);
  setTimeout(() => playTone(783.99, 'sine', 0.18, 0.06), 160);
  setTimeout(() => playTone(1046.50, 'sine', 0.25, 0.07), 240);
}

// ================= Neural Network Particle Canvas =================
class NeuralBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 45 : 90;
    this.maxDistance = 140;
    this.mouse = { x: null, y: null, radius: 160 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.particleCount = window.innerWidth < 768 ? 40 : 85;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        baseColor: Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, '
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move particles
      p.x += p.vx;
      p.y += p.vy;

      // Bounce at boundary
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse influence
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 0.02;
          p.x -= dx * force;
          p.y -= dy * force;
        }
      }

      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.baseColor + '0.85)';
      this.ctx.fill();

      // Connect with neighboring nodes
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const alpha = (1 - dist / this.maxDistance) * 0.35;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          this.ctx.lineWidth = 0.85;
          this.ctx.stroke();
        }
      }

      // Connect to mouse pointer
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.maxDistance) {
          const alpha = (1 - dist / this.maxDistance) * 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(79, 172, 254, ${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ================= Typewriter Effect =================
class Typewriter {
  constructor(elementId, words, typingSpeed = 70, deleteSpeed = 35, pauseTime = 1800) {
    this.el = document.getElementById(elementId);
    this.words = words;
    this.typingSpeed = typingSpeed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    if (this.el) {
      this.type();
    }
  }

  type() {
    const currentWord = this.words[this.wordIndex];

    if (this.isDeleting) {
      this.el.textContent = currentWord.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.el.textContent = currentWord.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let nextTimeout = this.isDeleting ? this.deleteSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      nextTimeout = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      nextTimeout = 400;
    }

    setTimeout(() => this.type(), nextTimeout);
  }
}

// ================= Toast Notification Engine =================
function showToast(message, iconClass = "fa-solid fa-circle-check") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  playSuccessChime();

  setTimeout(() => {
    toast.style.animation = "fadeToastOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

// ================= 1-Click Copy Email Feature =================
function copyEmailToClipboard() {
  const emailToCopy = PORTFOLIO_CONFIG.email;

  navigator.clipboard.writeText(emailToCopy).then(() => {
    // Update button visual state
    const btnAction = document.getElementById("btnCopyEmailAction");
    const label = document.getElementById("copyBtnLabel");
    const icon = document.getElementById("copyIconState");

    if (btnAction && label && icon) {
      btnAction.classList.add("copied");
      label.textContent = "Copied!";
      icon.className = "fa-solid fa-check";

      setTimeout(() => {
        btnAction.classList.remove("copied");
        label.textContent = "Copy";
        icon.className = "fa-solid fa-copy";
      }, 2200);
    }

    showToast(`Email copied: ${emailToCopy}`, "fa-solid fa-envelope-circle-check");
  }).catch(() => {
    // Fallback if clipboard API is restricted
    const input = document.getElementById("officialEmailInput");
    if (input) {
      input.select();
      document.execCommand("copy");
      showToast(`Email copied: ${emailToCopy}`, "fa-solid fa-check");
    }
  });
}

// ================= Smooth Scroll Navigation =================
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  playClickSound();

  const navHeight = 80;
  const elementPosition = target.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navHeight;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });

  // Close mobile nav drawer if open
  const navLinks = document.getElementById("navLinks");
  if (navLinks && navLinks.classList.contains("mobile-active")) {
    navLinks.classList.remove("mobile-active");
  }
}

// ================= Skill Filtering & Progress Animation =================
function initSkillTabs() {
  const tabButtons = document.querySelectorAll(".skill-tab-btn");
  const cards = document.querySelectorAll(".skill-card");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      playClickSound();
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      cards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Intersection observer to animate skill progress bars when in viewport
  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = document.querySelectorAll(".skill-bar-fill");
          bars.forEach(bar => {
            const percent = bar.style.getPropertyValue("--skill-percent") || "75%";
            bar.style.width = percent;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(skillsSection);
  }
}

// ================= Project Modals =================
const PROJECT_DETAILS_DATA = {
  sentiment: {
    title: "SentimentPulse: Real-Time Mood Analyzer",
    tag: "Python • NLP • Streamlit",
    description: "Built to process customer opinions and forum threads in real-time. Leverages NLTK VADER sentiment scoring and tokenization to output compound polarity scores with interactive distribution histograms.",
    highlights: [
      "Tokenization & stopword filtering pipeline",
      "Interactive Streamlit web GUI with live sentiment charts",
      "Confidence scoring and emotion polarity classification (Positive / Neutral / Negative)",
      "Engineered during 1st-year self-directed Python NLP study"
    ],
    github: "https://github.com"
  },
  vision: {
    title: "VisionHand: Gesture-Based Volume Controller",
    tag: "OpenCV • MediaPipe • Computer Vision",
    description: "An interactive computer vision experiment utilizing a standard HD webcam to identify 21 hand landmarks, tracking the Euclidean distance between thumb and index fingertips to seamlessly regulate system master audio.",
    highlights: [
      "Real-time 60 FPS landmark detection with Google MediaPipe",
      "Interpolation mapping distance range directly to audio decibels",
      "Visual onscreen volume HUD overlay drawn with OpenCV primitives",
      "Presented in JECRC student technical showcase"
    ],
    github: "https://github.com"
  },
  "jecrc-bot": {
    title: "JECRC Campus AI Companion Bot",
    tag: "Python • Gemini API • Flask",
    description: "A tailored assistant designed to answer frequent university queries: syllabus guidelines, campus hall locations, examination schedules, and faculty contacts.",
    highlights: [
      "Trained on curated JECRC student handbook knowledge base",
      "Context-aware dialogue management using Gemini API",
      "Fast lightweight web interface built with Flask and responsive CSS",
      "Reduces campus administrative query backlogs"
    ],
    github: "https://github.com"
  },
  autodata: {
    title: "AutoData: One-Click EDA Generator",
    tag: "Pandas • Seaborn • Plotly",
    description: "A Python script suite that ingests dirty CSV spreadsheets and generates automated exploratory data analysis reports: null checks, skewness metrics, correlation matrices, and boxplots.",
    highlights: [
      "Automatic data type inference and categorical frequency counts",
      "Color-coded Seaborn correlation heatmap generation",
      "Outlier detection using IQR (Interquartile Range) algorithms",
      "Speeds up initial Kaggle competition data ingestion by 80%"
    ],
    github: "https://github.com"
  }
};

function openProjectModal(key) {
  playClickSound();
  const data = PROJECT_DETAILS_DATA[key];
  if (!data) return;

  const contentEl = document.getElementById("projectModalContent");
  if (!contentEl) return;

  contentEl.innerHTML = `
    <button class="modal-close-btn" onclick="closeProjectModal()" aria-label="Close modal">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="modal-header">
      <div class="modal-icon"><i class="fa-solid fa-laptop-code"></i></div>
      <div>
        <h3>${data.title}</h3>
        <p class="text-cyan">${data.tag}</p>
      </div>
    </div>
    <div class="resume-preview-box">
      <p style="color: #e2e8f0; margin-bottom: 14px; font-size: 0.95rem;">${data.description}</p>
      <strong style="color: var(--accent-cyan); display: block; margin-bottom: 8px;">Key Engineering Highlights:</strong>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; color: var(--text-muted);">
        ${data.highlights.map(h => `<li><i class="fa-solid fa-check text-cyan" style="margin-right: 8px;"></i>${h}</li>`).join('')}
      </ul>
    </div>
    <div class="modal-actions">
      <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <i class="fa-brands fa-github"></i> Inspect Repository & Code
      </a>
      <button class="btn btn-glass" onclick="closeProjectModal()">Close</button>
    </div>
  `;

  document.getElementById("projectModal").classList.add("active");
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (modal) modal.classList.remove("active");
}

function closeProjectModalOnBackdrop(e) {
  if (e.target.id === "projectModal") {
    closeProjectModal();
  }
}

// ================= Resume Modal =================
function showResumeModal(e) {
  if (e) e.preventDefault();
  playClickSound();
  const modal = document.getElementById("resumeModal");
  if (modal) modal.classList.add("active");
}

function closeResumeModal() {
  const modal = document.getElementById("resumeModal");
  if (modal) modal.classList.remove("active");
}

function closeResumeModalOnBackdrop(e) {
  if (e.target.id === "resumeModal") {
    closeResumeModal();
  }
}

function triggerResumeDownload() {
  playSuccessChime();
  showToast("Downloading Resume PDF for 1st Year B.Tech CSE (AI & ML)...", "fa-solid fa-file-arrow-down");
  
  // Creates an instant printable HTML / PDF view window or triggers clean print
  setTimeout(() => {
    const resumeWindow = window.open("", "_blank");
    if (resumeWindow) {
      resumeWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume - 1st Year B.Tech CSE (AI & ML) - JECRC University</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; max-width: 800px; margin: auto; }
            h1 { font-size: 26px; margin-bottom: 4px; color: #0f172a; }
            .subtitle { font-size: 15px; color: #0284c7; font-weight: 600; margin-bottom: 12px; }
            .contact { font-size: 13px; color: #64748b; margin-bottom: 24px; }
            h2 { font-size: 16px; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-top: 20px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
            ul { margin: 8px 0; padding-left: 20px; }
            li { margin-bottom: 4px; }
            .date { float: right; color: #64748b; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>B.Tech CSE (AI & ML) Undergraduate</h1>
          <div class="subtitle">1st Year Student • JECRC University, Jaipur</div>
          <div class="contact">Email: ${PORTFOLIO_CONFIG.email} | Location: Jaipur, Rajasthan | GitHub: github.com | LinkedIn: linkedin.com</div>
          
          <h2>Career Objective</h2>
          <p>Passionate first-year Computer Science & Engineering undergraduate specializing in Artificial Intelligence and Machine Learning at JECRC University. Strong grounding in Python, C algorithmic logic, data structures, and mathematical modeling. Seeking collaborative student hackathons, coding teams, and exploratory technical projects.</p>

          <h2>Education</h2>
          <div>
            <strong>Bachelor of Technology (B.Tech) in Computer Science & Engineering (AI & ML)</strong>
            <span class="date">2025 – 2029 (Expected)</span><br/>
            <em>JECRC University, Jaipur, Rajasthan</em>
            <ul>
              <li>Coursework: Data Structures, C Programming, Discrete Mathematics, AI Foundations.</li>
              <li>Active participant in campus coding societies and AI workshops.</li>
            </ul>
          </div>
          <div style="margin-top: 12px;">
            <strong>Senior Secondary (Class XII) - Science (PCM & CS)</strong>
            <span class="date">Completed 2025</span><br/>
            <em>CBSE Board - First Class Distinction</em>
          </div>

          <h2>Technical Skills</h2>
          <ul>
            <li><strong>Programming:</strong> Python (Pandas, NumPy, Matplotlib), C, C++, Basic JavaScript.</li>
            <li><strong>AI & ML Foundations:</strong> Exploratory Data Analysis, Linear Regression, Prompt Engineering, OpenCV.</li>
            <li><strong>Tools & Platforms:</strong> Git, GitHub, VS Code, Jupyter Notebook, Google Colab, Linux.</li>
            <li><strong>Soft Skills:</strong> Problem Decomposition, Analytical Thinking, Teamwork, Technical Presentations.</li>
          </ul>

          <h2>Key Academic & Personal Projects</h2>
          <ul>
            <li><strong>SentimentPulse (Python/NLP):</strong> Real-time sentiment classification web application built with NLTK and Streamlit.</li>
            <li><strong>VisionHand (OpenCV/MediaPipe):</strong> Contactless computer vision volume controller using webcam landmark tracking.</li>
            <li><strong>JECRC Campus AI Bot:</strong> Prototype conversational bot assisting peers with university schedules and FAQs.</li>
          </ul>
        </body>
        </html>
      `);
      resumeWindow.document.close();
      resumeWindow.focus();
    }
  }, 400);
}

// ================= Contact Form Handler =================
function handleFormSubmit(e) {
  e.preventDefault();
  playClickSound();

  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const subject = document.getElementById("userSubject").value;
  const message = document.getElementById("userMessage").value.trim();

  const alertBox = document.getElementById("formStatusAlert");

  if (!name || !email || !message) {
    alertBox.className = "form-status-alert";
    alertBox.style.display = "block";
    alertBox.style.color = "#f43f5e";
    alertBox.textContent = "Please fill out all required fields.";
    return;
  }

  // Visual success feedback
  alertBox.className = "form-status-alert success";
  alertBox.innerHTML = `
    <i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your message regarding "<em>${subject}</em>" has been prepared. Opening your default mail client...
  `;
  showToast("Message prepared! Connecting to mail client...", "fa-solid fa-paper-plane");

  // Open default mail client with prepopulated body
  setTimeout(() => {
    const mailtoUrl = `mailto:${PORTFOLIO_CONFIG.email}?subject=${encodeURIComponent(`[Portfolio] ${subject} from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoUrl;
  }, 900);

  // Reset form
  document.getElementById("contactForm").reset();
}

// ================= Document Ready & Listeners =================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Start Neural Background Canvas
  new NeuralBackground("neuralCanvas");

  // 2. Start Typewriter Headline
  new Typewriter("typewriterText", [
    "1st Year B.Tech CSE (AI & ML) @ JECRC University",
    "Python Programmer & Algorithmic Thinker",
    "Exploring Neural Networks & Deep Learning",
    "Prompt Engineer & Generative Tech Hobbyist",
    "Building Code That Learns and Adapts"
  ], 65, 30, 2000);

  // 3. Initialize Skills & Tabs
  initSkillTabs();

  // 4. Update dynamic year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 5. Sound Toggle Button
  const soundToggle = document.getElementById("soundToggle");
  const soundIcon = document.getElementById("soundIcon");
  if (soundToggle && soundIcon) {
    soundToggle.addEventListener("click", () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      soundToggle.classList.toggle("active", isSoundEnabled);
      if (isSoundEnabled) {
        soundIcon.className = "fa-solid fa-volume-high";
        playTone(600, 'sine', 0.1, 0.05);
        showToast("Interactive Audio SFX: Enabled", "fa-solid fa-volume-high");
      } else {
        soundIcon.className = "fa-solid fa-volume-xmark";
        showToast("Interactive Audio SFX: Muted", "fa-solid fa-volume-xmark");
      }
    });
  }

  // 6. Sound triggers on hover & click
  document.querySelectorAll("[data-sound='hover']").forEach(el => {
    el.addEventListener("mouseenter", () => playHoverSound());
  });

  document.querySelectorAll("[data-sound='click']").forEach(el => {
    el.addEventListener("click", () => playClickSound());
  });

  // 7. Mobile Menu Hamburger
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-active");
      playClickSound();
    });
  }

  // 8. Glow Cursor Tracker
  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow && window.innerWidth > 992) {
    cursorGlow.style.display = "block";
    window.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 9. Active Navigation Link on Scroll
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      if (window.pageYOffset >= sectionTop) {
        current = sec.getAttribute("id");
      }
    });

    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });
});
