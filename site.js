/**
 * ZEVA MAKEUP STUDIO & SALON — INTERACTION LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Drawer Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    // Close nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '&#9776;';
      });
    });
  }

  // 2. Booking Modal & WhatsApp Booking Form
  const modal = document.querySelector('#booking-modal');
  const dateInput = modal?.querySelector('input[name="date"]');
  const serviceInput = modal?.querySelector('input[name="service"], select[name="service"]');

  // Set minimum date to today
  function setMinBookingDate() {
    if (!dateInput) return;
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    if (!dateInput.value) {
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
  }

  // Open modal buttons
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!modal) return;
      setMinBookingDate();

      const preselectedService = btn.getAttribute('data-service');
      if (preselectedService && serviceInput) {
        serviceInput.value = preselectedService;
      }

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    });
  });

  // Close modal button
  modal?.querySelector('.close')?.addEventListener('click', () => {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  });

  // Close on backdrop click
  modal?.addEventListener('click', e => {
    if (e.target === modal) {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    }
  });

  // Handle Form Submission -> WhatsApp
  const bookingForm = modal?.querySelector('form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      setMinBookingDate();

      if (!bookingForm.reportValidity()) return;

      const data = new FormData(bookingForm);
      const name = (data.get('name') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();
      const date = (data.get('date') || '').toString();
      const time = (data.get('time') || 'Flexible').toString();
      const type = (data.get('type') || 'At the salon').toString();
      const details = (data.get('details') || '').toString().trim();

      const lines = [
        '✨ *Hello Zeva Makeup Studio!* ✨',
        'I would like to request an appointment:',
        '',
        `👤 *Name:* ${name}`,
        `💄 *Service:* ${service || 'General Consultation'}`,
        `📅 *Preferred Date:* ${date}`,
        `⏰ *Preferred Time:* ${time || 'Flexible'}`,
        `📍 *Appointment Type:* ${type}`,
      ];

      if (details) {
        lines.push(`📝 *Notes:* ${details}`);
      }

      lines.push('', 'Please confirm availability. Thank you!');

      const whatsappText = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/918353909431?text=${whatsappText}`, '_blank');

      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    });
  }
});
