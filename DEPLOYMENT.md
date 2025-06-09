# Deployment Guide

This guide covers deploying the Forbes Project Tracker to GitHub and hosting it online.

## GitHub Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click "New repository" or go to https://github.com/new
3. Repository name: `forbes-project-tracker`
4. Description: `Professional project tracking platform for civil engineering teams`
5. Set to Public (required for free GitHub Pages)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Push Code to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Forbes Project Tracker"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/forbes-project-tracker.git

# Push to GitHub
git push -u origin main
```

## Hosting Options

### Option 1: Vercel (Recommended)

Vercel provides excellent support for full-stack applications with automatic deployments.

1. Go to [Vercel](https://vercel.com)
2. Sign up/Sign in with your GitHub account
3. Click "New Project"
4. Import your `forbes-project-tracker` repository
5. Configure settings:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click "Deploy"

**Benefits:**
- Automatic deployments on every push
- Full-stack support (frontend + backend)
- Custom domain support
- Built-in analytics

### Option 2: Railway

Railway offers simple deployment for Node.js applications.

1. Go to [Railway](https://railway.app)
2. Sign up/Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will automatically detect it's a Node.js app
7. Set environment variables if needed
8. Deploy

### Option 3: Render

1. Go to [Render](https://render.com)
2. Sign up/Sign in with GitHub
3. Click "New +"
4. Select "Web Service"
5. Connect your GitHub repository
6. Configure:
   - Build Command: `npm run build`
   - Start Command: `npm start`
7. Deploy

### Option 4: GitHub Pages (Frontend Only)

For static hosting of just the frontend (requires API changes):

1. Go to your GitHub repository
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: Select `gh-pages` (will be created by GitHub Actions)
5. Click Save

The GitHub Actions workflow will automatically build and deploy to GitHub Pages.

## Environment Setup

The application runs with in-memory storage by default, so no database setup is required for basic deployment.

### Production Considerations

For production use, consider:

1. **Database Integration**: Replace in-memory storage with PostgreSQL/MySQL
2. **Authentication**: Add user authentication and authorization
3. **File Storage**: Set up cloud storage for larger CSV files
4. **Monitoring**: Add application monitoring and logging
5. **Backup**: Implement data backup strategies

## Custom Domain (Optional)

After deploying to Vercel/Railway/Render:

1. Purchase a domain from a registrar
2. In your hosting platform's dashboard:
   - Go to your project settings
   - Add custom domain
   - Follow DNS configuration instructions
3. Update DNS records as instructed

## Troubleshooting

### Build Failures
- Check Node.js version (requires 18+)
- Ensure all dependencies are listed in package.json
- Check for TypeScript errors

### Deployment Issues
- Verify build command produces dist/ folder
- Check start command points to correct file
- Ensure PORT environment variable is used

### API Issues
- Verify API routes are accessible
- Check for CORS configuration if needed
- Ensure backend and frontend are properly connected

## Update Deployment

To update your deployed application:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Hosting platforms will automatically redeploy

## Support

For deployment issues:
- Vercel: [Documentation](https://vercel.com/docs)
- Railway: [Documentation](https://docs.railway.app)
- Render: [Documentation](https://render.com/docs)
- GitHub Pages: [Documentation](https://docs.github.com/en/pages)