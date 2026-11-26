# Legal check (England, 26 Nov 2026). Not legal advice; a solicitor should review before launch.

## Must be done before launch (site is non-compliant until then)
1. Written OK from Paul (director, Blaymires Plumbing & Heating Limited) to publish a site in the company's name, with its photos and reviews.
2. Gas Safe Register number: set `GAS_SAFE_NO` in netlify.toml (E-Commerce Regulations 2002 reg 6). Verify it at gassaferegister.co.uk.
3. Business email address: set `BUSINESS_EMAIL` in netlify.toml (same regulation).
4. VAT number in the footer if the company is VAT registered (not yet a placeholder; add it the same way if needed).
5. Paul confirms the retention periods in the privacy policy (12 months / 6 years) and that the company pays the ICO data protection fee (ico.org.uk/fee).
6. Netlify Forms email notification switched on, so requests reach Paul.
7. Remove `X-Robots-Tag = "noindex"` from netlify.toml once approved.

## Verified
- Company details from Companies House: no. 11549828, active, registered office Upper Wortley Business Centre, LS12 4JG.
- Reviews: 20 real Google reviews, quoted word for word from the owner's screenshots, cut-off text marked with an ellipsis. The section says it is a selection and links to all reviews, including negative ones (DMCC Act 2024 bans hiding negative reviews in a misleading way).
- Claims: only what the van, photos or reviews support (Gas Safe registered, 24 hour call out, Ideal boilers, Leeds). Removed "today", "usually within the hour", "fixed first visit", "Paul who turns up" (reviews mention a team), the made-up 12-month guarantee and the "training centre" alt text.
- Cookies: Google Analytics only loads after Accept (PECR). Rejecting deletes the _ga cookies. The font is self-hosted (OFL licence), so there are no third-party requests before consent.
- Accessibility: axe-core WCAG 2.2 AA scan clean on all 7 pages at desktop and phone width. Keyboard-only form completion tested. Skip link, visible focus, pause button on the moving reviews (WCAG 2.2.2).
- Form: collects only what a call out needs. Email and photo are optional. The notice relies on the lawful basis of steps before a contract, not a forced "consent".

## Remaining risks
- Photos: copyright belongs to whoever took them (Paul, staff or customers). Get Paul to confirm they're his to use.
- Reviews: reviewers own their words. Quoting them is common practice and the ASA accepts genuine, verifiable testimonials. Paul should keep a link to each one (the CAP Code requires evidence on file).
- "4.9 from 269 reviews" goes out of date. Update it now and then, or swap in Google's official review widget.
- Ideal is a trademark. The site only names the brand Paul fits and doesn't suggest Ideal endorses him. Keep it that way.
- If prices go on the site, they must include VAT and all compulsory charges (DMCC Act 2024 drip-pricing rules).
- Yearly service reminder texts are marketing under PECR. They're fine for existing customers if every text gives an opt-out.
