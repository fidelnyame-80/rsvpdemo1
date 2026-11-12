# Setor & Eunice · RSVP demo

A responsive wedding invitation with a gallery, countdown, RSVP form, browser-local couple dashboard, name search, attendance filter and CSV export. Uses the three supplied couple photos, optimized to WebP. No dependencies are required.

## Run

`npm run dev` serves the site at http://localhost:3000. `npm run build` creates `dist/`. Import this repository into Vercel; the included configuration supplies the build and output settings.

## Demo flow

Open the invitation → RSVP → submit → open the couple’s dashboard. Dashboard is also available at `/#dashboard`. The three initial entries are visibly labeled sample responses. New submissions are saved in localStorage on the same origin and browser, and survive reloads. They do not sync between phones, browsers or deployments. Private browsing or clearing browser data can remove them. Export CSV includes sample labels.

This is a sales/recording demo, not a production RSVP service. The dashboard is deliberately public with no authentication and no backend. Before collecting real guest data, add server-side storage, access controls, duplicate/edit handling, and appropriate privacy information. The date, story, dress code and event information are illustrative; venues are not invented. Change them in index.html and update the countdown target in app.js together.

Typography uses Google Fonts with Georgia/sans-serif fallbacks. All photos and application assets are served locally. Forms render user input as text; CSV cells neutralize formula prefixes.
