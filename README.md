# Nice Vision - Premium Photography Studio

A full-scale, production-ready photography studio web application for professional photographer **Kim Gérard** from Burundi.

## ✨ Features

- **Ultra-Premium Design**: Cinematic aesthetic with black, gold, and white palette.
- **Next.js 15 App Router**: High-performance, modern architecture.
- **Booking System**: Interactive calendar, package selection, and conflict prevention.
- **Admin Dashboard**: Full control over bookings, portfolio, blog, and clients.
- **Portfolio Gallery**: Filterable masonry grid with smooth Framer Motion transitions.
- **Client Galleries**: Password-protected private galleries for clients.
- **Payment Integration**: Stripe for deposit payments and invoices.
- **SEO Optimized**: Fully optimized for search engines and performance.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS + Framer Motion
- **Database**: Supabase + Prisma ORM
- **Auth**: Supabase Auth
- **Storage**: Cloudinary (Image Optimization)
- **Payments**: Stripe
- **Forms**: React Hook Form + Zod
- **Email**: Resend

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd NiceVision
npm install
```

### 2. Environment Variables

Create a `.env` file in the root and add your credentials:

```env
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Resend
RESEND_API_KEY="re_..."
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Locally

```bash
npm run dev
```

## 📦 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel.
2. Add all environment variables.
3. Deploy.

### Backend (Supabase)
1. Create a new project on Supabase.
2. Link the database to your Prisma setup via `DATABASE_URL`.
3. Enable Auth and Storage buckets as needed.

---

**Nice Vision** | *Capturing timeless stories through the lens.*
Owner: Kim Gérard | Burundi
