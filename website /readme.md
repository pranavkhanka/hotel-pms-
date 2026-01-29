# Hotel Nature Valley Website

A modern, responsive static website for Hotel Nature Valley, Dalhousie, Himachal Pradesh.

**Live Site:** [naturevalley.in](https://naturevalley.in)

---

## Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, Flexbox, Grid, animations
- **Vanilla JavaScript** — No frameworks, zero dependencies
- **Google Fonts** — Playfair Display, Inter, Cormorant Garamond

### Why Vanilla Stack?

1. **Zero dependencies** — No npm, no build tools, no maintenance overhead
2. **Easy deployment** — Works on any static host
3. **Fast loading** — No framework overhead (~50KB total)
4. **Easy maintenance** — Edit HTML directly, no compile step

---

## Quick Start

### Local Development

```bash
# Option 1: Python (macOS/Linux)
python3 -m http.server 8080

# Option 2: Node.js
npx serve

# Option 3: PHP
php -S localhost:8080

# Then open http://localhost:8080
```

### Deployment

The site is pure static files. Deploy to any static host:

- **GitHub Pages** — Push to `gh-pages` branch
- **Netlify** — Drag & drop the folder
- **Vercel** — Connect repo or drag & drop
- **Any web host** — Upload via FTP

---

## Project Structure

```
static-web/
├── index.html          # Main website (single page)
├── css/
│   └── styles.css      # All styles (design system + components)
├── js/
│   └── main.js         # Interactivity (nav, animations, lightbox)
├── images/
│   ├── hero/           # Hero video/images
│   ├── rooms/          # Room photos
│   ├── attractions/    # Local attractions
│   ├── gallery/        # Property gallery
│   └── icons/          # Logo, favicon
├── asset/              # Original source images
└── README.md           # This file
```

---

## Updating Content

### Change Text Content

1. Open `index.html` in any text editor
2. Find the section you want to change
3. Edit the text between HTML tags
4. Save and refresh browser

### Replace Images

1. Add new image to appropriate `images/` subfolder
2. Update the `src` attribute in `index.html`
3. Keep images under 500KB for fast loading

### Update Contact Info

Search for these in `index.html`:
- Phone: `+91 97791 06655`
- Email: `info@naturevalley.in`
- Address: `Hotel Nature Valley, Dalhousie Road...`

### Change Colors

Edit CSS custom properties at the top of `css/styles.css`:

```css
:root {
  --color-primary: #2D5A3D;     /* Main green */
  --color-accent: #C9A962;      /* Gold buttons */
  --color-text: #1A2A1F;        /* Body text */
}
```

---

## Booking System

The "Book Now" buttons link to:
```
https://booking.trustifyedge.com/home?Token=book_a697fe49e-d0cd-40e9-ae17-51357b40597fe49
```

To change the booking URL, search & replace this URL in `index.html`.

---

## Image Optimization Tips

For best performance:

1. **Resize large images** — Max 1920px width
2. **Compress** — Use [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com)
3. **Use JPEG** — For photos (80% quality)
4. **Use WebP** — For modern browsers (even smaller)

---

## Browser Support

✅ Chrome (last 2 versions)  
✅ Firefox (last 2 versions)  
✅ Safari (last 2 versions)  
✅ Edge (last 2 versions)  
✅ Mobile Safari (iOS 14+)  
✅ Chrome Mobile (Android 8+)

---

## License

© 2024 Hotel Nature Valley. All rights reserved.
