# Shortly – Intermediate URL Shortener

A solid intermediate-level full-stack URL shortener with authentication, custom short codes, click tracking, and a polished React frontend.

## Features (Phase 1 – Intermediate)

### Authentication
- User registration & login (JWT)
- Protected routes
- Users can only see and manage their own links

### URL Shortening
- Shorten any valid HTTP/HTTPS URL
- Optional **custom short codes** (e.g. `yourdomain.com/my-brand`)
- Automatic unique ID generation (nanoid)
- Duplicate detection per user

### Analytics & Management
- Click counter on every short link
- Dashboard with total links + total clicks
- Copy to clipboard
- Delete your own links

### Backend Quality
- Rate limiting (API + auth + create)
- Input validation (express-validator)
- Proper ownership checks
- Clean MVC structure
- Centralized error handling

### Frontend Quality
- Modern, clean UI with Tailwind CSS
- React Router + protected routes
- Auth context
- Toast notifications
- Loading states & empty states
- Responsive design
- Landing page + Login/Register + Dashboard

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, React Router, Tailwind, react-hot-toast |
| Backend   | Node.js, Express                    |
| Database  | MongoDB + Mongoose                 |
| Auth      | JWT + bcryptjs                      |
| Other     | nanoid, express-rate-limit, express-validator |

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (or Atlas connection string)

### 2. Install dependencies

```bash
# From project root
cd server && npm install
cd ../client && npm install
```

### 3. Environment variables

**server/.env**
```env
PORT=5000
DATABASE_URL=mongodb://127.0.0.1:27017/urlshortener
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
BASE_URL=http://localhost:5000
```

**client/.env**
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Run the app

```bash
# Terminal 1 – Backend
cd server
npm run dev

# Terminal 2 – Frontend
cd client
npm start
```

- Frontend → http://localhost:3000
- Backend  → http://localhost:5000

---

## API Overview

| Method | Endpoint              | Auth     | Description                |
|--------|-----------------------|----------|----------------------------|
| POST   | /api/auth/register    | Public   | Create account             |
| POST   | /api/auth/login       | Public   | Login                      |
| GET    | /api/auth/me          | Private  | Get current user           |
| POST   | /api/urls             | Private  | Create short URL           |
| GET    | /api/urls             | Private  | Get my URLs                |
| DELETE | /api/urls/:id         | Private  | Delete a URL               |
| GET    | /:shortUrlId          | Public   | Redirect + increment clicks|

---

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Navbar, ShortenerForm, UrlCard, ProtectedRoute
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Landing, Login, Register, Dashboard
│   │   └── App.js
│   └── package.json
├── server/
│   ├── controllers/        # auth.js, url.js
│   ├── middleware/         # auth.js, rateLimiter.js
│   ├── models/             # User.js, Url.js
│   ├── routes/             # auth.js, urls.js, index.js
│   ├── utils/              # generateUniqueId.js, validateUrl.js
│   └── server.js
└── README.md
```

---

## What makes this intermediate?

- Full authentication system with JWT
- Resource ownership (users only manage their own data)
- Custom short codes with conflict handling
- Rate limiting & input validation
- Clean separation of concerns
- Polished, production-style frontend UX
- Proper error handling and loading states

---

## Possible Next Steps (Phase 2)

- Link expiration
- Password-protected links
- Detailed analytics (charts, referrers, countries)
- QR code generation
- TypeScript conversion
- Docker + CI/CD
- Unit & integration tests
