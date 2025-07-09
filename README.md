# 🔐 Password Manager SaaS

A modern, secure, and production-ready **Password Manager SaaS** built with **React (Vite)**, **Node.js/Express**, and **MongoDB Atlas**. Features robust authentication, end-to-end encryption, a beautiful dark UI, and a seamless **Razorpay** subscription system.

---

## 🌟 Features

- Securely store and manage passwords (vault)
- End-to-End Encryption (E2EE) for all credentials
- JWT-based authentication and protected routes
- **Two-Factor Authentication (2FA) with TOTP**
  - _Requires an authenticator app (Google Authenticator, Microsoft Authenticator, Authy, etc.)_
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

## 🔐 Security & Authentication

### Registration & 2FA Setup

- **During registration, you must scan a QR code with an authenticator app (Google Authenticator, Microsoft Authenticator, Authy, etc.).**
- After submitting your email and password, a QR code and otpauth URL will be shown.
- Open your authenticator app, add a new account, and scan the QR code or enter the secret manually.
- You will use the 6-digit code from your app to log in (TOTP-based 2FA).

### Login

- Enter your email, password, and the current 2FA code from your authenticator app.
- If the 2FA code is incorrect or missing, login will fail.

### Password Reset

- Use the "Forgot your password?" link on the login page.
- Enter your email to receive a secure reset link (expires in 30 minutes).
- Set a new password via the link, then log in with your new credentials and 2FA code.

### Security Best Practices

- All passwords are encrypted with strong cryptography before storage.
- 2FA is enforced for all users.
- JWT tokens are used for secure session management.
- Sensitive data (passwords, 2FA secrets) are never sent in plain text.
- Always use a strong, unique password and enable 2FA on your email account as well.

---

## 🔐 API Endpoints (Key)

### Auth:

- `POST /api/auth/register` – Register a new user (returns 2FA QR code URL)
- `POST /api/auth/login` – Login user and return token & userId (requires 2FA code)
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

## ❓ FAQ

**Q: Do I need an authenticator app?**
A: Yes. You must download an authenticator app (Google Authenticator, Microsoft Authenticator, Authy, etc.) to complete registration and log in. This app generates the 6-digit 2FA codes required for secure access.

**Q: What if I lose access to my authenticator app?**
A: You will need to reset your account via the password reset flow and re-register 2FA. For additional help, contact support.

**Q: Is my data encrypted?**
A: Yes. All passwords are encrypted with strong cryptography before being stored in the database.

**Q: Can I export my passwords?**
A: Yes. You can export your vault as CSV or PDF from the dashboard.

**Q: What happens if I reach the Free plan limit?**
A: You will be prompted to upgrade to Pro to store more than 10 passwords.

---

## 👤 Author

Made with ❤️ by Yash Kumar Singh

- 📧 yashkumarsingh@email.com
- 💼 [LinkedIn](#)
- 💻 [GitHub](#)

---

## 📄 License

Licensed under the MIT License.
