# AI Image Editor Web App

> **Web Application:** [https://vision-forge-eight.vercel.app](https://vision-forge-eight.vercel.app)

> A React + Tailwind CSS frontend with a Node.js/Express backend to generate and edit images via the OpenAI Images API, packaged in Docker for easy plug-and-go deployment.

---

## 🚀 Overview

This project, **Vision Forge**, enables seamless AI-powered image editing with a single natural language prompt. Users can:

* Upload any photo (PNG, JPG, WebP)
* Brush-select an area to focus edits
* Enter a detailed instruction
* Choose an aspect ratio (1:1, 3:2, 2:3)
* Generate and download the edited image

Built with extensibility in mind, it supports swapping out models and adding new features without major rewrites.

---

## 🧰 Tech Stack

* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Node.js, Express, Multer, OpenAI SDK
* **Containerization:** Docker & Docker Compose
* **CI/CD:** GitHub Actions (automated build & deploy on push to `main`)
* **Hosting:** Vercel (frontend), Render (backend)

> **Note:** No database is required—images are processed in-memory and not persisted.

---

## 📋 Prerequisites

* Docker Engine (v20.10+)
* Docker Compose (v1.29+)
* OpenAI API Key
* Deployed backend URL (for frontend configuration)

---

## ⚙️ Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/CZLam7/VisionForge.git
cd VisionForge
```

### 2. Environment configuration

* **Backend** (`backend/.env`):

  * `OPENAI_API_KEY=<your-openai-api-key>`
  * Any other model-specific keys

* **Frontend** (`frontend/.env`):

  * `VITE_API_URL=<backend-deployed-or-local-url>`

### 3. Build & start with Docker Compose

```bash
docker-compose up --build
```

This brings up both frontend and backend in containers—regardless of your host machine, you get a consistent environment.

### 4. Access the app

* Frontend: `http://localhost:3000`
* Backend (API): `http://localhost:3001/api/edit`

---

## ✅ Evaluation of Work

* **Software engineering practices:**

  * Feature branches, issue tracking, PR-based merges
  * Meaningful commit messages and code comments
  * Automated CI/CD: builds and deployments on `main` push

* **Architecture & extensibility:**

  * Dockerized, plug-and-go setup
  * Swap in improved models by updating API calls only
  * No coupling between frontend and specific model implementation

* **UX considerations:**

  * Responsive design across screen sizes
  * Brush tool for precise area selection
  * Live preview of mask and dynamic ratio adjustments

---

## 🎯 Future Targets

* Enhanced mobile and tablet (iPad) layouts
* Auto-detection of objects for one-click masking
* Undo/redo and history tracking for composite edits
* Plugin architecture for adding new filters and effects

---