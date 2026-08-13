# 🔗 Shortly — Full-Stack URL Shortener

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

A modern, full-stack URL shortening service built with the MERN stack (MongoDB, Express, React, Node.js). Features JWT authentication, custom short aliases, real-time click tracking, and a clean, responsive dashboard.

**[🔗 Live Demo](#) · [🐛 Report a Bug](../../issues) · [✨ Request a Feature](../../issues)**

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Security](#-security)
- [Deployment Guide](#-deployment-guide)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication** — secure registration & login with persistent sessions
- **Protected routes** — user-specific dashboard isolation, enforced on both client and server
- **Rate limiting** — separate limiters for general API, auth, and link-creation endpoints to deter abuse
- **Input validation** — request sanitization and URL validation via `express-validator`

### 🔗 Link Management
- **Instant shortening** — shortens any valid `http://` or `https://` target URL
- **Custom slugs** — optional custom aliases (`yourdomain.com/my-brand`)
- **Collision handling** — automatic unique ID fallback powered by `nanoid`
- **Ownership-scoped dashboard** — view, copy, or delete only the links you created

### 📊 Analytics & Quality of Life
- **Click counter** — real-time click tracking on every redirect
- **Polished UX** — Tailwind CSS UI, toast notifications (`react-hot-toast`), and considered loading/empty states
- **Fully responsive** — works cleanly from mobile to desktop

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Tailwind CSS, `react-hot-toast` |
| **Backend** | Node.js, Express.js (MVC architecture) |
| **Database** | MongoDB + Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), `bcryptjs` |
| **Utilities** | `nanoid`, `express-rate-limit`, `express-validator` |

---

## 📁 Project Structure

```text
url-shortener/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Navbar, ShortenerForm, UrlCard, ProtectedRoute...
│   │   ├── context/        # Global auth context & state
│   │   ├── pages/          # Landing, Login, Register, Dashboard
│   │   └── App.js          # Router config & entrypoint
│   └── package.json
├── server/                 # Express REST API
│   ├── controllers/        # Request handlers (auth.js, url.js)
│   ├── middleware/         # Auth verification & rate limiters
│   ├── models/             # Mongoose schemas (User.js, Url.js)
│   ├── routes/             # API endpoint definitions
│   ├── utils/               # nanoid generation, URL validation
│   └── server.js           # Server entrypoint
├── install.sh              # One-step dependency installation
├── run.sh                  # One-step local dev startup
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.x`
- npm or yarn
- MongoDB running locally, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# Automated setup (Linux/macOS)
chmod +x install.sh && ./install.sh
```

Or install manually:

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Configure environment variables

See [Environment Variables](#-environment-variables) below, then start the app:

```bash
# Automated (runs both client and server)
chmod +x run.sh && ./run.sh
```

Or manually, in two terminals:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — frontend (http://localhost:3000)
cd client && npm start
```

---

## 🔐 Environment Variables

Copy each `.env.example` to `.env` and fill in real values. **Never commit `.env` files** — they're already covered by `.gitignore`.

**`server/.env`**
```env
PORT=5000
DATABASE_URL=mongodb://127.0.0.1:27017/urlshortener
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
BASE_URL=http://localhost:5000
```

**`client/.env`**
```env
REACT_APP_API_URL=http://localhost:5000
```

> 💡 Generate a strong `JWT_SECRET` with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

---

## 📡 API Overview

### Auth routes (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new account |
| `POST` | `/api/auth/login` | Public | Authenticate and receive a JWT |
| `GET` | `/api/auth/me` | Private | Get the current authenticated user |

### URL routes (`/api/urls`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/urls` | Private | Shorten a URL (optional custom code) |
| `GET` | `/api/urls` | Private | Get all URLs owned by the current user |
| `DELETE` | `/api/urls/:id` | Private | Delete a URL you own |
| `GET` | `/:shortUrlId` | Public | Redirect to the original URL and increment clicks |

`Private` routes require an `Authorization: Bearer <token>` header.

---

## 🛡 Security

- Passwords are hashed with `bcryptjs` before storage — plaintext passwords are never persisted.
- JWTs are short-lived by default (`7d`) and configurable via `JWT_EXPIRE`.
- Every write on `/api/urls` re-checks resource ownership server-side, not just on the client.
- Auth and creation endpoints are rate-limited separately from general API traffic to blunt brute-force and spam attempts.
- All user-submitted URLs are validated server-side before being stored or redirected to.

---

## 🌐 Deployment Guide (Free-Tier Stack)

This app deploys cleanly as three pieces: a hosted database, a backend web service, and a static frontend.

### 1. Database — MongoDB Atlas
1. Create a free **M0 cluster** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a database user and password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) to start.
4. Copy your connection string:
   `mongodb+srv://<user>:<password>@cluster0.mongodb.net/urlshortener`

### 2. Backend — Render
1. Create a new **Web Service** on [Render](https://render.com), connected to your GitHub repo.
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRE`, `BASE_URL`.
5. Deploy, then note the live URL (e.g. `https://your-app.onrender.com`).

### 3. Frontend — Vercel
1. Import your repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `client` and **Framework Preset** to *Create React App*.
3. Add environment variable `REACT_APP_API_URL` pointing to your Render backend URL.
4. Deploy — Vercel gives you a live URL (e.g. `https://your-app.vercel.app`).

### 4. Lock down CORS
In `server/server.js`, restrict CORS to your live frontend origin instead of allowing all origins:

```js
app.use(cors({ origin: 'https://your-app.vercel.app' }));
```

Redeploy the backend after this change. Free-tier Render services spin down when idle, so the first request after inactivity may take 30–60 seconds to wake up — upgrade to a paid plan to remove that delay if needed.

---

## 🗺 Roadmap

- [ ] QR code generation for shortened links
- [ ] Password-protected short links
- [ ] Link expiration dates / auto-cleanup
- [ ] Detailed analytics (referrers, location, device breakdown)
- [ ] TypeScript conversion
- [ ] Docker + Docker Compose
- [ ] CI/CD pipeline with automated tests

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

Please open an issue first for major changes so we can discuss the approach.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
