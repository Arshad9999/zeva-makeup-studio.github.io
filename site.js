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

        // QRCode library generates both a <canvas> and an <img>.
        // Remove redundant canvas so only ONE crisp QR image is displayed.
        setTimeout(() => {
          const canvases = targetContainer.querySelectorAll('canvas');
          const imgs = targetContainer.querySelectorAll('img');
          if (imgs.length > 0 && canvases.length > 0) {
            canvases.forEach(c => c.remove());
          }
        }, 20);
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
      // Order completed — clear selection as requested ("until order")
      clearAllSelectedServices();
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

  // ==========================================================================
  // 5. Persistent Multi-Service State Manager (Real-Time Comma-Separated Sync)
  // ==========================================================================
  const SERVICE_STORAGE_KEY = 'zeva_selected_services';

  function getStoredServices() {
    try {
      const raw = localStorage.getItem(SERVICE_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (e) {
      return [];
    }
  }

  function setStoredServices(servicesArr) {
    try {
      const unique = Array.from(new Set(servicesArr.filter(Boolean)));
      localStorage.setItem(SERVICE_STORAGE_KEY, JSON.stringify(unique));
      return unique;
    } catch (e) {
      return servicesArr;
    }
  }

  function addServiceToSelection(serviceName) {
    if (!serviceName || serviceName === 'General Consultation') return;
    const current = getStoredServices();
    if (!current.includes(serviceName)) {
      current.push(serviceName);
      setStoredServices(current);
      syncAllForms();
    }
  }

  function clearAllSelectedServices() {
    try {
      localStorage.removeItem(SERVICE_STORAGE_KEY);
    } catch (e) {}
    syncAllForms();
  }

  function updateFormSelectionUI(formEl, selectedServices) {
    if (!formEl) return;

    // Check or uncheck all checkboxes in this form according to selectedServices
    const checkboxes = formEl.querySelectorAll('input[type="checkbox"][name="services"]');
    checkboxes.forEach(cb => {
      cb.checked = selectedServices.includes(cb.value);
    });

    // Update real-time comma-separated display box
    const box = formEl.querySelector('.selected-services-box');
    if (box) {
      const countEl = box.querySelector('.selected-count');
      const textEl = box.querySelector('.selected-services-text');

      if (countEl) countEl.textContent = selectedServices.length;

      if (selectedServices.length > 0) {
        box.classList.add('has-selection');
        if (textEl) {
          textEl.textContent = selectedServices.join(', ');
        }
      } else {
        box.classList.remove('has-selection');
        if (textEl) {
          textEl.textContent = 'None selected yet. Choose from list below.';
        }
      }
    }

    // Update <details> <summary> with real-time comma-separated list
    const summary = formEl.querySelector('.service-picker summary');
    if (summary) {
      if (selectedServices.length > 0) {
        summary.textContent = `✓ Selected (${selectedServices.length}): ${selectedServices.join(', ')} ▾`;
      } else {
        summary.textContent = 'Choose one or more services ▾';
      }
    }

    // Trigger form sync so WhatsApp URL and QR code update in real-time
    formEl.dispatchEvent(new Event('input'));
  }

  function syncAllForms() {
    const selected = getStoredServices();
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (form.querySelector('input[name="services"]')) {
        updateFormSelectionUI(form, selected);
      }
    });
  }

  // Listen for checkbox toggle inside any form
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('change', e => {
      if (e.target && e.target.name === 'services' && e.target.type === 'checkbox') {
        const checkedValues = Array.from(
          form.querySelectorAll('input[type="checkbox"][name="services"]:checked')
        ).map(cb => cb.value);
        setStoredServices(checkedValues);
        syncAllForms();
      }
    });
  });

  // Clear button click listener
  document.querySelectorAll('.clear-selected-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      clearAllSelectedServices();
    });
  });

  // Service Pre-selection & Multi-Add Handler
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceName && serviceName !== 'General Consultation') {
        // Resolve full checkbox value if button's data-service is partial
        let fullValue = serviceName;
        const match = document.querySelector(`input[name="services"][value*="${serviceName}"]`);
        if (match) fullValue = match.value;

        addServiceToSelection(fullValue);
      }

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

  // Cross-page and tab synchronization
  window.addEventListener('storage', e => {
    if (e.key === SERVICE_STORAGE_KEY) {
      syncAllForms();
    }
  });

  window.addEventListener('pageshow', () => {
    syncAllForms();
  });

  // Initial sync on page load (reflects on home screen & services modal)
  syncAllForms();

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
