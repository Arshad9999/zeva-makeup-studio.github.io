const modal = document.querySelector('#booking-modal');
const services = ['Day Party Makeup','Haldi Mehandi Makeup','HD Makeup','Engagement Makeup','HD Engagement Makeup','Reception Makeup','HD Bridal','Engagement Airbrush','Air Brush Bridal','Bleach','D-Tan','Luxury D-Tan','Cleanup','Fruit Cleanup','Gold Facial','Under Arms','Half Leg Wax','Full Leg Wax','Full Face Wax','Half Hand Wax','Full Hand Wax','Rica Wax (Full Hand)','Rica Wax (Full Leg)','Threading','Forehead & Chin','Upper Lips','Full Face Threading','Hair Wash','Hair Trimming','V & U Shape Cut','Layer / Multi Cut','BOB Cut','Hair Spa'];
const pickerStyle = document.createElement('style');
pickerStyle.textContent = '.service-picker{margin:0;border:0;padding:0;min-width:0}.service-picker legend{font-size:13px;font-weight:750;margin-bottom:5px}.service-picker details{border:1px solid #d9bac5;background:#fff8fb}.service-picker summary{cursor:pointer;padding:10px;font-weight:600}.service-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:220px;overflow:auto;padding:10px;border-top:1px solid #ead3dc;background:#fff}.service-choice{display:flex!important;align-items:center;gap:7px;font-size:13px!important;font-weight:500!important}.service-choice input{width:18px;height:18px;margin:0}.service-error{color:#8f1d38;font-size:13px;font-weight:700;margin:6px 0 0}.service-error:empty{display:none}@media(max-width:520px){.service-choices{grid-template-columns:1fr}}';
document.head.append(pickerStyle);
const input = modal?.querySelector('input[name="service"]');
if (input) {
  const picker = document.createElement('fieldset');
  picker.className = 'service-picker';
  const legend = document.createElement('legend'); legend.textContent = 'Services *';
  const details = document.createElement('details');
  const summary = document.createElement('summary'); summary.textContent = 'Choose one or more services';
  const choices = document.createElement('div'); choices.className = 'service-choices';
  const error = document.createElement('p'); error.className = 'service-error'; error.id = 'service-error'; error.setAttribute('role', 'alert');
  details.setAttribute('aria-describedby', 'service-error');
  services.forEach(service => {
    const choice = document.createElement('label'); choice.className = 'service-choice';
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.name = 'services'; checkbox.value = service;
    const text = document.createElement('span'); text.textContent = service;
    choice.append(checkbox, text); choices.append(choice);
  });
  function updateSummary() {
    const selected = [...choices.querySelectorAll('input:checked')].map(choice => choice.value);
    summary.textContent = selected.length ? 'Selected: ' + selected.join(', ') : 'Choose one or more services';
    error.textContent = '';
  }
  choices.addEventListener('change', updateSummary);
  picker.addEventListener('selectionchange', updateSummary);
  details.append(summary, choices); picker.append(legend, details, error); input.closest('label').replaceWith(picker);
}
const date = modal?.querySelector('input[name="date"]');
function setMinimumDate() {
  const today = new Date();
  date.min = [today.getFullYear(), String(today.getMonth()+1).padStart(2,'0'), String(today.getDate()).padStart(2,'0')].join('-');
}
document.querySelectorAll('[data-open-booking]').forEach(button => button.addEventListener('click', () => {
  if (!modal || modal.open) return;
  setMinimumDate();
  if (button.dataset.service) {
    const choice = [...modal.querySelectorAll('input[name="services"]')].find(item => item.value === button.dataset.service);
    if (choice) { choice.checked = true; choice.closest('.service-picker').dispatchEvent(new Event('selectionchange')); }
  }
  modal.showModal();
}));
modal?.addEventListener('click', event => { if (event.target === modal) modal.close(); });
modal?.querySelector('.close')?.addEventListener('click', () => modal.close());
modal?.querySelector('form')?.addEventListener('submit', event => {
  event.preventDefault();
  setMinimumDate();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const selected = data.getAll('services');
  if (!selected.length) {
    modal.querySelector('.service-error').textContent = 'Please select at least one service.';
    const details = modal.querySelector('.service-picker details'); details.open = true; details.querySelector('summary').focus();
    return;
  }
  const message = ['Hello Zeva! I would like to request an appointment.', 'Name: '+data.get('name').trim(), 'Services: '+selected.join(', '), 'Preferred date: '+data.get('date'), 'Preferred time: '+(data.get('time') || 'Flexible'), 'Appointment type: '+data.get('type'), 'Additional details: '+(data.get('details').trim() || 'None')].join('\n');
  window.location.href = 'https://wa.me/918353909431?text='+encodeURIComponent(message);
});
