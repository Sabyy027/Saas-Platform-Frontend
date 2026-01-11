# ExtraHands.ai 🚀

![ExtraHands.ai](https://via.placeholder.com/1200x600.png?text=ExtraHands.ai+Dashboard)
*(Replace with actual screenshot)*

**Your Extra Hands for Content Creation, Editing, and Design.**

ExtraHands.ai is a comprehensive AI-powered SaaS platform that aggregates multiple productivity tools into a single, cohesive interface. Built with the **PERN Stack** (PostgreSQL, Express, React, Node.js), it features usage-based billing, user authentication, and a modern, responsible UI.

---

## ✨ Features

### 🎨 **Visual Studio (Image Tools)**
- **AI Image Generator:** Create stunning visuals from text prompts (Powered by Flux/Pollinations).
- **Background Remover:** Instantly remove backgrounds from images using local/server-side AI (`@imgly`).
- **Image Converter:** Switch between formats (Coming Soon).
- **Caption Generator:** Generate social media captions for images (Powered by Gemini).

### 📝 **Writer's Room (Text Tools)**
- **Article Generator:** Generate full-length, SEO-optimized blog posts.
- **AI Humanizer:** Rewrite AI-generated text to pass detection and sound natural.
- **Plagiarism Checker:** Verify content uniqueness.
- **SEO Optimizer:** Analyze and improve content for search rankings.
- **Grammar Checker:** Correct syntax and style errors.
- **Paraphraser:** Rewrite text in various tones (Professional, Casual, Creative).

### 📄 **Editor's Desk (Document Tools)**
- **Universal Converter:** Convert between DOCX, PDF, Markdown, HTML, CSV, and JSON.
- **PDF to Text:** Extract raw text from PDF documents.
- **Text to PDF:** Create professional PDFs from plain text.

### ⚙️ **Platform Features**
- **Secure Authentication:** User management via [Clerk](https://clerk.com).
- **Credit System:** Pay-as-you-go model. Users buy credits to use tools.
- **Payment Gateway:** Integration with Razorpay for secure transactions.
- **Modern Dashboard:** Glassmorphism UI, responsive sidebar, and animated interactions using Framer Motion.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v4, Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Auth:** Clerk React SDK

### **Backend**
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon Serverless) / `pg` driver
- **AI Models:** 
  - Google Gemini 1.5 Flash (Text/Vision)
  - Pollinations.ai (Image Gen)
  - @imgly/background-removal-node (BG Removal)
- **File Handling:** Multer, Sharp, PDFKit, PDF-Parse, Mammoth, Docx
- **Payments:** Razorpay usage integration

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed (v18 or higher)
- PostgreSQL Database Connection String (e.g., from Neon.tech)
- Clerk API Keys
- Google Gemini API Key
- Razorpay API Keys

## 🔐 Environment Variables Reference

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Clerk Backend Secret Key |
| `GEMINI_API_KEY` | Google AI Studio Key for text generation |
| `RAZORPAY_KEY_ID` | Razorpay public key for payments |
| `VITE_API_URL` | URL of the backend API (Frontend only) |


