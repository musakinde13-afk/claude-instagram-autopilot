// Booking form: client-side validation + honeypot. The endpoint must validate again.
const form = document.getElementById('booking');
if (form) {
  const endpoint = form.getAttribute('action'); // set only in index.html
  const connected = endpoint && !endpoint.startsWith('[');
  const success = document.getElementById('success');
  const error = document.getElementById('form-error');
  document.getElementById('not-connected').hidden = connected;
  form.elements.date.min = new Date().toISOString().slice(0, 10);

  const messages = {
    name: 'Please enter your name.',
    phone: 'Please enter a valid phone number.',
    service: 'Please choose a service.',
    date: 'Please choose today or a future date.',
    slot: 'Please choose a time slot.',
  };
  const fail = (msg) => { error.textContent = msg; error.hidden = false; };
  const callUs = 'Please call 0113 245 4689 to book.';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    success.hidden = true;
    error.hidden = true;

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

    // A human whose autofill hit the hidden field still gets a way to book; nothing is claimed as sent.
    if (form.elements.mb_hp.value) return fail(`Sorry, your request could not be sent. ${callUs}`);
    if (!connected) return fail(`This form is not connected yet, so nothing was sent. ${callUs}`);

    const button = form.querySelector('button[type=submit]');
    button.disabled = true;
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      success.hidden = false;
    } catch {
      fail(`Sorry, your request could not be sent. ${callUs}`);
    } finally {
      button.disabled = false;
    }
  });
}

// Cookie consent: analytics and the map load only after "Accept".
const KEY = 'mb-consent';
const banner = document.getElementById('cookie');
let consent = null;
try { consent = localStorage.getItem(KEY); } catch {}

function loadConsented() {
  // [ADD ANALYTICS ID]: inject the analytics script here, e.g.
  // const s = document.createElement('script'); s.src = 'https://...'; s.async = true; document.head.append(s);
  const map = document.getElementById('map');
  if (map && !map.querySelector('iframe')) {
    map.innerHTML = '<iframe title="Map of Thornton\'s Arcade, Leeds" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Thornton%27s+Arcade+Leeds&output=embed"></iframe>';
  }
}

if (consent === 'yes') loadConsented();
else if (consent !== 'no' && banner) banner.hidden = false;

banner?.addEventListener('click', (e) => {
  const choice = e.target.dataset?.consent;
  if (!choice) return;
  try { localStorage.setItem(KEY, choice); } catch {}
  banner.hidden = true;
  if (choice === 'yes') loadConsented();
});
