# Legal PDF Tools - Deployment Guide

## Project Structure

```
legal-pdf-tools/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Multi-stage Docker build
│   └── render.yaml          # Render.com blueprint
└── frontend/
    ├── package.json         # Node dependencies
    ├── vite.config.js       # Vite configuration
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── postcss.config.js    # PostCSS configuration
    ├── index.html           # Entry HTML
    ├── public/
    │   ├── favicon.svg      # Site favicon
    │   ├── robots.txt       # SEO robots file
    │   └── sitemap.xml      # SEO sitemap
    └── src/
        ├── main.jsx         # React entry point
        ├── App.jsx          # Router & route definitions
        ├── components/      # Reusable components
        ├── pages/           # Page components
        ├── config/          # SEO configuration
        └── styles/          # Global styles
```

---

## Local Development

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** (LTS recommended)
- **npm** or **pnpm**

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`
- Vite proxies `/api/*` to `http://localhost:8000` automatically

### Full Stack Development

Run both in separate terminals:

```bash
# Terminal 1 - Backend
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## Production Build

### Backend (Docker)

```bash
cd backend

# Build image
docker build -t legal-pdf-backend .

# Run container
docker run -d \
  --name legal-pdf-backend \
  -p 8000:8000 \
  --restart unless-stopped \
  legal-pdf-backend
```

### Frontend (Static Build)

```bash
cd frontend

# Build for production
npm run build

# Output in frontend/dist/
# Serve with any static file server (nginx, Vercel, Netlify, Cloudflare Pages)
```

---

## Deployment to Render.com (Backend)

### Option 1: Blueprint Deploy (Recommended)

1. Push repository to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Blueprint**
4. Connect your GitHub repository
5. Render detects `render.yaml` and provisions:
   - Web Service (Docker)
   - Health checks configured
   - Auto-deploy on push to main

### Option 2: Manual Service Creation

1. **New Web Service** → Connect repository
2. **Runtime**: Docker
3. **Dockerfile Path**: `./backend/Dockerfile`
4. **Build Command**: (empty - Docker handles it)
5. **Start Command**: (empty - Docker CMD handles it)
6. **Health Check Path**: `/health`
7. **Environment Variables**:
   - `PYTHONUNBUFFERED=1`
   - `PORT=8000`
8. **Plan**: Starter (or higher for production)

### Custom Domain

1. In Render service settings → **Custom Domains**
2. Add `api.legalpdftools.com` (or your subdomain)
3. Configure DNS CNAME to Render's `*.onrender.com` address
4. Render provisions SSL automatically

---

## Deployment to Vercel (Frontend)

### Option 1: Vercel CLI

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: GitHub Integration

1. Push repository to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. **Add New Project** → Import GitHub repository
4. **Framework Preset**: Vite
5. **Root Directory**: `frontend`
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Environment Variables**:
   - `VITE_API_URL=https://api.legalpdftools.com` (your Render backend URL)
8. Deploy

### Custom Domain

1. In Vercel project settings → **Domains**
2. Add `legalpdftools.com` and `www.legalpdftools.com`
3. Configure DNS:
   - A record: `76.76.21.21` (Vercel)
   - CNAME: `www` → `cname.vercel-dns.com`
4. Vercel provisions SSL automatically

---

## Environment Variables

### Backend (.env for local, Render Dashboard for production)

```bash
# Required
PYTHONUNBUFFERED=1
PORT=8000

# Optional - CORS origins (comma-separated)
# CORS_ORIGINS=https://legalpdftools.com,https://www.legalpdftools.com

# Optional - Rate limiting (future)
# REDIS_URL=redis://...
```

### Frontend (.env.production)

```bash
# Backend API URL
VITE_API_URL=https://api.legalpdftools.com
```

---

## SEO Configuration

### Update Domain References

Before deploying, update these files with your actual domain:

1. **`frontend/src/config/seoPages.js`**: Replace `https://legalpdftools.com` with your domain
2. **`frontend/public/sitemap.xml`**: Replace all `https://legalpdftools.com` URLs
3. **`frontend/public/robots.txt`**: Update Sitemap and Host URLs
4. **`frontend/index.html`**: Update meta tags if needed

### Google Search Console

1. Add property: `https://legalpdftools.com`
2. Submit sitemap: `https://legalpdftools.com/sitemap.xml`
3. Verify ownership (HTML tag or DNS)

### Google AdSense

1. Apply at [AdSense](https://www.google.com/adsense)
2. Add site: `legalpdftools.com`
3. Place auto-ads code in `frontend/index.html` `<head>`:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
4. Ad slots in `AdSlot.jsx` will auto-populate

---

## Monitoring & Maintenance

### Health Checks

- Backend: `GET /health` returns `{"status":"healthy"}`
- Frontend: Vercel provides uptime monitoring

### Logs

- **Render**: Dashboard → Service → Logs
- **Vercel**: Dashboard → Project → Functions/Logs

### Updates

```bash
# Backend dependencies
cd backend
pip install --upgrade -r requirements.txt
# Rebuild Docker image

# Frontend dependencies
cd frontend
npm update
npm run build
# Redeploy to Vercel
```

### Backup Strategy

- **Code**: GitHub (primary)
- **Database**: None (stateless)
- **Files**: No persistent storage (by design)

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Core Web Vitals (LCP) | < 2.5s |
| Core Web Vitals (INP) | < 200ms |
| Core Web Vitals (CLS) | < 0.1 |

---

## Security Checklist

- [ ] HTTPS enforced (Vercel/Render auto)
- [ ] CORS configured for production domains only
- [ ] Rate limiting on `/api/process-pdf` (future)
- [ ] File size limit enforced (50MB)
- [ ] File type validation (PDF only)
- [ ] No sensitive data in logs
- [ ] Security headers via Vercel/Render
- [ ] Dependency scanning (GitHub Dependabot)

---

## Troubleshooting

### Backend Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: fitz` | Install system deps: `apt-get install libfreetype6-dev` |
| CORS errors | Add frontend domain to CORS origins in `main.py` |
| Memory errors on large PDFs | Increase container memory (Render: upgrade plan) |
| Health check fails | Verify `/health` endpoint responds 200 |

### Frontend Issues

| Issue | Solution |
|-------|----------|
| API calls fail | Check `VITE_API_URL` environment variable |
| Styles missing | Verify Tailwind `content` paths in `tailwind.config.js` |
| Build fails | Clear cache: `rm -rf node_modules package-lock.json && npm install` |
| Routing 404 on refresh | Configure SPA fallback (Vercel auto, nginx needs config) |

### Deployment Issues

| Issue | Solution |
|-------|----------|
| Render build timeout | Optimize Dockerfile, use build cache |
| Vercel function timeout | Not applicable (static build) |
| Domain not resolving | Check DNS propagation (up to 48h) |
| SSL certificate errors | Wait for auto-provisioning (usually < 5 min) |

---

## Support

For deployment issues:
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Email: support@legalpdftools.com