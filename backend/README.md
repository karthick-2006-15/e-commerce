#  Full-Stack E-Commerce Platform

> A production-ready online bakery and snack store for a real Chennai business — featuring a customer storefront, admin dashboard, and REST API with live MongoDB sync.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white)

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🛒 Customer Storefront | [swamy-bakery.vercel.app](https://swamy-bakery.vercel.app) |



> **Note:** Backend is on Render free tier — first request may take ~30s to wake up.

---

## ✨ Features

### 🛍️ Customer Storefront
- Browse products by category with search and price filters
- Product detail page with image, quantity selector, and tabs
- Cart with quantity controls, promo code validation, and order summary
- Checkout with address form, delivery slot picker, and Razorpay / COD payment
- Order tracking page — auto-loads last order with live status progress bar
- Wishlist persisted in localStorage
- Guest login prompt before checkout with auto-redirect after login
- Skeleton loaders, toast notifications, smooth SPA navigation

### 🔧 Admin Dashboard
- Dashboard with revenue, order, customer, and product stats + weekly chart
- Full product CRUD — add/edit/delete with image upload and category assignment
- Category management — add with custom image URL or file upload
- Coupon management — create percent/flat discounts, toggle active, set min order
- Order management — view all orders, update status
- All changes sync instantly to the storefront via MongoDB

### ⚙️ Backend API
- RESTful API with Express and MongoDB (Mongoose)
- JWT authentication for all admin routes
- Public routes for storefront (products, orders, coupons)
- Auto-generated order IDs (e.g. `SWM-2024-00125`)
- Rate limiting, CORS, and global error handling

---

## 🗂️ Project Structure

```
swamybakery/
├── backend/
│   ├── routes/
│   │   ├── products.js      # Product CRUD
│   │   ├── orders.js        # Order create + fetch
│   │   ├── users.js         # Register + login (JWT)
│   │   ├── categories.js    # Category CRUD
│   │   └── coupons.js       # Coupon CRUD
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── .env
│   └── server.js
├── frontend/
│   ├── swamy-bakery.html    # Customer storefront (single file SPA)
│   └── admin.html           # Admin panel (single file SPA)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (for payment testing)

### 1. Clone the repo
```bash
git clone https://github.com/karthick-2006-15/e-commerce.git
cd e-commerce
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the server:
```bash
node server.js
# ✅ MongoDB connected
# 🍰 Swamy Bakery API running at http://localhost:5000
```

### 3. Run the frontend
Open `frontend/swamy-bakery.html` in a browser, or use Live Server in VS Code.

For admin panel, open `frontend/admin.html`.



## 📡 API Endpoints

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | ❌ | List all (filter by category, price, sort) |
| GET | `/api/products/:id` | ❌ | Single product |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | ❌ | Place order (public) |
| GET | `/api/orders/all` | ❌ | All orders (admin view) |
| GET | `/api/orders/:orderId` | ❌ | Single order by ID |

### Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/categories` | ❌ | List all categories |
| POST | `/api/categories` | ✅ | Create category |
| PUT | `/api/categories/:id` | ✅ | Update category |
| DELETE | `/api/categories/:id` | ✅ | Delete category |

### Coupons
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/coupons` | ❌ | List all coupons |
| POST | `/api/coupons` | ✅ | Create coupon |
| PUT | `/api/coupons/:id` | ✅ | Toggle / update coupon |
| DELETE | `/api/coupons/:id` | ✅ | Delete coupon |

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register user |
| POST | `/api/users/login` | Login → returns JWT |

---

## 💳 Payment Testing (Razorpay)

Use these test card details on the checkout page:

| Field | Value |
|---|---|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | `123456` |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary font | Playfair Display + DM Sans (Google Fonts) |
| Cream | `#FBF6EE` |
| Brown | `#5C3D1E` |
| Orange | `#E8763A` |
| Border radius | `20px` (cards), `100px` (pills) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript (no frameworks) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JSON Web Tokens (JWT) |
| Payments | Razorpay |
| Deployment | Render (backend) + Vercel / Netlify (frontend) |

---

## 📦 Deployment

### Backend → Render
1. Push backend folder to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
4. Build command: `npm install` | Start command: `node server.js`

### Frontend → Vercel / Netlify
Drag and drop the `frontend/` folder — no build step needed.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

MIT © [Karthick](https://github.com/karthick-2006-15)

---

<p align="center">Made with ❤️ in Chennai 🇮🇳</p>
