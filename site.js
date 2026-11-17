/**
 * ZEVA MAKEUP STUDIO & SALON — INTERACTION & LIVE QR LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Theme Management (Light / Dark Mode with LocalStorage)
  // ==========================================================================
  const themeToggleButtons = document.querySelectorAll('.theme-toggle');
  const storedTheme = localStorage.getItem('zeva-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zeva-theme', theme);
    themeToggleButtons.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀ Light' : '☾ Dark';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  applyTheme(initialTheme);

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // ==========================================================================
  // 2. Mobile Navigation Toggle
  // ==========================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '&#9776;';
      });
    });
  }

  // ==========================================================================
  // 3. WhatsApp Message & Live QR Code Generator Engine
  // ==========================================================================
  function generateWhatsAppUrl(formData) {
    const name = (formData.get('name') || '').toString().trim();
    // Support multi-select checkboxes (name="services") OR legacy single input (name="service")
    const servicesArr = formData.getAll('services').filter(Boolean);
    const serviceFallback = (formData.get('service') || '').toString().trim();
    const serviceText = servicesArr.length > 0
      ? servicesArr.join(', ')
      : (serviceFallback || 'General Bridal & Salon Consultation');
    const date = (formData.get('date') || '').toString();
    const time = (formData.get('time') || 'Flexible').toString();
    const type = (formData.get('type') || 'At the salon').toString();
    const details = (formData.get('details') || '').toString().trim();

    const lines = [
      '✨ *Hello Zeva Makeup Studio!* ✨',
      'I would like to request an appointment:',
      '',
      `👤 *Name:* ${name || 'Prospective Client'}`,
      `💄 *Services:* ${serviceText}`,
      `📅 *Preferred Date:* ${date || 'To be confirmed'}`,
      `⏰ *Preferred Time:* ${time || 'Flexible'}`,
      `📍 *Appointment Type:* ${type}`,
    ];

    if (details) {
      lines.push(`📝 *Notes:* ${details}`);
    }

    lines.push('', 'Please confirm availability. Thank you!');
    const encodedText = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/918353909431?text=${encodedText}`;
  }

  function renderQRCode(targetContainer, targetUrl) {
    if (!targetContainer) return;
    targetContainer.innerHTML = '';

    try {
      if (typeof QRCode !== 'undefined') {
        new QRCode(targetContainer, {
          text: targetUrl,
          width: 150,
          height: 150,
          colorDark: '#1b0409',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } else {
        throw new Error('Local QRCode library not ready');
      }
    } catch (e) {
      // Guaranteed Fallback to Image
      const encodedUrl = encodeURIComponent(targetUrl);
      targetContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}" alt="Scan to Book on WhatsApp" width="150" height="150" loading="eager" />`;
    }
  }

  function setupFormSync(formElement, qrContainerSelector, qrLinkSelector) {
    if (!formElement) return;

    const qrContainer = formElement.parentElement.querySelector(qrContainerSelector) || document.querySelector(qrContainerSelector);
    const qrLink = formElement.parentElement.querySelector(qrLinkSelector) || document.querySelector(qrLinkSelector);

    function update() {
      const data = new FormData(formElement);
      const url = generateWhatsAppUrl(data);
      renderQRCode(qrContainer, url);
      if (qrLink) {
        qrLink.href = url;
      }
    }

    // Live update on input
    formElement.addEventListener('input', update);
    formElement.addEventListener('change', update);

    // Initial render
    update();

    // Submission handler
    formElement.addEventListener('submit', e => {
      e.preventDefault();
      if (!formElement.reportValidity()) return;
      const data = new FormData(formElement);
      const url = generateWhatsAppUrl(data);
      window.open(url, '_blank');
    });
  }

  // Setup form sync on on-page booking form
  const onPageForm = document.querySelector('#onpage-booking-form');
  if (onPageForm) {
    setupFormSync(onPageForm, '#onpage-qr-code', '#onpage-qr-link');
  }

  // ==========================================================================
  // 4. Booking Modal & Date Setup
  // ==========================================================================
  const modal = document.querySelector('#booking-modal');
  const modalForm = modal?.querySelector('form');

  if (modalForm) {
    setupFormSync(modalForm, '#modal-qr-code', '#modal-qr-link');
  }

  // Set minimum date to today on all date pickers
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  document.querySelectorAll('input[name="date"]').forEach(input => {
    input.min = minDateStr;
    if (!input.value) {
      input.value = minDateStr;
    }
  });

  // Service Pre-selection Handler
  function preSelectService(formEl, serviceName) {
    if (!formEl || !serviceName) return;
    // Try checkbox multi-select first
    const checkbox = formEl.querySelector(`input[type="checkbox"][name="services"][value="${serviceName}"]`);
    if (checkbox) {
      checkbox.checked = true;
      formEl.dispatchEvent(new Event('change'));
      return;
    }
    // Partial match — try to find checkbox whose value starts with the service name
    const allCheckboxes = formEl.querySelectorAll('input[type="checkbox"][name="services"]');
    let matched = false;
    allCheckboxes.forEach(cb => {
      if (cb.value.startsWith(serviceName)) {
        cb.checked = true;
        matched = true;
      }
    });
    if (matched) { formEl.dispatchEvent(new Event('change')); return; }
    // Legacy single text input fallback
    const textInput = formEl.querySelector('[name="service"]');
    if (textInput) {
      textInput.value = serviceName;
      formEl.dispatchEvent(new Event('input'));
    }
  }

  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      
      // Update on-page form if exists
      if (onPageForm) preSelectService(onPageForm, serviceName);

      // Update modal form if exists
      if (modalForm) preSelectService(modalForm, serviceName);

      // If button has data-scroll-to-book, smooth scroll to on-page booking
      if (btn.hasAttribute('data-scroll-to-book')) {
        const bookSection = document.querySelector('#book');
        if (bookSection) {
          bookSection.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }

      // Otherwise open modal if button is data-open-booking
      if (btn.hasAttribute('data-open-booking') && modal) {
        if (typeof modal.showModal === 'function') {
          modal.showModal();
        } else {
          modal.setAttribute('open', '');
        }
      }
    });
  });

  // Modal Open/Close Controls
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    if (btn.hasAttribute('data-service')) return; // handled above
    btn.addEventListener('click', () => {
      if (!modal) return;
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    });
  });

  modal?.querySelector('.close')?.addEventListener('click', () => {
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  });

  modal?.addEventListener('click', e => {
    if (e.target === modal) {
      if (typeof modal.close === 'function') modal.close();
      else modal.removeAttribute('open');
    }
  });
});
