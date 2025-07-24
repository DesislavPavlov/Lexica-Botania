# 🌸 Lexica Botania

_A multilingual flower catalog with guest suggestions and admin moderation._

---

## 🚀 Live Demo

- **Frontend (React + Vercel):** [Visit Here](<frontend-link>)
- **Backend API (Node.js + Render):** [Visit Here](<backend-link>)

---

## 📖 Overview

**Lexica-Botania** is a web application showcasing a **flower catalog** with multilingual support (**Latin, English, Bulgarian**) and an integrated **suggestion system**.  

- Guests can **browse flowers** and **suggest new entries**.  
- Admins can **approve suggestions**, **add new flowers**, and **manage content**.  
- All images are stored efficiently as **WebP** files via **Supabase Storage**.  
- All pages are fully **responsive**, designed for both desktop and mobile.

---

## ✨ Features

- 🌼 **Flower Catalog**: Latin, English, and Bulgarian names displayed side-by-side.  
- 💡 **Guest Suggestions**: Submit new flowers with multilingual details.  
- 🛡 **Admin Panel**: Login/logout, approve/delete suggestions, and add flowers directly.  
- 🗄 **Supabase Storage**: WebP image upload & retrieval with secure RLS policies.  
- 📱 **Responsive Design**: Responsive layout with adaptive gallery grid and cards.  
- 🔒 **Authentication**: Supabase Auth for admin actions.  

---

## 🛠 Tech Stack

**Frontend:**
- React + TypeScript
- React Router
- Vercel (Hosting)
- CSS (custom responsive grid + animations)

**Backend:**
- Vanilla Node.js HTTP server
- Busboy for multipart form-data
- Supabase (PostgreSQL + Storage + Auth)
- Render (Hosting)

**Planned Upgrade:**
- Migration to **Express** (Backend) and **Next.js** (Frontend) for improved DX.

---

## 🎥 Showcase

(Add screenshots or a short GIF/video demo here)  
- Example: Home Page  
- Example: Gallery View  
- Example: Suggestion Flow  
- Example: Admin Approval Flow

---

## 🧩 How It Works

- **Guests:**  
  - Browse flowers and submit suggestions.  
  - Suggestions are reviewed by admin before being added to catalog.  

- **Admins:**  
  - Sign in via Supabase Auth.  
  - Approve or delete suggestions.  
  - Add or remove flowers directly (images auto-converted to WebP).  

- **Storage & Auth:**  
  - Supabase Storage buckets secured with RLS: public read, admin-only writes/deletes.  
  - Database policies for fine-grained control (admin vs guest actions).  

---

## 🗺 Future Plans

- Move to **Express + Next.js** for SSR and API routes.
- Add **search and filters** for the flower catalog.
- Enable **image optimization** and lazy loading.  

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute with attribution.

---

## 📬 Contact

- **Author:** Desislav Pavlov  
- **GitHub:** [DesislavPavlov](https://github.com/DesislavPavlov)  
- **Email:** makotashako@gmail.com

---

