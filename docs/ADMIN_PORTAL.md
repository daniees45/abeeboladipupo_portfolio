# Private Admin Portal Architecture & Security Guide

**Module:** `frontend/src/features/admin/AdminPortalPage.tsx`  
**Router:** `frontend/src/lib/router.ts`  
**Default Secret Route:** `/portal-admin-abeeb` (or `#/portal-admin-abeeb`)  
**Default Access Key:** `abeeb-admin-2026`  

---

## 1. Architectural Overview

To ensure the public portfolio remains focused on recruiters, clients, and hiring managers, all administrative operations have been **completely decoupled from the public landing page** and moved to an isolated, private portal.

The public website:
- Contains **no admin UI components** (Operations Cards, Project Form, or Photo Upload are stripped from public bundles/pages).
- Contains **no "Admin" links** in the navbar, footer, or sitemap.
- Visitors browsing the public site have no indication that an admin management console exists.

---

## 2. Page & Routing Architecture

The application provides a modular multi-page experience:

| Route Path | Description | Access Control |
| :--- | :--- | :--- |
| `/` (or `#/`) | **Main Portfolio Showcase** – Hero, About, Selected Projects, Live Sandbox, Résumé Preview, Process, Contact | Public |
| `/resume` (or `#/resume`) | **Dedicated Résumé Page** – Full-screen role template switcher, live formatting, and Word DOC/Markdown/PDF exports | Public |
| `/projects` (or `#/projects`) | **Dedicated Projects Page** – Expanded project catalog and interactive testing sandbox suite | Public |
| `/[secret-admin-path]` | **Private Admin Portal** – Operations Overview, Project Publishing, and Media Asset Manager | **Private / Authenticated** |

---

## 3. Secret URL & Access Key Configuration

The admin portal is guarded by two layers of obscurity and authentication:

### Layer 1: Secret URL Path
The path to the admin console is intentionally secret and known only to the site owner. It is configured via environment variables:

```env
# frontend/.env
VITE_ADMIN_PATH=/portal-admin-abeeb
```

- To change your secret URL, update `VITE_ADMIN_PATH` in `frontend/.env` (e.g., `VITE_ADMIN_PATH=/my-confidential-gateway-9872`).
- Both HTML5 pathname (`/your-path`) and hash routing (`#/your-path`) are supported out-of-the-box, ensuring compatibility on static CDNs (Vercel, GitHub Pages) without 404 rewrite errors.

### Layer 2: Session Security Gate
Even if an unauthorized user guesses the secret URL, they are presented with a **Restricted Security Gate**:
- Prompt: Requires the **Secret Access Key**.
- Configuration:
  ```env
  # frontend/.env
  VITE_ADMIN_SECRET_KEY=your-secure-passcode
  ```
- Session Persistence: Successful authentication stores a session token in `sessionStorage` (`admin_session_auth=true`) which automatically clears when the browser tab is closed.
- Lockout: Clicking **"Lock & Exit"** immediately clears the session and returns to the lock screen.

---

## 4. Admin Portal Features

Once unlocked, the private console provides three dedicated operational tabs:

1. **Operations & System Health (`AdminManagementPanel`)**:
   - Live aggregated project counts and visitor view telemetry.
   - Real-time Redis cache hit status.
   - Content approvals, system uptime indicators, and deployment health overview.
2. **Project Management (`ProjectManagementPanel`)**:
   - Interactive project drafting form (Title, Summary, Stack, GitHub URL, Demo URL).
   - Instant synchronization with the portfolio dataset (`addProject` state hook).
   - Prepared for direct Spring Boot PostgreSQL persistence (`POST /api/v1/projects`).
3. **Media & Assets (`PhotoUploadPanel`)**:
   - Local image preview generator.
   - Pre-populated Cloudinary credentials from `.env` (`VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`).
   - Direct image asset upload to Cloudinary.

---

## 5. Production Hardening Checklist

When deploying to production:
1. Change `VITE_ADMIN_PATH` to a randomized, non-guessable slug.
2. Change `VITE_ADMIN_SECRET_KEY` to a strong alphanumeric password.
3. Keep `frontend/.env` listed in `.gitignore` (already configured).
4. For backend API operations, attach an `Authorization: Bearer <JWT>` header from Spring Security to verify requests server-side.
