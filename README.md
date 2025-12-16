# 🔵 Man Up! Inc. - Fatherhood Initiative

A comprehensive signup and management system for the Man Up! Inc. Fatherhood Initiative program supporting fathers in our communities.

## 🎯 About

The Fatherhood Initiative strengthens family units through community engagement and support programs. This system provides secure signup processing, participant management, and program coordination tools.

## ✨ Features

- Public signup form with mobile-responsive design
- Supabase PostgreSQL database with Row Level Security
- RESTful API with Express.js
- Input validation and rate limiting (5 signups/hour per IP)
- Admin dashboard for participant management
- Thank you confirmation flow

## 🚀 Quick Start
```bash
git clone https://github.com/as12711/MUI-Fatherhood.git
cd MUI-Fatherhood/backend
npm install
cp .env.example .env  # Add your Supabase credentials
npm run dev
```

Visit `http://localhost:3001/health` to verify server is running.

## 🛠 Tech Stack

Node.js • Express.js • Supabase • React • Material-UI

## 📡 API Endpoints

- `POST /api/fatherhood/signup` - Create new signup
- `GET /api/fatherhood/signups` - List all signups (admin)
- `GET /api/fatherhood/stats` - Get signup statistics (admin)

## 📞 Contact

**Man Up! Inc. Fatherhood Initiative**  
Email: astanford@manupinc.org / timothyburney1@gmail.com • Developer: [@as12711](https://github.com/as12711)

---
**Built with ❤️ for the fathers in our community by Man Up! Inc.**
