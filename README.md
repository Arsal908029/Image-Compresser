# PixelLite Image Compressor — implementation starter

A static, responsive image-compressor website based on the uploaded SEO & Tools Website Implementation Plan.

## Included
- Homepage and dedicated image-compressor page
- Browser-side compression using Canvas APIs
- JPEG, PNG, and WebP output options
- Drag/drop and file picker, previews, before/after sizes, download, reset, and basic validation
- Responsive CSS and accessible status messages
- About, Contact, Privacy draft, `robots.txt`, and `sitemap.xml`

## Run locally
This is a static site. Open `index.html` in a browser for a basic test. For best results, run a local static server from this folder, e.g. with Python installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Before deployment
1. Replace `PixelLite` with your real brand if needed.
2. Replace every `https://YOUR-DOMAIN.example` placeholder in canonical URLs, `robots.txt`, and `sitemap.xml` with your actual HTTPS domain. If you do not yet have a custom domain, use the final production hostname consistently.
3. Replace the contact email placeholder and review the privacy policy against your actual implementation.
4. Test JPEG, PNG (including transparent images), WebP, corrupt files, 15 MB boundary, mobile layout, and browser support.
5. Do not claim exact 100 KB output: the current version offers quality-based compression only.
6. This version does not include analytics or advertising scripts.

## Deploy to Cloudflare Pages (static)
1. Push this folder to a GitHub repository.
2. In Cloudflare Dashboard, open **Workers & Pages** → create a **Pages** project and connect the repository.
3. For a plain static site, use no build command and set the build output directory to the repository root (or the directory containing these files).
4. Deploy, then test the assigned `pages.dev` URL on desktop and mobile.
5. Add a custom domain only after the Pages hostname works; follow the DNS instructions Cloudflare shows for that exact domain.
6. Verify canonical URLs, sitemap URL, HTTPS, redirects, and all navigation links after deployment.

A Git push updates the live site only when Git integration/deployment is configured.

## SEO next steps
- Verify the production domain in Google Search Console.
- Submit the production sitemap.
- Inspect homepage and `/image-compressor/`.
- Record baseline impressions, clicks, CTR, average position, tool starts/completions, and errors.
- Publish only genuinely useful guides based on observed questions and query data.

## Known limitations
- No guaranteed exact target-size mode (such as exactly 100 KB).
- Browser and device memory limits vary. Very large images can fail.
- PNG ignores the quality slider; JPEG does not preserve transparency.
- No accounts, batch processing, cloud uploads, analytics, ads, or mobile app are included.
