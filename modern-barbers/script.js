// Booking form: client-side validation + honeypot. Server must validate again.
const form = document.getElementById('booking');
if (form) {
  const date = form.elements.date;
  date.min = new Date().toISOString().slice(0, 10);

  const messages = {
    name: 'Please enter your name.',
    phone: 'Please enter a valid phone number.',
    service: 'Please choose a service.',
    date: 'Please choose today or a future date.',
    slot: 'Please choose a time slot.',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Bots fill hidden fields; pretend success so they move on.
    if (form.elements.company.value) return showSuccess();

    let first = null;
    for (const key of Object.keys(messages)) {
      const el = form.elements[key];
      const ok = el.checkValidity();
      el.setAttribute('aria-invalid', String(!ok));
      el.setAttribute('aria-describedby', `${key}-error`);
      document.getElementById(`${key}-error`).textContent = ok ? '' : messages[key];
      if (!ok && !first) first = el;
    }
    if (first) return first.focus();
    // [ADD FORM ENDPOINT]: replace with fetch(form.action, { method: 'POST', body: new FormData(form) })
    showSuccess();
  });

  function showSuccess() {
    form.reset();
    document.getElementById('success').hidden = false;
  }
}

// Cookie consent: analytics loads only after "Accept".
const KEY = 'mb-consent';
const banner = document.getElementById('cookie');
let consent = null;
try { consent = localStorage.getItem(KEY); } catch {}

function loadAnalytics() {
  // [ADD ANALYTICS ID]: inject the analytics script here, e.g.
  // const s = document.createElement('script'); s.src = 'https://...'; s.async = true; document.head.append(s);
}

if (consent === 'yes') loadAnalytics();
else if (consent !== 'no' && banner) banner.hidden = false;

banner?.addEventListener('click', (e) => {
  const choice = e.target.dataset?.consent;
  if (!choice) return;
  try { localStorage.setItem(KEY, choice); } catch {}
  banner.hidden = true;
  if (choice === 'yes') loadAnalytics();
});
