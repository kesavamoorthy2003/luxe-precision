# Luxe Precision

Luxe Precision is a modern, full-stack, responsive eCommerce web application designed with a premium aesthetic. It features a complete shopping flow from product discovery to checkout, integrated payment processing, user profile management, and a comprehensive Admin Dashboard.

## 🚀 Features

### **Storefront & Shopping Experience**
- **Dynamic Landing Page**: Features high-quality Unsplash fallbacks, animated "Trending Now" sections, and dynamic brand storytelling.
- **Product Catalog**: Browse products by category (`electronics`, `audio`, `wearables`, `fashion`, `editorial`, `collections`, etc.).
- **Product Details Page**: View detailed specifications, multiple images, and Add to Cart / Buy Now options.
- **Cart & Wishlist**: Global state management synced with the backend database.
- **Checkout Flow**: Support for managing multiple shipping addresses, viewing order summaries, and completing payments.

### **Authentication & User Profiles**
- **JWT-Based Auth**: Secure Login and Registration system using `bcryptjs` and JSON Web Tokens.
- **User Dashboard**: Users can update their profile info, upload an avatar, and change their password securely.
- **Address Management**: Full CRUD capability for shipping addresses. Users can maintain multiple addresses and set a primary one.
- **Order History**: Users can view past orders, payment statuses, and detailed receipts.

### **Admin Dashboard (`/admin`)**
*Protected route accessible only to users with the `ADMIN` role.*
- **Overview Metrics**: At-a-glance cards showing Total Revenue, Total Orders, Total Customers, and Active Products.
- **Order Management**: View detailed order summaries. Directly update the fulfillment status (Processing, Shipped, Delivered, Cancelled).
- **Product CRUD**: Add, Edit, and Delete products from the catalog. Features image URLs, stock management, and "New Arrival" toggles.
- **Customer Management**: View all registered users and their primary address. Change user roles (`USER` <-> `ADMIN`) and safely delete accounts. Administrators can also create new users and input their address details directly from the dashboard.

### **Payments**
- **Razorpay Integration**: Integrated payment gateway supporting UPI (QR & Collect), Credit/Debit Cards, Netbanking, and Wallets.

---

## 🛠️ Technology Stack

### **Frontend**
- **React 19** (Vite)
- **Tailwind CSS 4** (Utility-first styling for a dark-mode premium look)
- **Framer Motion** (Smooth page transitions and scroll animations)
- **React Router v7** (Client-side routing)
- **Axios** (API requests with automatic token injection)
- **Lucide React** (Consistent, high-quality iconography)

### **Backend**
- **Node.js** & **Express 5** (RESTful API architecture)
- **PostgreSQL** (Relational Database)
- **Prisma ORM** (Database schema management, migrations, and safe querying)
- **JWT** & **Bcryptjs** (Authentication & password hashing)
- **Razorpay SDK** (Payment order generation and signature verification)
- **Multer** (Handling avatar image uploads)

---

## 📦 Project Structure

```text
luxe-precision/
├── Backend/                 # Node.js + Express API
│   ├── prisma/              # Prisma schema & seed scripts
│   ├── src/                 
│   │   ├── config/          # Database & environment config
│   │   ├── controllers/     # Route logic (Admin, Auth, Cart, Products, etc.)
│   │   ├── middleware/      # JWT protection & Multer upload handling
│   │   ├── routes/          # Express router definitions
│   │   └── utils/           # Helper functions (Password hashing)
│   ├── uploads/             # Locally stored user avatars
│   └── server.js            # Entry point
│
└── frontend/                # React + Vite application
    ├── src/                 
    │   ├── components/      # Reusable UI components (Navbar, Footer, etc.)
    │   ├── context/         # Global Cart & Wishlist context providers
    │   ├── pages/           # Main views (Home, Checkout, UserProfile, etc.)
    │   │   └── admin/       # Modular Admin Dashboard components
    │   ├── services/        # Axios API clients
    │   ├── App.jsx          # Route definitions
    │   └── index.css        # Global Tailwind styles
    └── vite.config.js       # Vite configuration
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database (running locally or via a cloud provider)
- Razorpay Account (Test Mode API Keys)

### 2. Environment Variables
Create a `.env` file in the `Backend` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/luxe_precision"
JWT_SECRET="your_jwt_secret"
REFRESH_SECRET="your_refresh_secret"
RAZORPAY_KEY_ID="rzp_test_yourkey"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
CLIENT_URL="http://localhost:5173"
```

Create a `.env` file in the `frontend` directory:
```env
VITE_RAZORPAY_KEY_ID="rzp_test_yourkey"
```

### 3. Database Initialization
```bash
cd Backend
npm install
npx prisma generate
npx prisma db push

# Optional: Seed the database with initial products
node prisma/seed.js
```

### 4. Running the App
Open two terminals to run the frontend and backend concurrently.

**Backend Terminal:**
```bash
cd Backend
npm run dev
```

**Frontend Terminal:**
```bash
cd frontend
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🛡️ License
This project is proprietary and confidential.
