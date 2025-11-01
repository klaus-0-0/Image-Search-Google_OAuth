🖼️ Image Search & Management Platform
🚀 Project Overview
A full-stack image search application where users can search, save, and manage images from Unsplash, with admin capabilities for content management.

✨ Features
👥 User Features
🔍 Advanced Search - Search Unsplash images with filters
💾 Save Collections - Create personal image collections
📱 Responsive Gallery - 4-column responsive image grid
🌙 Dark/Light Theme - Toggle between themes
📜 Search History - Personal search history tracking
⭐ Favorites - Save favorite images

🛡️ Security Features
JWT Authentication - Secure token-based authentication
OAuth Integration - Google OAuth login
Role-Based Access - Admin and user permissions
CORS Protection - Configured for specific origins

🛠️ Tech Stack
Frontend
React - UI framework
Tailwind CSS - Styling
Axios - HTTP client
React Router - Navigation

Backend
Node.js - Runtime environment
Express.js - Web framework
PostgreSQL - Database
Prisma - ORM
JWT - Authentication
Passport.js - OAuth integration

External APIs
Unsplash API - Image search and display
Google OAuth - Authentication

🚀 Installation & Setup
Prerequisites
Node.js 16+
PostgreSQL
Unsplash API account
Google OAuth credentials

# Backend
cd backend
npm install

# Environment variables
# Edit .env with your database, JWT secret, Unsplash API key, and Google OAuth credentials

# Database setup
npx prisma generate
npx prisma migrate dev --name init

# Start server
npm start

# Frontend
cd frontend
npm install

# Start development server
npm run dev 

🎯 Key Components
Home Page
Search bar with auto-suggest
Top searches banner
Image grid with multi-select
Theme toggle
User authentication

📱 UI/UX Features
Responsive Design - Mobile-first approach
Dark/Light Theme - System preference detection
Loading States - Skeleton screens and spinners
Image Optimization - Lazy loading and placeholders
Smooth Animations - CSS transitions and transforms

🔄 Future Enhancements
Planned Features
Advanced Filters - Color, orientation, size filters
Social Features - Share collections, follow users
Download Management - Track downloaded images
AI-Powered Search - Semantic search capabilities
