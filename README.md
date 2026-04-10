# Activity 17 - Improved ExpressJS API with Front-End

Full-stack application with Express.js backend and React frontend implementing:

1. **CRUD with Image** — Products entity with image upload
2. **User Profile** — Edit name and profile picture
3. **Email Registration** — Sends verification link via email
4. **Email Verification** — Users cannot log in until verified
5. **Forgot Password** — Sends reset link via email
6. **Login/Logout** — JWT-based authorization

## Tech Stack

- **Backend:** Express.js, MySQL, JWT, Multer, Nodemailer, bcryptjs
- **Frontend:** React (Vite), React Router, Axios, React Hot Toast

## Setup

### 1. Database
```bash
mysql -u your_user -p < backend/database.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # Edit with your DB and email credentials
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (Backend `.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5001) |
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | JWT signing secret |
| `SMTP_HOST` | Email SMTP host |
| `SMTP_PORT` | Email SMTP port |
| `SMTP_USER` | Email address |
| `SMTP_PASS` | Email password/app password |
| `FRONTEND_URL` | Frontend URL for email links |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/verify/:token` — Verify email
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password/:token` — Reset password

### Users
- `GET /api/users/profile` — Get profile (auth required)
- `PUT /api/users/profile` — Update profile with picture (auth required)

### Products (all require auth)
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get single product
- `POST /api/products` — Create product with image
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product
