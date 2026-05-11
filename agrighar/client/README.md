# AGRIghar Frontend

Direct Farmer-to-Consumer Digital Marketplace Platform  
**BGI Hackathon 2026 | Team Green Coders | Team ID: 2389**

---

## Quick Start

### 1. Install Node.js
Download from https://nodejs.org (LTS version)

### 2. Install dependencies
```bash
cd agrighar/client
npm install
```

### 3. Start the app
```bash
npm start
```
Opens at http://localhost:3000

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/browse` | Browse Products | Public |
| `/product/:id` | Product Detail | Public |
| `/farmers` | All Farmers | Public |
| `/farmer/:id` | Farmer Profile | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/cart` | Cart | Consumer |
| `/checkout` | Checkout | Consumer |
| `/orders` | My Orders | Logged In |
| `/profile` | Profile | Logged In |
| `/farmer/dashboard` | Farmer Dashboard | Farmer |
| `/farmer/add-product` | Add Product | Farmer |
| `/farmer/edit-product/:id` | Edit Product | Farmer |

---

## Features Built

- ✅ Home page with hero, stats, features, products, farmers, testimonials
- ✅ Browse with search, filter, sort, category tabs
- ✅ Product detail with reviews & star rating
- ✅ Cart with quantity controls & order summary
- ✅ 3-step checkout (Address → Payment → Confirm)
- ✅ Order tracking with status stepper
- ✅ Farmer dashboard (overview, listings, orders)
- ✅ Add/Edit product form
- ✅ Farmer profile page
- ✅ Nearby farmers with geolocation
- ✅ Multilingual support (English, Hindi, Marathi)
- ✅ JWT auth with role-based routing
- ✅ Responsive design (mobile-first)
- ✅ Toast notifications

---

## Environment Variables

Create `.env` in the client folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Demo Mode

The app works without a backend using mock data.  
Use demo login buttons on the Login page to test both roles.
