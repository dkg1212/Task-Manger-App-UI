---

## 🗄️ Backend Repository

Looking for the **backend**? It’s available here 👇

[![Backend Repo](https://img.shields.io/badge/GitHub-Backend%20Repo-181717?logo=github&style=for-the-badge)](https://github.com/dkg1212/task-manager-app)

📌 **Setup & API Docs:**  
Head over to the backend repository and follow its README for complete **installation, environment setup, and API usage details**.

---
# 📝 Task Manager App (Frontend)

A modern, responsive, and feature-rich task management web app built with **Next.js 14**, **React**, and **Tailwind CSS v4.1+**.  
This is the **frontend** for the Task Manager project.


## 🚀 Features

- **Next.js 14 App Router** for fast, scalable routing
- **Tailwind CSS v4.1+** for utility-first, dark mode-ready styling
- **Manual and system dark mode** toggle (no config needed)
- **Authentication** (login/signup) with JWT (via backend API)

<div align="center">
  <h1>📝 Task Manager App <sup>(Frontend)</sup></h1>
  <p>A modern, responsive, and feature-rich task management web app built with <b>Next.js 14</b>, <b>React</b>, and <b>Tailwind CSS v4.1+</b>.</p>
  <p>This is the <b>frontend</b> for the Task Manager project.</p>
  <img src="https://img.shields.io/badge/Next.js-14-blue?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4.1-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</div>

---

## 🚀 Features

- ⚡ **Next.js 14 App Router** for fast, scalable routing
- 🎨 **Tailwind CSS v4.1+** for utility-first, dark mode-ready styling
- 🌗 **Manual & system dark mode** toggle (no config needed)
- 🔐 **Authentication** (login/signup) with JWT (via backend API)
- ✅ **Task CRUD**: Add, edit, delete, and mark tasks as complete
- ⭐ **Task priority**: Set and edit priority (1-5), sort by priority
- 🟦 **Drag & drop** task reordering (with @hello-pangea/dnd)
- 📱 **Responsive**: Mobile-first, works great on all devices
- 🪄 **Animated modals** for adding tasks, with background blur
- 🧠 **Context-based Auth and Dark Mode**
- ✨ **Beautiful UI** with glassmorphism, gradients, and smooth transitions

---

## 📁 Project Structure

```text
frontend/
├── app/
│   ├── layout.tsx         # Root layout, providers, global styles
│   ├── globals.css        # Tailwind base styles
│   ├── page.tsx           # Home page
│   ├── login/page.tsx     # Login page
│   ├── signup/page.tsx    # Signup page
│   └── tasks/page.tsx     # Main task dashboard
├── components/
│   ├── Navbar.tsx         # Top navigation bar
│   ├── TaskForm.tsx       # Add/edit task form (modal)
│   ├── TaskItem.tsx       # Single task display & edit
│   └── WaitForDarkMode.tsx# Client-side dark mode gate
├── context/
│   ├── AuthContext.tsx    # Auth state/context
│   └── DarkModeContext.tsx# Dark mode state/context
├── lib/
│   └── api.ts             # Axios instance for API calls
├── types/
│   └── index.d.ts         # TypeScript types (Task, User, etc.)
└── public/                # Static assets (icons, images)
```

---

## 🛠️ Tech Stack
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="24"/> **Next.js 14** (App Router, TypeScript)
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24"/> **React 18**
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="24"/> **Tailwind CSS v4.1+**
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="24"/> **TypeScript**
- 🎬 **Framer Motion** (animations)
- 🟦 **@hello-pangea/dnd** (drag & drop)
- <img src="https://lucide.dev/logo.svg" width="20" style="vertical-align:middle;"/> **Lucide React** (icons)

---

## 🌗 Dark Mode
- Uses Tailwind v4.1+ color-scheme-based dark mode (no config needed)
- 🌙 Toggle in Navbar, persists via localStorage
- All pages/components styled for both modes

---

## 📝 Getting Started

1. 📦 **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. ▶️ **Start the dev server:**
   ```bash
   npm run dev
   ```
3. 🔗 **Connect to backend:**
   - The frontend expects a backend API (see `/lib/api.ts` for base URL)
   - Make sure your backend is running and CORS is enabled

---

## ✨ Key Files & Concepts

- [`app/tasks/page.tsx`](app/tasks/page.tsx) — 🗂️ Main dashboard, task list, add/edit modal, drag & drop, priority sorting
- [`components/TaskForm.tsx`](components/TaskForm.tsx) — ➕ Add/edit task form, modal, priority select
- [`components/TaskItem.tsx`](components/TaskItem.tsx) — 📝 Task display, edit, delete, priority badge
- [`context/AuthContext.tsx`](context/AuthContext.tsx) — 🔐 Auth state, login/logout, user info
- [`context/DarkModeContext.tsx`](context/DarkModeContext.tsx) — 🌗 Dark mode state, toggle, persistence
- [`components/Navbar.tsx`](components/Navbar.tsx) — 🧭 Navigation, dark mode toggle, user menu

---

## 📦 Environment Variables
- No `.env` needed for frontend unless you want to override API base URL in `/lib/api.ts`.

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue or discussion for major changes.

---

## 📄 License

MIT

---

## 👨‍💻 Author

- [Dimpal Gogoi](https://github.com/dkg1212)

---

## 📷 Screenshots

| ☀️ Light Mode | 🌙 Dark Mode |
|:------------:|:-----------:|
| ![Light Screenshot](public/demo(light).png) | ![Dark Screenshot](public/demo(dark).png) |

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) — learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) — interactive Next.js tutorial.
- [Next.js GitHub](https://github.com/vercel/next.js) — feedback and contributions welcome!

## ▲ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
