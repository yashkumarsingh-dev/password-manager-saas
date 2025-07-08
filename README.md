# 🔐 Password Manager SaaS

A secure, full-featured **Password Manager SaaS** application built with **React (Vite)**, **Node.js**, **Express**, and **MongoDB**. Offers end-to-end encryption, tiered pricing plans, and **Razorpay** payment gateway integration. The UI is styled using **Tailwind CSS** and **shadcn/ui** components.

---

## 🌟 Features

- 🔐 Securely store and manage passwords
- 🔑 End-to-End Encryption (E2EE)
- 👤 JWT-based authentication and protected routes
- 🔁 Forgot Password & Reset flow
- 💳 Razorpay-based subscription system (Free & Pro)
- 📊 Usage restriction for free-tier (max 10 passwords)
- 🎨 Modern dark-themed UI using `shadcn/ui` and Tailwind
- 📱 Fully responsive design

---

## 💳 Pricing Plans

| Plan     | Price        | Features                                          |
|----------|--------------|---------------------------------------------------|
| Free     | ₹0/month     | 1 user, up to 10 saved passwords, basic support   |
| Pro      | ₹399/month   | 1 user, unlimited passwords, premium support      |

> Payments are processed via **Razorpay Checkout**, and webhook logic updates subscription status in real-time.

---

## 🚀 Tech Stack

### Frontend:
- React (Vite)
- Tailwind CSS
- shadcn/ui
- Razorpay Checkout integration

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- Razorpay SDK + Webhooks
- JWT Authentication

---

## 📂 Project Structure

password-manager-saas/
├── client/ # React frontend (Vite)
├── server/ # Express backend
├── README.md

---

## 🔐 API Endpoints

### Auth:
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login user and return token
- `POST /api/auth/forgot-password` – Send password reset link
- `POST /api/auth/reset-password` – Reset password via token

### Passwords:
- `GET /api/passwords` – Get all saved passwords
- `POST /api/passwords` – Add new password (limit 10 on Free plan)
- `DELETE /api/passwords/:id` – Delete a saved password

### Payment:
- `POST /api/payment/create-order` – Create Razorpay order
- `POST /api/payment/verify` – Verify Razorpay payment
- `POST /api/payment/webhook` – Handle webhook events
- `GET /api/payment/status` – Return current user's plan

---

## 💸 Razorpay Integration Flow

### Backend:
- Create order using Razorpay SDK (`razorpay.orders.create`)
- Verify the payment signature
- Update user's `isPro` flag and subscription details in MongoDB
- Enforce Free Plan restrictions (max 10 passwords)
- Listen to `payment.captured` via webhooks to auto-upgrade users

### Frontend:
- Dedicated `/pricing` route and section on landing page
- Razorpay Checkout launched on "Subscribe" click
- If not logged in → redirect to login
- If logged in → call `/create-order`, launch Checkout
- On payment success → call `/verify`, reflect "Pro" status in UI
- Add "Manage Plan" or "Upgrade" buttons conditionally for Pro/Free users

---

## 🎨 Pricing UI Design with `shadcn/ui`

Use this command to scaffold the pricing section:

```bash
npx shadcn@canary add https://www.shadcn-ui-blocks.com/r/pricing-sections__cards.json?token=
✅ Pricing UI Should:
•	✅ Include 2 pricing tiers (Free & Pro)
•	✅ Include Monthly/Annual toggle (optional)
•	✅ Highlight "Pro" as the most popular plan
•	✅ Match the existing dark mode theme and styling
The pricing section should be added both on the /pricing page and the landing page below the hero section.
________________________________________
⚙️ Environment Variables
Backend (server/.env)
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_key_secret
FRONTEND_URL=http://localhost:5173
Frontend (client/.env)
VITE_RAZORPAY_KEY_ID=rzp_test_...
________________________________________
🧪 Razorpay Test Payments
Use these in Test Mode:
•	Card: 4111 1111 1111 1111
•	Expiry: Any future date
•	CVV: Any 3-digit number
•	OTP: 123456
📚 Full list of test UPI/cards
________________________________________
🔐 Forgot Password Flow
1.	User enters email in the "Forgot Password" form
2.	Backend generates secure token and sends reset link
3.	User clicks link → opens /reset-password/:token
4.	Enters new password → verified → updated in DB
5.	Redirected to login page with success notification
________________________________________
🛠️ Local Setup
# Clone the repository
git clone https://github.com/YashSingh/password-manager-saas.git
cd password-manager-saas

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
Start the project:
# Terminal 1 (backend)
cd server
npm run dev

# Terminal 2 (frontend)
cd ../client
npm run dev
________________________________________
📦 Deployment Plan
Part	Platform
Frontend	Vercel / Netlify
Backend	Railway / Render
Database	MongoDB Atlas
You must deploy the backend with HTTPS enabled to use Razorpay in Live Mode.
________________________________________
📸 Screenshots
Add screenshots of:
•	Landing page
•	Pricing section
•	Razorpay checkout modal
•	Dashboard UI (password list)
________________________________________
🧑‍💻 Author
Made with ❤️ by Yash Kumar Singh
•	📧 yashkumarsingh@email.com
•	💼 LinkedIn
•	💻 GitHub
________________________________________
📄 License
Licensed under the MIT License.
