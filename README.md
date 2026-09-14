# PK Christian Sponsors — Website

A static multi-page website scaffold for PK Christian Sponsors, a Christian child-sponsorship nonprofit. Built with plain HTML/CSS/JS — no build step, no framework — so it can be deployed as-is to GitHub Pages, Netlify, or any static host.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About | `about.html` |
| Programs | `programs.html` |
| Sponsor a Child | `sponsor.html` |
| Impact Stories | `stories.html` |
| Get Involved | `get-involved.html` |
| Donate | `donate.html` |
| Contact | `contact.html` |

## Structure

```
css/style.css   — all site styling (CSS variables at the top for easy re-theming)
js/main.js      — mobile nav toggle, donate-amount picker, placeholder form handling
*.html          — one file per page, shared header/nav/footer copy-pasted across pages
```

## ⚠️ Before this site goes live

This is a **first-pass design scaffold**. Content and images are placeholders and must be replaced:

1. **All photos are stock/placeholder images** (via picsum.photos, seeded so they stay consistent across reloads). Replace every `<img>` and `background-image` with real, licensed photography of your actual ministry.
2. **The "Sponsor a Child" page uses fake sample profiles** (`[Child Name]`, stock photos, made-up ages/countries). These must **never go live as-is** — replace with real children's photos/names/information collected with proper consent and safeguarding review before accepting real sponsorships against them.
3. **The Donate page's payment form is a non-functional UI mockup.** No payment processor is wired up. Connect a real processor (Stripe, PayPal Giving, or a giving platform like Give/Kindful/Tithe.ly) before accepting donations.
4. **All other forms** (newsletter, contact, prayer team signup) just show a confirmation message — no email/CRM is connected. Wire them to a form backend (e.g. Formspree) or your CRM/ESP.
5. **Team bios on the About page are placeholders** (`[Executive Director Name]`, etc.) — replace with your actual leadership.
6. **Stats, financial allocation percentages, and the timeline on the About page are sample figures** — replace with your organization's real, audited numbers.
7. Replace the address, phone number, and email in the header/footer with your real contact details.
8. Update the copyright year and legal links (Privacy Policy, Financial Accountability) as needed.

## Local preview

Just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
```

## Deploying

- **GitHub Pages**: push to this repo, enable Pages on the `main` branch in repo settings.
- **Netlify**: drag-and-drop the folder, or connect the GitHub repo.
