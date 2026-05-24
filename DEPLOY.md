# BDA CRM Dashboard — Deployment Guide

## Quick Deploy in 3 Steps

### Step 1: Get a Free MongoDB Atlas Database (2 minutes)

1. Go to **https://cloud.mongodb.com** → Sign up / Sign in
2. Click **"Build a Database"** → Choose **M0 FREE** tier
3. Select any region → Click **"Create Cluster"**
4. Create a database user:
   - Username: `bdacrm`
   - Password: `bdacrm2024` (or any password)
   - Click **"Create User"**
5. In Network Access → Click **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Go to **Database** → Click **"Connect"** → Choose **"Drivers"**
7. Copy the connection string. It looks like:
   ```
   mongodb+srv://bdacrm:bdacrm2024@cluster0.xxxxx.mongodb.net/bda-crm?retryWrites=true&w=majority
   ```
   Replace `<password>` with your actual password.

### Step 2: Push to GitHub (1 minute)

Open a terminal in the BDA folder and run:
```bash
# Login to GitHub (opens browser)
gh auth login --web --git-protocol https

# Create repo and push
gh repo create BDA-CRM-Dashboard --public --source=. --push
```

Or manually:
1. Go to **https://github.com/new** → Create repo named **BDA-CRM-Dashboard**
2. Run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/BDA-CRM-Dashboard.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render (2 minutes)

1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your **BDA-CRM-Dashboard** repository
4. Configure:
   - **Name**: `bda-crm-dashboard`
   - **Runtime**: `Node`
   - **Build Command**: `npm run render:build`
   - **Start Command**: `npm run render:start`
5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://bdacrm:...` (your Atlas URI) |
   | `JWT_SECRET` | `your-super-secret-key-here` |
   | `JWT_EXPIRE` | `7d` |
6. Click **"Create Web Service"**

Your app will be live at: `https://bda-crm-dashboard.onrender.com`

---

## Login Credentials (auto-seeded on first deploy)
- **Admin**: admin@bdacrm.com / password123
- **BDA**: rahul@bdacrm.com / password123
