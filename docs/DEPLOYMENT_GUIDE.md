# Production Deployment Guide: `abeeboladipupo.com` & GitHub Setup

This guide provides end-to-end, production-tested instructions to:
1. Push your project to GitHub from scratch.
2. Deploy the web frontend to your custom domain **`abeeboladipupo.com`** (using Vercel's global edge network at zero recurring cost).
3. Configure your custom domain DNS records (A & CNAME).
4. Deploy the Spring Boot backend API with free managed PostgreSQL & Redis.
5. Clone and run the project locally on any computer.

---

## 1. Initializing and Pushing to GitHub

If your project is not yet on GitHub, run these commands in your project root (`abeeboladipupo_portfolio`):

### Step 1.1: Initialize Git and Create Initial Commit
Open your terminal inside `/Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio`:

```bash
# Initialize local git repository
git init

# Verify root .gitignore is active
git status

# Stage all files
git add .

# Create initial commit
git commit -m "feat: complete portfolio platform with interactive demos, resume engine, and secret admin portal"
```

### Step 1.2: Create Repository on GitHub
1. Go to [GitHub.com](https://github.com) and sign in.
2. Click **New repository** (or visit [github.com/new](https://github.com/new)).
3. Set **Repository name**: `abeeboladipupo_portfolio` (or `portfolio`).
4. Set visibility: **Public** (recommended for recruiters) or **Private**.
5. Do **not** initialize with README or .gitignore (we already have both).
6. Click **Create repository**.

### Step 1.3: Link Remote and Push
Copy the repository URL from GitHub and run:

```bash
# Rename default branch to main
git branch -M main

# Add your GitHub remote (replace with your actual GitHub username)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/abeeboladipupo_portfolio.git

# Push your code to GitHub
git push -u origin main
```

---

## 2. Deploying Frontend to `abeeboladipupo.com` via Vercel (Recommended)

Vercel provides automatic global edge CDN delivery, instant SSL certificates, and zero-downtime rebuilds every time you push to GitHub—completely free.

### Step 2.1: Import Project into Vercel
1. Go to [Vercel.com](https://vercel.com) and log in using your GitHub account.
2. On your dashboard, click **"Add New..."** &rarr; **"Project"**.
3. Locate your `abeeboladipupo_portfolio` repository and click **"Import"**.

### Step 2.2: Configure Build Settings
In the Vercel configuration screen:
- **Framework Preset**: `Vite`
- **Root Directory**: Click "Edit" and choose `frontend`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default)

### Step 2.3: Set Environment Variables
Expand **"Environment Variables"** in Vercel and add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://api.abeeboladipupo.com` | Production Spring Boot API URL (or Render URL) |
| `VITE_ADMIN_PATH` | `/portal-admin-abeeb` | Your secret, non-public admin route |
| `VITE_ADMIN_SECRET_KEY` | `your-secure-passcode-2026` | Secret access key to unlock the admin console |
| `VITE_CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Optional Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `your-upload-preset` | Optional Cloudinary upload preset |

Click **"Deploy"**. Vercel will build your project in ~30 seconds and provide a temporary preview URL (e.g., `abeeboladipupo-portfolio.vercel.app`).

---

## 3. Connecting Your Custom Domain: `abeeboladipupo.com`

### Step 3.1: Add Domain in Vercel
1. In your Vercel Project dashboard, go to **Settings** &rarr; **Domains**.
2. Type `abeeboladipupo.com` and click **Add**.
3. Vercel will recommend adding both:
   - `abeeboladipupo.com`
   - `www.abeeboladipupo.com` (redirecting to apex)

### Step 3.2: Configure DNS Records in Your Domain Registrar
Log into wherever you purchased `abeeboladipupo.com` (e.g., Namecheap, GoDaddy, Cloudflare, Google Domains/Squarespace, Porkbun).

Go to your domain's **DNS Management / Advanced DNS** panel and add these records:

#### Record 1: Apex Domain (`abeeboladipupo.com`)
- **Type**: `A`
- **Host / Name**: `@` (or leave blank depending on registrar)
- **Value / Points to**: `76.76.21.21`
- **TTL**: Automatic (or 3600 seconds)

#### Record 2: Subdomain (`www.abeeboladipupo.com`)
- **Type**: `CNAME`
- **Host / Name**: `www`
- **Value / Points to**: `cname.vercel-dns.com`
- **TTL**: Automatic

> [!NOTE]
> DNS propagation typically takes between **2 and 30 minutes** (rarely up to 24 hours). Once verified, Vercel automatically generates and provisions a free, auto-renewing **Let's Encrypt SSL/TLS Certificate** for HTTPS.

---

### Step 3.3: Resolving "404 Not Found" on Sub-URLs (`/resume`, `/projects`, `/portal-admin-abeeb`)

#### Why this happens on web servers:
Single Page Applications (React + Vite) produce a single entry file (`index.html`). When a visitor loads `abeeboladipupo.com/`, the server serves `index.html`. But when a visitor directly types or refreshes `abeeboladipupo.com/resume`, unconfigured web servers look for a physical file named `/resume` on disk. If that file is missing, the web host returns a **404 Not Found**.

#### The 4-Layer Resolution Configured in this Repository:
We have built four complementary fail-safes so sub-URLs work on **any** web server:

1. **Vercel Rewrites ([`vercel.json`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/vercel.json) & [`frontend/vercel.json`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/frontend/vercel.json))**:
   Routes all incoming paths (`/(.*)`) directly to `/index.html`.
2. **Cloudflare Pages & Netlify ([`frontend/public/_redirects`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/frontend/public/_redirects))**:
   Automatically copied to `dist/_redirects`, telling edge CDNs to serve `/index.html` with status 200 for all paths (`/*  /index.html  200`).
3. **Apache / cPanel Hosting ([`frontend/public/.htaccess`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/frontend/public/.htaccess))**:
   Rewrites missing file/directory requests to `/index.html` using `mod_rewrite`.
4. **Physical Static HTML Fallback Generator ([`frontend/vite.config.ts`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/frontend/vite.config.ts))**:
   During `npm run build`, Vite automatically generates physical directory entrypoints:
   - `dist/resume/index.html`
   - `dist/projects/index.html`
   - `dist/portal-admin-abeeb/index.html`
   - `dist/404.html`
   This guarantees that even dumb static hosts with **zero** rewrite support will find physical files on disk and return 200 OK!
5. **Universal Hash Fallback**:
   Every route is also fully accessible via URL fragment hashes:
   - `https://abeeboladipupo.com/#/resume` or `https://abeeboladipupo.com/#resume`
   - `https://abeeboladipupo.com/#/projects` or `https://abeeboladipupo.com/#projects`
   - `https://abeeboladipupo.com/#/portal-admin-abeeb` (Secret Admin Console)

---

## 4. Alternative Frontend Hosting (Cloudflare Pages or Netlify)

### Option B: Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) &rarr; **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
2. Select repository &rarr; Root directory: `frontend`.
3. Build command: `npm run build` | Output directory: `dist`.
4. Add environment variables &rarr; Deploy.
5. In Custom Domains tab, click **Set up a custom domain** &rarr; enter `abeeboladipupo.com`.

### Option C: Netlify
1. Go to [Netlify.com](https://netlify.com) &rarr; **Add new site** &rarr; **Import from an existing project**.
2. Set base directory to `frontend` &rarr; Publish directory: `frontend/dist`.
3. Add environment variables &rarr; Deploy site &rarr; Domain management &rarr; Add `abeeboladipupo.com`.

---

## 5. Deploying the Spring Boot Backend (Render or Railway)

To enable live metrics and project persistence without paid infrastructure:

### Step 5.1: Create Free Managed Databases
1. **PostgreSQL**: Create a free serverless database on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com). Copy the PostgreSQL JDBC connection string.
2. **Redis**: Create a free serverless Redis cluster on [Upstash.com](https://upstash.com). Copy the endpoint host and port (default 6379).

### Step 5.2: Deploy Backend to Render.com
1. Go to [Render.com](https://render.com) &rarr; **New** &rarr; **Web Service**.
2. Select your GitHub repository `abeeboladipupo_portfolio`.
3. Settings:
   - **Root Directory**: `backend/abeeboladipupo_portfolio`
   - **Environment**: `Java` (or Docker)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/abeeboladipupo_portfolio-0.0.1-SNAPSHOT.jar`
4. Add Environment Variables in Render:
   - `DB_URL` = `jdbc:postgresql://<neon-host>/portfolio?sslmode=require`
   - `DB_USERNAME` = `<neon-user>`
   - `DB_PASSWORD` = `<neon-password>`
   - `REDIS_HOST` = `<upstash-host>`
   - `REDIS_PORT` = `6379`
5. Custom Domain: In Render settings, add custom domain `api.abeeboladipupo.com` with a CNAME record in your registrar pointing to your Render URL.

---

## 6. How to Run from GitHub on Any New Machine

To clone and run this project locally on any developer machine:

### Prerequisites
- Node.js 20+ installed (`node -v`)
- Java 21 installed (`java -version`) — optional if only previewing frontend

### Step 6.1: Clone the Repository
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/abeeboladipupo_portfolio.git
cd abeeboladipupo_portfolio
```

### Step 6.2: Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.
- The portfolio is 100% functional locally with built-in offline fallbacks even if the backend is not running.
- Access the Secret Admin Console at: **`http://localhost:5173/portal-admin-abeeb`** (Passcode: `abeeb-admin-2026`).

### Step 6.3: Run the Backend (Optional)
In a separate terminal:
```bash
cd backend/abeeboladipupo_portfolio
./mvnw spring-boot:run
```
The Spring Boot API will start on **`http://localhost:8080`**.

---

## 7. Automated CI/CD Testing via GitHub Actions

Every time you run `git push origin main`, GitHub Actions automatically runs the quality pipeline configured in [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml):
- Installs dependencies on Node.js 22.
- Runs `oxlint` static code analysis.
- Builds the TypeScript & Vite application.
- Sets up Java 21 and runs the JUnit test suite.
