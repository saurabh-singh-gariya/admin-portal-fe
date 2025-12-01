# Admin Portal Frontend - Deployment Guide

## Git Setup (✅ Completed)

Git has been initialized and the initial commit has been made.

## Next Steps for Deployment

### 1. Create a Remote Repository

Choose one of these platforms:

#### Option A: GitHub
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `admin-portal-fe` (or your preferred name)
3. **Don't** initialize with README, .gitignore, or license
4. Copy the repository URL

#### Option B: GitLab
1. Go to [GitLab](https://gitlab.com) and create a new project
2. Name it `admin-portal-fe`
3. Copy the repository URL

#### Option C: Bitbucket
1. Go to [Bitbucket](https://bitbucket.org) and create a new repository
2. Name it `admin-portal-fe`
3. Copy the repository URL

### 2. Connect to Remote Repository

```powershell
cd "C:\Users\sgari\Desktop\New folder\admin-portal-fe"
git remote add origin <YOUR_REPOSITORY_URL>
git branch -M main
git push -u origin main
```

### 3. Deployment Options

#### Option A: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (optional, or use web interface):
   ```powershell
   npm install -g vercel
   ```

2. **Deploy via CLI**:
   ```powershell
   cd "C:\Users\sgari\Desktop\New folder\admin-portal-fe"
   vercel
   ```
   Follow the prompts to link your project.

3. **Or Deploy via Web**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite and configure it
   - Click "Deploy"

4. **Environment Variables** (if needed):
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add any required env variables (e.g., `VITE_API_URL`)

#### Option B: Netlify

1. **Install Netlify CLI**:
   ```powershell
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```powershell
   npm run build
   ```

3. **Deploy**:
   ```powershell
   netlify deploy --prod
   ```

4. **Or use Netlify Web**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

#### Option C: GitHub Pages

1. **Install gh-pages**:
   ```powershell
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   Add to `scripts`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **Update vite.config.ts**:
   ```typescript
   export default defineConfig({
     base: '/admin-portal-fe/', // Your repo name
     // ... rest of config
   })
   ```

4. **Deploy**:
   ```powershell
   npm run deploy
   ```

#### Option D: Traditional Hosting (cPanel, etc.)

1. **Build the project**:
   ```powershell
   npm run build
   ```

2. **Upload dist folder**:
   - Upload the contents of the `dist` folder to your web server
   - Ensure your server is configured to serve the `index.html` for all routes

### 4. Build Configuration

Before deploying, ensure your build is configured correctly:

1. **Check `vite.config.ts`**:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     // Add base path if deploying to subdirectory
     // base: '/admin-portal-fe/',
   })
   ```

2. **Environment Variables**:
   Create `.env.production` file:
   ```
   VITE_API_URL=https://your-api-url.com
   ```

3. **Build Command**:
   ```powershell
   npm run build
   ```

### 5. Post-Deployment Checklist

- [ ] Test the deployed application
- [ ] Verify API endpoints are accessible
- [ ] Check mobile responsiveness
- [ ] Test authentication flow
- [ ] Verify all routes work correctly
- [ ] Set up custom domain (if needed)
- [ ] Configure HTTPS/SSL
- [ ] Set up monitoring/analytics (optional)

### 6. Continuous Deployment

Once connected to a remote repository:

- **Vercel/Netlify**: Automatically deploys on every push to `main` branch
- **GitHub Actions**: Can set up CI/CD pipeline for other platforms

### 7. Useful Commands

```powershell
# Check git status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to remote
git push origin main

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`
- Verify environment variables are set

### Routing Issues
- For SPA routing, ensure server is configured to serve `index.html` for all routes
- Check `vite.config.ts` base path configuration

### API Connection Issues
- Verify `VITE_API_URL` environment variable is set correctly
- Check CORS settings on your backend API

## Support

For issues or questions, check:
- Vite documentation: https://vitejs.dev
- React documentation: https://react.dev
- Your deployment platform's documentation

