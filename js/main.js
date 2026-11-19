/**
 * Credit Care SA - Interactive Experience
 * WhatsApp Integration, Credit Score Simulator, Mobile Nav, Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initCreditScoreSimulator();
  initWhatsAppModals();
  initConsultationForm();
  initSmoothScroll();
});

// 1. Mobile Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!toggleBtn || !mainNav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close nav on click outside or on link click
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !toggleBtn.contains(e.target) && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      toggleBtn.classList.remove('open');
    }
  });

  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      toggleBtn.classList.remove('open');
    });
  });
}

// 2. Header Scroll Elevation
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 3. Interactive Credit Score Simulator & Readiness Tool
function initCreditScoreSimulator() {
  const currentScoreSlider = document.getElementById('calc-current-score');
  const currentScoreDisplay = document.getElementById('calc-current-val');
  const checkboxes = document.querySelectorAll('.issue-check');
  const projectedScoreDisplay = document.getElementById('projected-score-display');
  const scoreTierBadge = document.getElementById('score-tier-badge');
  const projectionText = document.getElementById('projection-text');
  const arcPath = document.getElementById('sim-arc-meter');

  if (!currentScoreSlider || !projectedScoreDisplay) return;

  const calculateScore = () => {
    let baseScore = parseInt(currentScoreSlider.value, 10);
    currentScoreDisplay.textContent = baseScore;

    // Calculate potential points recovered
    let pointsToAdd = 0;
    checkboxes.forEach(cb => {
      const parentLabel = cb.closest('.custom-check-pill');
      if (cb.checked) {
        if (parentLabel) parentLabel.classList.add('selected');
        pointsToAdd += parseInt(cb.dataset.points || '0', 10);
      } else {
        if (parentLabel) parentLabel.classList.remove('selected');
      }
    });

    let newScore = Math.min(850, baseScore + pointsToAdd);
    projectedScoreDisplay.textContent = newScore + '+';

    // Tier badge update
    if (newScore >= 720) {
      scoreTierBadge.textContent = 'Excellent / Tier 1 (720+)';
      scoreTierBadge.style.color = '#34D399';
      scoreTierBadge.style.borderColor = 'rgba(52, 211, 153, 0.4)';
      projectionText.textContent = 'Prime status: Eligible for prime interest rates on vehicle finance, bond approvals, and premium store accounts.';
    } else if (newScore >= 650) {
      scoreTierBadge.textContent = 'Good Standing (650 - 719)';
      scoreTierBadge.style.color = '#6EE7B7';
      projectionText.textContent = 'Strong standing: High probability of home loan approvals and favorable financing terms.';
    } else {
      scoreTierBadge.textContent = 'Rebuilding In Progress';
      scoreTierBadge.style.color = '#FBBF24';
      projectionText.textContent = 'Clear adverse records to push your score past 720 and unlock major credit lines.';
    }

    // Update gauge stroke
    if (arcPath) {
      // Percentage from 300 to 850
      const pct = Math.max(0, Math.min(1, (newScore - 300) / 550));
      const circumference = 251.2; // approx half-circle perimeter
      const offset = circumference * (1 - pct);
      arcPath.style.strokeDashoffset = offset;
    }
  };

  currentScoreSlider.addEventListener('input', calculateScore);
  checkboxes.forEach(cb => cb.addEventListener('change', calculateScore));
  calculateScore();
}

// 4. WhatsApp Modals & Quick Links
function initWhatsAppModals() {
  const qrTriggers = document.querySelectorAll('.open-qr-modal');
  const qrModal = document.getElementById('qrModal');
  const closeModalBtns = document.querySelectorAll('.close-modal-trigger');

  if (qrModal) {
    qrTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        qrModal.classList.add('active');
      });
    });

    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        qrModal.classList.remove('active');
      });
    });

    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        qrModal.classList.remove('active');
      }
    });
  }
}

// 5. Consultation Form (WhatsApp direct submission & confirmation)
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  const alertBox = document.getElementById('formAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = form.querySelector('[name="fullName"]')?.value.trim() || '';
    const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const service = form.querySelector('[name="service"]')?.value || 'General Credit Repair';
    const notes = form.querySelector('[name="notes"]')?.value.trim() || '';

    // Create formatted WhatsApp Message
    const waText = encodeURIComponent(
      `*New Credit Care SA Consultation Request*\n\n` +
      `👤 *Name:* ${fullName}\n` +
      `📞 *Phone:* ${phone}\n` +
      `✉️ *Email:* ${email}\n` +
      `⚖️ *Service Required:* ${service}\n` +
      (notes ? `📝 *Details:* ${notes}\n\n` : `\n`) +
      `Please assist me with a confidential credit review.`
    );

    const waUrl = `https://wa.me/27714683911?text=${waText}`;

    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.innerHTML = `
        <div style="background: #E5F3E8; border: 1px solid #00A859; padding: 1.2rem; border-radius: 12px; color: #0A291A; margin-bottom: 1.5rem;">
          <h4 style="font-weight: 700; margin-bottom: 0.3rem; color: #061B11;">Thank You, ${fullName}!</h4>
          <p style="font-size: 0.92rem; margin-bottom: 0.8rem;">Your details have been recorded. For instant same-day response from our senior credit specialist, click below to open your request in WhatsApp:</p>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="display: inline-flex;">
            <svg style="width: 18px; height: 18px; fill: white;" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.302c-.087.087-.179.181-.077.355.101.174.45 1.055 1.289 1.448.246.115.441.184.6.234.205.065.39.056.536.035.163-.024.498-.553.642-.899.144-.347.144-.645.101-.708-.043-.063-.159-.101-.332-.188z"/></svg>
            Send directly to WhatsApp (+27 71 468 3911)
          </a>
        </div>
      `;
    }

    // Also auto-open WhatsApp after a brief delay for instant convenience
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 800);
  });
}

// 6. Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
