# Saviour Henry — Portfolio

State-of-the-art personal portfolio for **Saviour Henry**, Senior AI Engineer.
Static site (HTML / CSS / vanilla JS) with cinematic motion via GSAP + Lenis,
deployed on GitHub Pages.

🔗 **Live:** https://ad163.github.io/SOTA-portfolio-site/

## Structure

```
index.html              # markup — all sections
css/style.css           # design system (noir + terracotta) & responsive
js/script.js            # motion layer (Lenis smooth scroll, GSAP reveals)
assets/
  images/               # portraits
  cv/                   # downloadable CV
```

## Run locally

```bash
# from the project root
python -m http.server 8000
# then open http://localhost:8000
```

(Any static server works — `npx serve` is an alternative. A server is
preferred over opening `index.html` directly so the CV download and paths
resolve cleanly.)

## Deploy

Push to `main`, then enable **Settings → Pages → Deploy from branch → `main` / root**.

## Tech

`HTML` · `CSS` · `Vanilla JS` · `GSAP` + `ScrollTrigger` · `Lenis` · Google Fonts (Syne / Space Grotesk / Space Mono)

---
© 2026 Saviour Henry
