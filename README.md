# SAM Car Rental App

A full-stack Car Rental application with role-based access built with React (Vite) on the frontend, Node.js/Express on the backend, MongoDB for storage, and Cloudinary for image handling. Users can browse, rent, review cars; managers maintain the fleet; bosses oversee operations; and admins govern the system.

---

## 📺 Live Demo

- **Frontend**: https://car-rental-app-update-31.vercel.app/
- **Backend API**: https://car-rental-api-ma2y.onrender.com/api  

📽️ [Video Walkthrough](https://youtu.be/my-demo-video)  

---

## 🚀 Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
  - [Running Locally](#running-locally)  
- [API Reference](#api-reference)  
- [Deployment](#deployment)  
  - [Backend on Render](#backend-on-render)  
  - [Frontend on Vercel](#frontend-on-vercel)  
- [Planning & Architecture](#planning--architecture)  
- [Self Evaluation](#self-evaluation)  
- [License](#license)  

---

## 🎯 Features

| Role     | Key Actions                                                                 |
|----------|-------------------------------------------------------------------------------|
| **User**    | Register/Unregister, update profile, browse & filter cars, rent/return, submit reviews, view history |
| **Manager** | CRUD cars, filter by status, approve rentals, process returns, lock/unlock users, view fleet statistics |
| **Boss**    | All manager features + manage managers, view revenue & usage reports         |
| **Admin**   | Full system access: manage bosses, reset system                              |

Extra (Grade-4/5)  
- JWT authentication  
- Responsive UI (Material-UI)  
- Image uploads (Cloudinary)  
- Sliders & charts (React Slick, Recharts)  
- Unit & integration tests  

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, React Router, Material-UI, React Slick, Axios  
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer/Cloudinary  
- **Deployment:** Vercel (frontend), Render (backend)  

---

## 📁 Project Structure

```plain
car-rental-app/
├── client/                     # React/Vite front-end
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, logos, etc.
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # AuthContext for JWT
│   │   ├── pages/              # Page components by role
│   │   ├── routes/             # AppRoutes & ProtectedRoute
│   │   ├── services/           # Axios API wrappers
│   │   ├── utils/              # token management
│   │   ├── styles/             # Global styles
│   │   ├── App.jsx             # Main App
│   │   └── main.jsx            # Entry point
│   ├── .env                    # VITE_API_URL, Cloudinary keys
│   └── package.json
│
└── server/                     # Express backend
    ├── config/                 # DB connection, Cloudinary setup
    ├── controllers/            # Route handlers
    ├── middleware/             # Auth, error handling
    ├── models/                 # Mongoose schemas
    ├── routes/                 # Express routes
    ├── utils/                  # Logger, helpers
    ├── server.js               # Server entry
    └── package.json
```

## 🔧 Getting Started

### Prerequisites

- Node.js v16+  
- npm or yarn  
- MongoDB Atlas account or local MongoDB  
- Cloudinary account  

### Installation

```bash
git clone https://github.com/myusername/car-rental-app.git
cd car-rental-app
```

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```  

### Environment Variables

Create `.env` files in both `client/` and `server/`:

#### Client (`client/.env`)
```
VITE_API_URL=https://car-rental-api-ma2y.onrender.com/api
```

#### Server (`server/.env`)
```
MONGO_URI=mongodb+srv://SameeraCarRentalApp:8wsmdNazHoQTrAe6@cluster0.2nlsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=asdfghjk45632147855632gfdsasdfghjkl
PORT=5000
CLOUDINARY_CLOUD_NAME=dh9y7zm23
CLOUDINARY_API_KEY=382523683388318
CLOUDINARY_API_SECRET=VatShImVE7HMsTcjKuqMpDL7SjU
```

### Running Locally

**Backend**:

```bash
cd server
npm run dev
```

**Frontend**:

```bash
cd client
npm run dev
```

Open http://localhost:5173 in my browser.

## Image Uploads with Cloudinary

Cars images and gallery uploads are handled via Cloudinary. The server uses the `cloudinary` package to upload incoming `multipart/form-data` images:

```js
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

In my routes, you can then upload:

```js
📡 API Reference

Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Authenticate & receive JWT
GET	/api/cars	List all cars
GET	/api/cars/available	List available cars
POST	/api/cars	[Mgr/Admin] Add new car
PUT	/api/cars/:id	[Mgr/Admin] Update car
PATCH	/api/cars/:id/featured	[Mgr/Admin] Toggle featured flag
DELETE	/api/cars/:id	[Mgr/Admin] Delete car permanently
GET	/api/rentals/user/:userId	Get user's rentals
POST	/api/rentals	[User] Rent a car
PUT	/api/rentals/:id/return	[User] Return a car
PATCH	/api/rentals/:id/approve	[Mgr] Approve rental
GET	/api/reviews/recent	List recent reviews
POST	/api/reviews	[User] Submit review
```

## Deployment

### Deploying Backend to Render

1. Push server/ to GitHub.
2. Create a Render Web Service pointing to the server directory.
3. Set Build & Start commands (npm install && npm start).
4. Add server .env variables in Render’s dashboard.
5. Deploy → note my backend URL.


### Deploying Frontend to Vercel

1. Push client/ to GitHub.
2. Import project into Vercel, set root directory to client/.
3. Configure Build (npm run build) & Output (dist).
4. Add client .env vars in Vercel.
5. Deploy →  Vercel URL is live.

📝 Planning & Architecture

1. UI Mockups
2. Make a file structure according to the Assignment
3. Component Plan
4. Timeline & Tasks: 40 total hours logged

🤝 Self-Evaluation

1. What went well: Cloudinary integration, role-based routing, responsive design.
2. Challenges: CORS setup, handling multipart uploads & previews.
3. Greatest learning: Secure JWT flows and file handling.
4. Hours spent: ~45 hours.
5. Proposed grade: 4.5 / 5 – core features complete, extra tests pending.

🧪 Tests
1. Unit tests for React components in client/src/__tests__/
2. API integration tests in server/tests/


MIT © Sameera Wagaarachchige

