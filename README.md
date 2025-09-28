# 🌐 Zerodha Clone - Admin Dashboard

Welcome to **Zerodha Clone Admin Dashboard**! This is a modern, responsive admin dashboard for managing trading platform data, built with React.js and Node.js.

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Technologies](#-technologies)
3. [Project Structure](#-project-structure)
4. [Getting Started](#-getting-started)
5. [Features](#-features)
6. [API Endpoints](#-api-endpoints)
7. [License](#-license)

---

## 🌟 Overview

A modern admin dashboard for managing trading platform data including equity, commodity, holdings, positions, funds, orders, accounts, and portfolio information. Features a responsive design with sidebar navigation and real-time data editing capabilities.

---

## 📁 Project Structure

```
zerodha-clone/
├── backend/          # Node.js + Express API server
│   ├── index.js      # Main server file
│   ├── controller/   # API controllers
│   ├── model/        # Database models
│   ├── routes/       # API routes
│   └── schemas/      # Mongoose schemas
├── dashboard/        # React.js admin dashboard
│   └── src/
│       └── components/  # React components
└── package.json      # Root dependencies
```

---

## 💻 Technologies

| Frontend         | Backend         | Database   |
| ---------------- | --------------- | ---------- |
| **React.js**     | **Node.js**     | **MongoDB** |
| **Material UI**  | **Express.js**  | **Mongoose** |
| **Chart.js**     | **JWT**         |            |
| **Axios**        | **Bcrypt**      |            |
| `Charts.js`        | Data visualization            |
| `Axios`            | HTTP client                   |
| `React Router Dom` | Client-side routing           |
| `Passport`         | Authentication                |
| `cors`             | Cross-origin resource sharing |
| `Body-Parser`      | Body parsing middleware       |

---

## 🚀 Getting Started

Follow these steps to set up the project in your local environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/Jenil-Desai/zerodha-clone.git
   ```
2. Install dependencies for Backend, Frontend, and Dashboard.

   ```bash
   cd backend
   npm install
   ```

   ```bash
   cd ../dashboard
   npm install
   ```

   ```bash
   cd ../frontend
   npm install
   ```

3. Configure environment variables for the backend. Create `.env` in the `backend` folder with following :
   ```env
   PORT=3000
   MONGO_URL="Your Mongo Database Url"
   secret="Your Unique JWT Secret"
   ```
4. Run the web application:
   ```bash
   npm start
   ```

---

## ⚙️ Setup

1. Go to `localhost:3000`.
2. Register a new user.
3. Explore the dashboard.

---

## 🎯 Features

Explore the unique features available in this application:

- **User Authentication**
- **User Authorization**
- **Orders Page**
- **Dashboard**
- **Frontend Clone**

---

## 🔗 Demo & Screenshots

- [Demo](https://zerodha-clone-frontend.vercel.app)
- UserName : Demo
- Password : Demo

| Mock Up                            | Home Page                             | Dashboard                              | About Page                         |
| ---------------------------------- | ------------------------------------- | -------------------------------------- | ---------------------------------- |
| ![Mockup](./Screenshot/mockup.png) | ![Mockup](./Screenshot/Homepage.jpeg) | ![Mockup](./Screenshot/Dashboard.jpeg) | ![Mockup](./Screenshot/About.jpeg) |

| Products Page                        | Pricing Page                         | Support Page                         |
| ------------------------------------ | ------------------------------------ | ------------------------------------ |
| ![Mockup](./Screenshot/Product.jpeg) | ![Mockup](./Screenshot/Pricing.jpeg) | ![Mockup](./Screenshot/Support.jpeg) |

---

## 🙏 Acknowledgments

We’d like to thank the following contributors and resources:

- **[Apna College's Delta 3.0 Course](https://www.apnacollege.in/)** - Course resource.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.

---

### Enjoy exploring and contributing to Zerodha Clone!
