// Google Apps Script: receives Netlify's form webhook, logs the job to a Sheet
// (the Looker Studio admin dashboard reads this Sheet) and books the slot in Google Calendar.
// Deploy > New deployment > Web app, execute as Me, access Anyone. Secrets live here, never on the site.
const SHEET_ID = 'PASTE_SHEET_ID';
const TOKEN = 'PASTE_LONG_RANDOM_STRING'; // same value as ?token= in the Netlify webhook URL
const SLOTS = { morning: [8, 12], afternoon: [12, 17], evening: [17, 20] };

function doPost(e) {
  if (e.parameter.token !== TOKEN) return ContentService.createTextOutput('forbidden');
  const d = JSON.parse(e.postData.contents).data;
  const photo = d.photo && (d.photo.url || d.photo) || '';
  SpreadsheetApp.openById(SHEET_ID).getSheets()[0].appendRow(
    [new Date(), d.urgency, d.job, d.name, d.phone, d.email || '', d.address, d.postcode, d.details, d.date || 'ASAP', d.slot || 'ASAP', photo, 'New']);
  const slot = SLOTS[d.slot];
  if (d.date && slot) {
    const [y, m, day] = d.date.split('-').map(Number);
    CalendarApp.getDefaultCalendar().createEvent(
      `${d.job}: ${d.name} (${d.postcode})`,
      new Date(y, m - 1, day, slot[0]), new Date(y, m - 1, day, slot[1]),
      { location: `${d.address}, ${d.postcode}`, description: `${d.urgency}\n${d.phone}\n\n${d.details}\n\nPhoto: ${photo}` });
  }
  return ContentService.createTextOutput('ok');
}
