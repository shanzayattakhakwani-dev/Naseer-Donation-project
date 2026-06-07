# NASEER – The Helper
### Full-Stack Humanitarian Donation Platform for Palestine

**Stack:** React.js · Node.js + Express · MongoDB Atlas · Socket.io · Anthropic Claude API

---

## Setup (3 Steps)

### 1. Configure Environment
```bash
cd backend
cp .env.example .env
```
Edit `.env` — you MUST fill in:
```
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/naseer
JWT_SECRET=any_long_random_string_at_least_32_chars
ANTHROPIC_API_KEY=sk-ant-...
```
Optional (for email receipts):
```
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 2. Install & Seed
```bash
# Backend
cd backend && npm install && npm run seed

# Frontend (new terminal)
cd frontend && npm install
```

### 3. Run
```bash
# Terminal 1 — Backend + Socket.io (port 5000)
cd backend && npm run dev

# Terminal 2 — React frontend (port 3000)
cd frontend && npm start
```

---

## Demo Accounts
| Role  | Email            | Password |
|-------|------------------|----------|
| Admin | admin@naseer.pk  | admin123 |
| Donor | maryam@naseer.pk | donor123 |

---

## All 12 Features

### 1. Real-Time Donation Feed (Socket.io)
- Every donation emits `new-donation` event server-side
- React `LiveFeed` component shows slide-in cards (bottom-left)
- `campaign-milestone` events fire at 50%, 75%, 100%
- Donor gets socket notification on their private room

### 2. NGO Verification System
- `POST /api/ngos/register` — submit NGO with documents
- Admin reviews at `GET /api/ngos?status=pending`
- `PATCH /api/ngos/:id/verify` — approve/reject/review
- Verification timeline tracks every stage
- Verified badge shown on campaign cards

### 3. PDF Donation Certificate
- Auto-generated with PDFKit after every donation
- Palestine flag header, QR code, Arabic/English text
- `GET /api/donations/pdf/:id` — download endpoint
- Download button in donor dashboard
- Email sent via Nodemailer (if configured)

### 4. AI Chatbot (Claude API)
- Streaming responses via SSE (`/api/ai/chat`)
- System prompt includes live campaign data
- Named "NASEER" — compassionate humanitarian tone
- Floating button (✦) on every page
- Typing animation, conversation history

### 5. Campaign Timeline
- MongoDB `timeline` array on each campaign
- Auto-events: created, 50/75/100% funded
- Admin adds manual events (title, description, date, photo)
- `POST /api/campaigns/:id/timeline` (admin only)
- Animated vertical timeline component on donate page

### 6. Social Sharing
- WhatsApp, X/Twitter, Facebook, LinkedIn buttons
- Copy link to clipboard with toast confirmation
- Dynamic text includes title, % funded, URL
- `ShareButtons` component on campaign page

### 7. Notification System
- MongoDB `Notification` model
- Socket.io push via user-specific rooms
- Bell icon with unread count badge in navbar
- `GET /api/notifications` + `PATCH /:id/read` + read-all
- Events: donation-confirmed, milestone, goal-reached, admin-approval

### 8. Goal Celebration (Confetti)
- When campaign hits 100%, server emits `goal-reached`
- `canvas-confetti` fires Palestine flag colors
- Full-screen overlay auto-appears, 8-second auto-dismiss
- All donors of that campaign get a notification

### 9. Multilingual (English / Urdu / Arabic)
- `react-i18next` with 3 complete translation files
- RTL support: `dir="rtl"` on `<html>` for Arabic
- Language switcher in navbar (EN / اردو / عربي)
- Preference saved to `localStorage`

### 10. Volunteer Module
- `Volunteer` model: name, email, skills, availability, city
- `POST /api/volunteers` — register
- Admin approves via dashboard (Volunteers tab)
- Downloadable PDF certificate on approval
- `/volunteer` page with registration form

### 11. About Us Page
- Mission, founding story, team section
- Live stats from database (campaigns, raised, donors)
- Team: Maryam Fraz, Shanzay Atta, Ayesha Khalid
- Palestine flag editorial design

### 12. Auth Fix
- JWT_SECRET validated on startup — server exits if missing
- Proper input validation on register (email format, password length, required fields)
- Clear error messages returned to frontend
- Auto-logout on 401 via axios interceptor

---

## API Reference

| Method | Route                        | Auth    | Description                  |
|--------|------------------------------|---------|------------------------------|
| POST   | /api/auth/register           | Public  | Register user                |
| POST   | /api/auth/login              | Public  | Login                        |
| GET    | /api/auth/me                 | Private | Current user                 |
| GET    | /api/campaigns               | Public  | List campaigns               |
| GET    | /api/campaigns/:id           | Public  | Get campaign                 |
| POST   | /api/campaigns               | Admin   | Create campaign              |
| PATCH  | /api/campaigns/:id           | Admin   | Update campaign              |
| DELETE | /api/campaigns/:id           | Admin   | Deactivate campaign          |
| POST   | /api/campaigns/:id/timeline  | Admin   | Add timeline event           |
| POST   | /api/donations               | Private | Make donation                |
| GET    | /api/donations/my            | Private | My donation history          |
| GET    | /api/donations/pdf/:id       | Private | Download PDF receipt         |
| GET    | /api/donations               | Admin   | All donations                |
| GET    | /api/donations/stats         | Admin   | Aggregated stats             |
| GET    | /api/ai/recommendations      | Optional| Campaign recommendations     |
| GET    | /api/ai/suggestions/:id      | Public  | Amount tier suggestions      |
| GET    | /api/ai/impact/:id           | Public  | AI impact statement          |
| POST   | /api/ai/generate-content     | Admin   | Generate campaign content    |
| POST   | /api/ai/chat                 | Public  | Streaming chatbot (SSE)      |
| POST   | /api/ngos/register           | Private | Register NGO                 |
| GET    | /api/ngos                    | Admin   | List NGOs                    |
| PATCH  | /api/ngos/:id/verify         | Admin   | Approve/reject NGO           |
| POST   | /api/volunteers              | Private | Register as volunteer        |
| GET    | /api/volunteers              | Admin   | List volunteers              |
| PATCH  | /api/volunteers/:id/approve  | Admin   | Approve volunteer            |
| GET    | /api/volunteers/certificate/:id| Private| Download volunteer cert    |
| GET    | /api/notifications           | Private | Get notifications            |
| PATCH  | /api/notifications/:id/read  | Private | Mark as read                 |
| PATCH  | /api/notifications/read-all  | Private | Mark all read                |
| GET    | /api/verify/:transactionId   | Public  | Verify donation by QR code   |
