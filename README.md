# VEYRA E-Commerce

Full-stack e-commerce application built with **React (Vite)**, **Node.js (Express)**, and **MongoDB**. 

## Architecture

- **Frontend**: React 18, Vite, React Router DOM, Axios, Tailwind CSS. State: AuthContext (JWT/user), CartContext (cart items synced with backend).
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT in HttpOnly cookies, bcrypt, Nodemailer (OTP emails).
- **Auth**: Register → OTP email → Verify → Login. Password reset: Forgot → OTP → Verify → Set new password. All tokens stored in HttpOnly cookies.
- **Cart & checkout**: Cart stored in MongoDB per user; React Context keeps UI in sync. Checkout supports “direct buy” (single product) or full cart with optional coupon.

## Project Structure

```
veyra-ecommerce/
├── client/                 # React (Vite) frontend
│   ├── src/
│   │   ├── pages/          # Route pages (Home, Shop, Cart, etc.)
│   │   ├── components/     # Layout, Navbar, Footer
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── services/      # api.js (Axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/             # User, Product, Cart, Order, Coupon, Blog
│   ├── controllers/
│   ├── routes/
│   ├── middleware/         # auth.js (JWT)
│   ├── utils/              # sendOTP.js (Nodemailer)
│   ├── server.js
│   └── .env
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- (Optional) SMTP for OTP emails; if not set, OTP is logged to console

### 1. Backend

Run these from the **server** folder (or use the root scripts below):

```bash
cd server
npm install
```

Create `.env` from the example (use one of these):

- **PowerShell:** `Copy-Item .env.example .env`
- **Cmd:** `copy .env.example .env`
- **Git Bash / Linux / macOS:** `cp .env.example .env`

Edit `.env` and set at least `MONGODB_URI` and `JWT_SECRET`. Then:

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

**Optional – seed products and coupons:**

```bash
cd server
node scripts/seed.js
```

### 2. Frontend

Run these from the **client** folder (or use the root scripts below):

```bash
cd client
npm install
npm run dev
```

Client runs at `http://localhost:5173` and proxies `/api` to the backend.

### Running from project root (optional)

From `veyra-ecommerce` (root) you can use:

| Command | Description |
|--------|-------------|
| `npm run dev:server` | Start backend (must run from root after `cd server` once to install deps) |
| `npm run dev:client` | Start frontend |
| `npm run seed` | Seed database (run after backend deps are installed in `server/`) |

Install dependencies in both folders first:

```bash
cd server && npm install && cd ../client && npm install
```

### 3. Environment variables (server `.env`)

| Variable       | Description                          |
|----------------|--------------------------------------|
| PORT           | Server port (default 5000)            |
| MONGODB_URI    | MongoDB connection string             |
| JWT_SECRET     | Secret for JWT signing                |
| JWT_EXPIRES_IN | Token expiry (e.g. 7d)               |
| CLIENT_URL     | Frontend origin (for CORS)            |
| SMTP_HOST      | Mail server host                     |
| SMTP_PORT      | Mail server port                     |
| SMTP_USER      | Mail user                            |
| SMTP_PASS      | Mail password                        |
| MAIL_FROM      | From address for OTP emails          |

### 4. Seed data (optional)

```bash
cd server
node scripts/seed.js
```

Adds sample products and coupons to MongoDB.

### 5. Static assets (photos)

Copy images from the original PHP project so the home page and category blocks display correctly:

- Source: `FRONTEND/photos/` (e.g. `cat-item1.jpg`, `cat-item2.jpg`, `cat-item3.jpg`, `single-image-2.jpg`)
- Target: `client/public/photos/`

## API routes overview

| Method | Route | Description |
|--------|--------|-------------|
| POST   | /api/auth/register | Register; sends OTP |
| POST   | /api/auth/verify-otp | Verify OTP, set auth cookie |
| POST   | /api/auth/resend-otp | Resend OTP |
| POST   | /api/auth/login | Login |
| POST   | /api/auth/logout | Clear auth cookie |
| GET    | /api/auth/me | Current user (protected) |
| POST   | /api/auth/forgot-password | Send reset OTP |
| POST   | /api/auth/verify-reset-otp | Verify reset OTP |
| POST   | /api/auth/reset-password | Set new password |
| GET    | /api/products | All products |
| GET    | /api/products/category/:category | Products by category (men, women, accessories) |
| GET    | /api/products/:id | Single product |
| GET    | /api/cart | Get cart (protected) |
| POST   | /api/cart/add | Add item (protected) |
| POST   | /api/cart/update | Update quantity (protected) |
| POST   | /api/cart/remove | Remove item (protected) |
| POST   | /api/orders | Create order (protected) |
| GET    | /api/orders | My orders (protected) |
| GET    | /api/orders/:id | Order by ID (protected) |
| GET    | /api/coupons | List coupons |
| POST   | /api/coupons/validate | Validate coupon code |
| GET    | /api/user/profile | User profile (protected) |
| GET    | /api/user/recommended | Recommended products (protected) |

## UI consistency

- PHP pages were converted to React components with the **same HTML structure and Tailwind CSS classes**.
- No layout or visual redesign; only the data source and navigation (e.g. `index.php?page=shop` → `/shop`) were changed to React and React Router.
- Shared layout (navbar, footer) and global styles (including footer and hero utilities) are preserved so the site looks the same as the original.

## Page mapping (PHP → React)

| PHP Page            | React Route / Page        |
|---------------------|---------------------------|
| index.php (dashboard) | / (Home.jsx)            |
| shop.php            | /shop (Shop.jsx)          |
| MEN.php             | /men (Men.jsx)            |
| womensshopping.php  | /women (Women.jsx)        |
| accessories.php     | /accessories (Accessories.jsx) |
| productdetails.php  | /product/:id (ProductDetails.jsx) |
| cart.php            | /cart (Cart.jsx)          |
| shipping.php + Payment.php | /checkout (Checkout.jsx) |
| order_confirmation.php | /order-confirmation/:orderId (OrderConfirmation.jsx) |
| profile.php         | /profile (Profile.jsx)    |
| blog.php            | /blog (Blog.jsx)          |
| contact.php         | /contact (Contact.jsx)    |
| Login.php           | /login (Login.jsx)        |
| Signup.php          | /signup (Signup.jsx)      |
| Otp.php             | /otp → redirects to /signup |
| forgot_password.php | /forgot-password (ForgotPassword.jsx) |
| reset_verify.php    | /reset-verify (ResetVerify.jsx) |

## License

Same as the original project.
