# 📝 BlogWorld - Modern Blogging Platform

<!-- Please upload your 4 new beautiful screenshots directly to GitHub and replace these image links below! -->
<img width="1920" height="1080" alt="Screenshot (738)" src="https://github.com/user-attachments/assets/0769fc09-a60a-43da-980b-30f67e05e6ec" />
<img width="1920" height="1080" alt="Screenshot (730)" src="https://github.com/user-attachments/assets/07454d24-d86f-4a1b-8486-b1815c862177" />
c<img width="1920" height="1080" alt="Screenshot (731)" src="https://github.com/user-attachments/assets/25f4f300-05b8-44fb-a743-647f44e92661" />
<img width="1920" height="1080" alt="Screenshot (732)" src="https://github.com/user-attachments/assets/c63c9cb3-a08c-4276-9c7b-a23ee40bd758" />
<img width="1920" height="1080" alt="Screenshot (734)" src="https://github.com/user-attachments/assets/4655ce26-b3c9-4cfe-a89d-df4824974505" />
<img width="1920" height="1080" alt="Screenshot (735)" src="https://github.com/user-attachments/assets/19daba3d-e1d0-4848-8108-bab5563e470e" />


**BlogWorld** is a premium, full-stack blogging platform that allows users to **create, share, and discover engaging content**. Built with cutting-edge technologies, it provides a seamless writing and reading experience with real-time updates, secure authentication, social networking features, and lightning-fast performance.

---

## 🌍 Demo

🚀 **[Live Demo](https://blog-world-olive.vercel.app/)**

---

## 📑 Table of Contents

* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Installation](#-installation)
* [Usage](#-usage)
* [Challenges & Solutions](#-challenges--solutions)
* [Future Improvements](#-future-improvements)
* [License & Credits](#-license--credits)
* [Contact](#-contact)

---

## ✨ Features

* 📝 **Rich Text Editor** – Tiptap-powered editor with advanced formatting tools
* 🔐 **User Authentication** – Secure signup/login with Appwrite
* 👤 **Custom User Profiles** – Personalized dashboards with dynamically synced avatars
* 🤝 **Social Network** – Follow other writers, build an audience, and see activity timelines
* 🔖 **Bookmarks** – Save your favorite articles for later reading
* 🔍 **Advanced Search** – Instantly search for articles and authors across the platform
* 📈 **Trending Algorithm** – Appwrite Cloud Functions automatically calculate trending posts based on views and engagement
* 📑 **Categorization** – Organize and browse posts by categories (Technology, Design, Business, etc.)
* 💬 **Commenting System** – Engage with authors and readers directly on posts
* 📱 **Premium Responsive UI** – Beautiful, modern design that works flawlessly on desktop, tablet, and mobile
* 🖼️ **Image Management** – Upload and manage featured images and profile photos via Appwrite Storage
* ⚡ **Fast Performance** – Optimized single-page application with React + Vite

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ **React 18+** – Component-driven UI
* ⚡ **Vite** – Lightning-fast bundler
* 🎨 **Tailwind CSS** – Utility-first styling for a premium aesthetic
* 🧭 **React Router** – Client-side navigation
* 🏷️ **Tiptap** – Rich text editor
* 🎯 **Redux Toolkit** – Global state management
* 📋 **React Hook Form** – Form validation

### Backend & Services (Appwrite)

* 🔧 **Appwrite** – Complete Backend-as-a-Service
* 🗄️ **Appwrite Database** – NoSQL database managing Posts, Users, Follows, Bookmarks, and Comments
* 💾 **Appwrite Storage** – Secure file & image handling for featured images and avatars
* 🔐 **Appwrite Auth** – Secure user authentication and session management
* 🌩️ **Appwrite Cloud Functions** – Serverless Node.js functions running scheduled cron jobs for trending algorithms

### Deployment

* ▲ **Vercel** – Frontend hosting & deployment
* ☁️ **Appwrite Cloud** – Backend services

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/purvil3105/BlogWorld.git
cd BlogWorld
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

```env
VITE_APPWRITE_URL=https://your-appwrite-endpoint/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COLLECTION_ID=your-collection-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id
```

Start development server:

```bash
npm run dev
```

---

## 🚀 Usage

* 🔑 **Sign Up / Login** – Create your account and set up your profile picture
* 📝 **Create Posts** – Use the rich editor to write blogs and select categories
* 📂 **Manage Content** – Edit/delete posts from your dashboard
* 🌐 **Explore** – Discover new creators and trending articles
* 🤝 **Connect** – Follow authors and interact via comments
* 🔖 **Save** – Bookmark articles to read later

---

## 🧩 Challenges & Solutions

**Challenge 1: Avatar Synchronization Across the Platform**
*Problem*: When a user updated their profile picture, old posts and comments still showed the old image because the image ID was hardcoded into the document.
*Solution*: Architected a dynamic `UserAvatar` component with a built-in memory cache that fetches the latest profile picture natively, ensuring avatars are always 100% synchronized everywhere without slowing down the app.

**Challenge 2: Single Page App (SPA) Routing on Vercel**
*Problem*: Hard refreshing on routes like `/profile` caused 404 errors.
*Solution*: Added a `vercel.json` configuration file to rewrite all routes back to `index.html`, allowing React Router to handle the navigation properly.

**Challenge 3: Complex State Management**
*Problem*: Hard to manage auth, posts, and bookmarks globally.
*Solution*: Implemented **Redux Toolkit** for predictable and efficient state management.

---

## 🚀 Future Improvements

* 📧 Email notifications for new followers and posts
* 🌍 Multi-language support
* 📱 Progressive Web App (offline support)
* 🛠️ Admin dashboard for moderation
* 🔗 Public API for external integrations

---

## 📜 License & Credits

**License**: MIT License
**Credits**:

* [Appwrite](https://appwrite.io)
* [Tiptap](https://tiptap.dev)
* [TailwindCSS](https://tailwindcss.com)
* [React](https://react.dev)

Special thanks to the open-source community ❤️

---

## 📬 Contact

👨‍💻 **Author**: Purvil Patel
📧 **Email**: [patelpurvil3105@gmail.com](mailto:patelpurvil3105@gmail.com)
🐙 **GitHub**: [purvil3105](https://github.com/purvil3105)

⭐ If you found this project helpful, please give it a star on GitHub!
