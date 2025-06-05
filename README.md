# 🛒 eCommerce Flow – Fullstack Web App

An end-to-end eCommerce demo application built with **Next.js (App Router)** on the frontend and **Express.js** on the backend. This project demonstrates a full purchase flow from product listing ➝ checkout ➝ order confirmation, including dynamic routing, API integration, and live deployment.

## 🚀 Features

- Product catalogue page with real-time data fetching
- Dynamic checkout page using URL query parameters (`pid`, `qty`)
- Secure form with user/customer details and mock payment section
- Order confirmation (Thank You) page with:
  - Fetched order details (email, items, total)
  - Summary of purchase
- Frontend built with **Next.js 15 (App Router)** and **Tailwind CSS**
- Backend built with **Express.js**
- Fully deployable on **Vercel** (frontend) and **Render** or **Railway** (backend)

---

## 📁 Project Structure

ecommerce-flow/
├── backend/ # Express.js backend API
│ ├── server.js
│ └── routes/
│ ├── products.js
│ ├── checkout.js
│ └── orders.js
│
├── frontend/ # Next.js frontend
│ ├── app/
│ │ ├── page.tsx # Home Page (Product list)
│ │ ├── checkout/
│ │ │ └── page.tsx # Checkout form
│ │ └── thankyou/
│ │ └── page.tsx # Order confirmation
│ ├── components/ # Reusable UI components
│ └── styles/ # Tailwind and global styles
│
├── README.md




---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js ≥ 18.x
- npm or yarn
- Vercel CLI (optional for deployment)
- Render / Railway account (for backend)

---

### 🔧 Backend Setup (Express.js)

```bash
cd backend
npm install
node server.js


Server runs at: http://localhost:4000

APIs available:

GET /api/products – Fetch all products

POST /api/checkout – Submit an order

GET /api/orders/:orderNumber – Retrieve order by ID

💻 Frontend Setup (Next.js 15)
cd frontend
npm install
npm run dev


Frontend runs at: http://localhost:3000

Make sure your backend is running locally at port 4000.

🧪 Sample Flow
Go to http://localhost:3000

Select a product ➝ Click “Buy Now”

Fill in checkout details

Submit ➝ Redirected to /thankyou?order=XXXX

View confirmation and order summary






👨‍💻 Author
Akshay P.
Fullstack Developer | AI + Web Dev Enthusiast

GitHub: @Akp132
Deployed Demo: Vercel Frontend
