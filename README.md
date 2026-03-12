# 🛒 E-Commerce Platform

A full-stack e-commerce solution consisting of three applications: a **customer-facing storefront**, an **admin dashboard**, and a **REST API backend**.

---

## 🌐 Live Demo

| App | URL |
|---|---|
| 🛍️ User Storefront | [ashoppp.vercel.app](https://ashoppp.vercel.app/) |
| �️ Admin Panel | [admin-ashoppp.vercel.app](https://admin-ashoppp.vercel.app/) |
| ⚙️ Backend API | [ashoppp.onrender.com](https://ashoppp.onrender.com) |

---

## �🗂️ Project Structure

```
ecommerce-app/
├── frontend/    # Customer storefront (React + Vite)
├── admin/       # Admin dashboard (React + Vite + DaisyUI)
└── backend/     # REST API server (Node.js + Express + MongoDB)
```

---

## 🚀 Tech Stack

### Frontend (Customer Storefront)
| Technology | Version |
|---|---|
| React | 19 |
| Vite | 7 |
| TailwindCSS | 4 |
| React Router | 7 |
| TanStack Query | 5 |
| Clerk (Auth) | 5 |
| Axios | 1 |
| Lucide React | latest |

### Admin Panel
| Technology | Version |
|---|---|
| React | 19 |
| Vite | 7 |
| TailwindCSS | 4 |
| DaisyUI | 5 |
| React Router | 7 |
| TanStack Query | 5 |
| Clerk (Auth) | 5 |
| Axios | 1 |
| Lucide React | latest |

### Backend API
| Technology | Version |
|---|---|
| Node.js | ≥ 20 |
| Express | 5 |
| MongoDB + Mongoose | 9 |
| Clerk SDK (`@clerk/express`) | 1 |
| Cloudinary | 2 |
| Inngest (background jobs) | 3 |
| Multer (file uploads) | 2 |

---

## ✨ Features

### 🛍️ Customer Storefront (`/frontend`)

- **Authentication** — Clerk-powered sign-in with **Google** and **Apple** OAuth. Includes an SSO callback route (`/sso`) to complete the sign-in flow.
- **Product Listing** — Browse products with real-time search and category filtering (All, Electronics, Fashion, Sports, Books). Desktop view features a horizontal filter sidebar for optimal space usage.
- **Wishlist** — Toggle products in/out of a personal wishlist with heart icons.
- **Cart Management** — Add items, adjust quantities with `+`/`-` controls, remove items, and view a live order summary (subtotal + ₹10 shipping). Fully optimised desktop layout.
- **Profile Page** — View and manage account details. Optimised two-column desktop layout with navigation links to other sections.
- **Address Management** — Full CRUD for saved delivery addresses. Set a default address, add/edit/delete addresses via a modal form. Desktop view uses a responsive card grid layout.
- **Protected Routes** — Unauthenticated users are redirected to `/login`.

**Routes:**
| Path | Page |
|---|---|
| `/login` | Login (Google / Apple OAuth) |
| `/sso` | SSO callback handler |
| `/home` | Product listing |
| `/cart` | Shopping cart |
| `/profile` | User profile |
| `/addresses` | Saved addresses |

---

### 🖥️ Admin Dashboard (`/admin`)

- **Dashboard Overview** — Key metrics and store performance at a glance.
- **Product Management** — Full CRUD with Cloudinary image uploads.
- **Order Management** — View and update order statuses.
- **Customer Management** — Browse and manage registered customers.
- **Secure Access** — Clerk-protected; non-admin users are redirected to login.

**Routes:**
| Path | Page |
|---|---|
| `/login` | Admin sign-in |
| `/dashboard` | Overview & metrics |
| `/products` | Product CRUD |
| `/orders` | Order management |
| `/customers` | Customer records |

---

### ⚙️ Backend API (`/backend`)

**Base URL:** `http://localhost:3000`

| Route prefix | Purpose |
|---|---|
| `GET /api/health` | Health check |
| `/api/admin` | Admin-only operations |
| `/api/users` | User management & address CRUD |
| `/api/products` | Product CRUD & queries |
| `/api/cart` | Cart operations |
| `/api/orders` | Order management |
| `/api/reviews` | Product reviews |
| `/api/inngest` | Inngest background job handler |

**Data Models:** `User` (with embedded `Address` sub-documents), `Product`, `Cart`, `Order`, `Review`

> The `User` model embeds an `addresses` array, where each address stores `fullName`, `phoneNumber`, `streetAddress`, `city`, `state`, `zipCode`, `label`, and an `isDefault` flag.

**Production:** In production mode the backend serves the compiled admin panel from `admin/dist/`.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** v20+
- **MongoDB** connection string
- **Clerk** account (publishable key + secret key)
- **Cloudinary** account (cloud name, API key, API secret)
- **Inngest** account (for background jobs)

---

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/AshleshBathina/ecommerce-app.git
cd ecommerce-app
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
NODE_ENV=development
PORT=3000
```

```bash
npm run dev
```
> Backend runs on **http://localhost:3000**

---

#### 3. Admin Panel Setup
```bash
cd admin
npm install
```

Create `admin/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:3000
```

```bash
npm run dev
```
> Admin panel runs on **http://localhost:5173**

---

#### 4. Frontend (Storefront) Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```
> Storefront runs on **http://localhost:5174**

---

### Seeding the Database

To populate the database with sample products:
```bash
cd backend
npm run seed:products
```

---

## 🚢 Deployment

### Backend (Render)

The root `package.json` provides convenience scripts for Render:

```bash
# Install dependencies and build the admin panel
npm run build

# Start the production server (serves both API and admin panel)
npm start
```

In production, the Express server statically serves `admin/dist/` and handles all non-API routes with the admin `index.html`.

**Live URL:** https://ashoppp.onrender.com

### Frontend & Admin (Vercel)

Both `frontend/` and `admin/` are deployed as separate Vercel projects.

Each app includes a `vercel.json` with a catch-all rewrite to prevent 404 errors on page reload (required for React Router client-side routing):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> **Note:** Set `VITE_API_URL` to your production backend URL (e.g., `https://ashoppp.onrender.com`) in the frontend environment variables on Vercel.

---

## 📄 License

ISC
