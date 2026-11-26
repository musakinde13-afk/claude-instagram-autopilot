// Analytics loads only after consent. Replace with the real GA4 ID; the placeholder never loads.
const GA = 'G-XXXXXXXXXX';
const bar = document.getElementById('cookie');
function analytics() {
  if (GA.includes('XXXX')) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
  document.head.append(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA, { anonymize_ip: true });
}
let consent = null;
try { consent = localStorage.getItem('consent'); } catch (e) {}
if (consent === 'yes') analytics(); else if (!consent) bar.hidden = false;
bar.addEventListener('click', e => {
  const v = e.target.dataset.consent;
  if (!v) return;
  try { localStorage.setItem('consent', v); } catch (e) {}
  bar.hidden = true;
  if (v === 'yes') analytics();
});
document.getElementById('cookie-settings')?.addEventListener('click', e => { e.preventDefault(); bar.hidden = false; });

// Seamless review loop: duplicate the cards once, the CSS slides the track by half its width.
const track = document.querySelector('.track');
if (track) track.append(...[...track.children].map(n => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); return c; }));

const f = document.getElementById('callout');
if (f) {
  const sched = document.getElementById('schedule');
  f.date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  f.addEventListener('change', e => {
    if (e.target.name !== 'urgency') return;
    const today = e.target.value === 'Today';
    // Today jobs skip the date picker: Paul calls straight back.
    sched.hidden = today;
    sched.querySelectorAll('input,select').forEach(i => { i.required = !today; i.disabled = today; });
    document.getElementById('now').hidden = !today;
  });
  f.photo.addEventListener('change', () => {
    const p = f.photo.files[0];
    f.photo.setCustomValidity(p && p.size > 8e6 ? 'Please choose a photo under 8MB.' : '');
    f.photo.reportValidity();
  });
}
