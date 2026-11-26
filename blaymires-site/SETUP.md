# Blaymires site: go-live steps

1. Deploy `blaymires-site` to Netlify (publish dir `public` and build command `sh build.sh` are set in netlify.toml).
   Site address, Gas Safe number and business email live in one place: `[build.environment]` in netlify.toml. Edit them there and redeploy.
   When blaymires.co.uk is connected: set `SITE_URL` to it, remove the `X-Robots-Tag` noindex line, and add a redirect so the non-www address forwards to the www one.
2. Netlify > Forms > callout > Notifications:
   - Email notification to Paul's business email (every request arrives with the urgency, details and a photo link).
   - Outgoing webhook to the Apps Script web app URL + `?token=YOUR_TOKEN`.
3. Google Sheet: header row `Received, Urgency, Job, Name, Phone, Email, Address, Postcode, Details, Date, Slot, Photo, Status`. Paste its ID and a random token into `apps-script.gs`, deploy as a web app.
4. Admin: build a Looker Studio report on that Sheet (jobs by urgency, by week, open vs done). Share it only with Paul's Google account and send him the link to bookmark. It is deliberately not linked from the public site. Paul updates the Status column in the Sheet.
5. Analytics: create a GA4 property, put its ID in `public/main.js` (`GA`). It only loads after cookie consent.
6. SMS alerts (optional): needs Twilio or similar; add as a Netlify Function with the key in Netlify env vars, never in the site files.
