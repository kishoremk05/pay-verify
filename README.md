# Todella — Premium Payment Verification & Auto-Reconciling System

<div align="center">
  <h3>Auto-reconcile Paystack, bank statement CSVs, and manual ledgers with hairline precision. Eliminate leaks instantly.</h3>
</div>

---

## 💎 Project Overview

**Todella** is a premium, high-integrity financial reconciliation application designed for modern high-volume finance teams. Powered by TanStack Start, Nitro, and Tailwind CSS, it offers a real-time responsive platform that helps businesses parse, match, and audit transactional ledgers instantly.

---

## ⚡ Core Features

- **Active Recon Engine**: Matches incoming statement data sets (such as ZenithBank CSV files or manual ledger spreadsheets) against transactional expected states in under 12ms.
- **Multi-Tenant RLS Security**: Rigorous Row-Level Security limits all operational data boundaries safely at the database level.
- **Interactive Telemetry Ticker**: Features a real-time cryptographic audit log simulator ticking live operations directly on your compliance screen.
- **Modern Glassmorphic UI**: High-end editorial design with custom dot meshes, dynamic ambient glow drops, and fluid CSS animations.

---

## 🛠️ Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React SSR / SSG framework)
- **Engine**: [Nitro](https://nitro.unjs.io/) (High-performance web server backend)
- **Deployment Platform**: [Vercel](https://vercel.com) (Pre-configured Serverless Environment)
- **Database / Auth**: [Supabase](https://supabase.com) (RLS-backed postgres instance)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have Node.js (v18+) and your preferred package manager (npm or bun) installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repository-url>
cd payment-pulse-main
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (based on `.env.example` if available):
```env
VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-jwt-token"
```

### 4. Running the Development Server
Launch the local Vite server:
```bash
npm run dev
```
Open **[http://localhost:8080/](http://localhost:8080/)** in your browser.

---

## 📦 Production Bundling

To bundle both static client resources and Vercel serverless function entry points, execute:
```bash
npm run build
```
This leverages the pre-configured Vercel preset adapter under the hood to output a compliant production bundle.

---

## 🌐 Vercel Zero-Config Deployment

The codebase includes standard presets that Vercel auto-detects out-of-the-box.
1. Connect your repository to **Vercel**.
2. Input your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment parameters in your Vercel Project Dashboard.
3. Deploy! Vercel handles serverless routing automatically.
