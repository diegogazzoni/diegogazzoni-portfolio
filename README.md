# Portfolio (static)

Static HTML/CSS/JS portfolio with colorful/minimal quadrants. Sections: Home, Bio (CV web-only), Projects (WIP), Contacts.

## Run locally
Open `index.html` in a browser (no build step needed).

## Customize
- **Branding**: update name/tagline in `index.html` header.
- **Nav labels/anchors**: edit the `href` values in the nav.
- **Bio/CV placeholders**: edit the timelines and tags in the Bio section (`#bio`).
- **Projects**: replace the WIP card in `#projects`; set the GitHub link on the CTA.
- **Contacts**:
  - Update `mailto`, LinkedIn, and GitHub URLs.
  - Form: set a real endpoint (e.g., Formspree action URL) or a `mailto:` handler. Current action is `#` to avoid broken posts.
- **Colors/typography**: adjust CSS variables in `styles.css` and font in the `<head>` of `index.html`.

## Deploy on GitHub Pages
Push the repo and enable Pages from the `main` branch (root). Ensure asset paths remain relative (`./`).
