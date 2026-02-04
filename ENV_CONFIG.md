# Environment Configuration Guide

## Overview
This project supports multiple environments: Development, UAT, and Production.

## Environment Files

- `.env.development` - Local development (default)
- `.env.uat` - UAT/Staging environment
- `.env.production` - Production environment
- `.env.example` - Template for local overrides

## Environment Variables

Each environment file contains:
- `VITE_API_URL` - Backend API URL
- `VITE_ENV` - Environment name

## Usage

### Development (Local)
```bash
npm run dev
```
Uses `.env.development` by default (http://localhost:3000)

### Build for UAT
```bash
npm run build:uat
```
Creates production build using `.env.uat` configuration

### Build for Production
```bash
npm run build:prod
```
Creates production build using `.env.production` configuration

### Preview Builds
```bash
npm run preview        # Preview default build
npm run preview:uat    # Preview UAT build
npm run preview:prod   # Preview production build
```

## Configuration Steps

### 1. Update API URLs
Edit the environment files with your actual API URLs:

**`.env.uat`**
```
VITE_API_URL=https://uat-api.yourapp.com
```

**`.env.production`**
```
VITE_API_URL=https://api.yourapp.com
```

### 2. Local Overrides (Optional)
Create `.env.local` for personal local settings (gitignored):
```bash
cp .env.example .env.local
```

## Accessing Environment Variables

In your code, access variables using:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const env = import.meta.env.VITE_ENV;
```

## Important Notes

- ⚠️ Only variables prefixed with `VITE_` are exposed to the client
- 🔒 Never commit sensitive data to `.env` files
- 📝 Use `.env.local` for local secrets (gitignored)
- 🚀 Always test builds before deploying

## Deployment

### UAT Deployment
```bash
npm run build:uat
# Deploy contents of dist/ folder to UAT server
```

### Production Deployment
```bash
npm run build:prod
# Deploy contents of dist/ folder to production server
```
