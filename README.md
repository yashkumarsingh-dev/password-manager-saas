# 🔐 Password Manager SaaS

A modern, secure, and production-ready **Password Manager SaaS** built with **React (Vite)**, **Node.js/Express**, and **MongoDB Atlas**. Features robust authentication, end-to-end encryption, a beautiful dark UI, and a seamless **Razorpay** subscription system.

---

## 🌟 Features

- Securely store and manage passwords (vault)
- End-to-End Encryption (E2EE) for all credentials
- JWT-based authentication and protected routes
- Two-Factor Authentication (2FA) with TOTP
- Password reset via email (Gmail SMTP or SendGrid)
- Free plan: 1 user, up to 10 passwords, basic features
- Pro plan: 1 user, unlimited passwords, premium features (sharing, priority support)
- Razorpay-based subscription and payment flow
- Pro badge and UI for subscribed users
- Export/import passwords (CSV, PDF)
- Modern, responsive UI with **Tailwind CSS** and **shadcn/ui**
- Dark mode by default

---

## 💳 Pricing Plans

| Plan | Price      | Features                                      |
| ---- | ---------- | --------------------------------------------- |
| Free | ₹0/month   | 1 user, up to 10 passwords, basic features    |
| Pro  | ₹399/month | 1 user, unlimited passwords, premium features |

> Payments are processed via **Razorpay Checkout**. Pro status is activated instantly after payment verification.

---

## 🚀 Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS
- shadcn/ui
- Razorpay Checkout integration

**Backend:**

- Node.js + Express
- MongoDB Atlas + Mongoose
- Razorpay SDK
- JWT Authentication

---

## 📂 Project Structure

```
password-manager-saas/
├── client/   # React frontend (Vite)
├── server/   # Express backend
├── README.md
```

---

## 🔐 API Endpoints (Key)

### Auth:

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login user and return token & userId
- `GET /api/auth/me` – Get current user's status (Pro/Free)
- `POST /api/auth/request-reset` – Send password reset link
- `POST /api/auth/reset-password` – Reset password via token

### Vault:

- `GET /api/vault/list` – Get all saved passwords
- `POST /api/vault/add` – Add new password (limit 10 on Free plan)
- `PUT /api/vault/edit/:id` – Edit a saved password
- `DELETE /api/vault/delete/:id` – Delete a saved password
- `GET /api/vault/export/csv` – Export passwords as CSV
- `GET /api/vault/export/pdf` – Export passwords as PDF

### Payment:

- `POST /api/payment/create-order` – Create Razorpay order
- `POST /api/payment/verify-payment` – Verify Razorpay payment and activate Pro

---

## 💸 Razorpay Integration Flow

- User clicks "Subscribe" on the Pro plan (must be logged in)
- Frontend calls `/api/payment/create-order` to get a Razorpay order
- Razorpay Checkout modal is launched
- On payment success, frontend calls `/api/payment/verify-payment`
- If verified, user is upgraded to Pro (unlimited passwords, premium features)
- Pro status is always synced from the backend

### 🧪 Test Payments (Razorpay Test Mode)

- **Card:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3-digit number
- **OTP:** 123456
- [Full list of test cards & UPI](https://razorpay.com/docs/payments/payment-gateway/test-card-upi-details/)

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_key_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

---

## 🛠️ Local Setup

```bash
# Clone the repository
https://github.com/YashSingh/password-manager-saas.git
cd password-manager-saas

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Start the backend
npm run dev

# Start the frontend (in a new terminal)
cd ../client
npm run dev
```

---

## 🌐 Production Deployment

- **Frontend:** Vercel / Netlify
- **Backend:** Railway / Render / Any Node.js host
- **Database:** MongoDB Atlas
- Set all environment variables in your deployment platform
- Use HTTPS for backend in production (required by Razorpay Live Mode)

---

## 📸 Screenshots

- Landing page
- Pricing page
- Razorpay checkout modal
- Dashboard (password list)

_(Add screenshots here)_

---

## 👤 Author

Made with ❤️ by Yash Kumar Singh

- 📧 yashksingh.dev@email.com
- 💼 [LinkedIn](#)
- 💻 [GitHub](#)

---

## 📄 License

Licensed under the MIT License.
