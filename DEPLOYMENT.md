# Deployment Guide

Quick reference for deploying the Paper Annotation Tool to production.

## Prerequisites Checklist

- [ ] Google Sheet created with proper structure
- [ ] Google Apps Script deployed as Web App
- [ ] Web App URL copied
- [ ] React app configured with API endpoint

## Google Apps Script Deployment

### Initial Deployment

1. Open Google Apps Script editor from your sheet
2. Paste the code from `google-apps-script/Code.gs`
3. Update `SPREADSHEET_ID` with your sheet ID
4. Go to Deploy > New deployment
5. Select "Web app" type
6. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone** (or **Anyone with Google account** for basic security)
7. Click Deploy
8. Copy the Web App URL (looks like: `https://script.google.com/macros/s/[ID]/exec`)
9. Authorize the script when prompted

### Updating Google Apps Script

When you make changes to the backend:

1. Edit the code in Apps Script editor
2. Go to Deploy > Manage deployments
3. Click the pencil icon to edit current deployment
4. Update the version description
5. Click Deploy
6. **Note**: URL stays the same, no need to update React app

## React App Deployment

### Configuration

1. Update `src/config/api.js`:
   ```javascript
   export const API_BASE_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec';
   ```

2. (Optional) Update `src/config/annotationSchema.json` with your schema

### Build

```bash
npm run build
```

This creates a `build/` folder with optimized production files.

### Deploy to Netlify (Recommended)

#### Option 1: Drag and Drop
1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up or log in
3. Drag the `build` folder to the deployment area
4. Done! Your site is live

#### Option 2: CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

#### Option 3: GitHub Integration
1. Push your code to GitHub
2. Connect your repo to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Deploy

### Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Or connect your GitHub repo on [vercel.com](https://vercel.com)

### Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "homepage": "https://[username].github.io/[repo-name]",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select your project
   - Public directory: `build`
   - Single-page app: `Yes`
   - Overwrite index.html: `No`

3. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## Testing Production Deployment

1. **Test Login**
   - Try logging in with each coder name
   - Verify error handling for invalid names

2. **Test Data Flow**
   - Make annotations on a test paper
   - Check Google Sheets to verify data saved
   - Try all multi-select fields
   - Test notes field

3. **Test Navigation**
   - Navigate between papers
   - Test Previous/Next buttons
   - Return to dashboard and re-enter

4. **Test Filters**
   - Filter by status
   - Search for papers
   - Verify counts are correct

5. **Test Auto-save**
   - Make changes and wait 2 seconds
   - Verify "Saved" indicator appears
   - Check sheet for updates

6. **Test Completion**
   - Mark a paper as complete
   - Verify status updates
   - Check dashboard shows correct status

## Common Issues

### CORS Errors
If you see CORS errors:
- Verify the Apps Script is deployed as "Web app"
- Check "Who has access" setting
- Try redeploying the Apps Script

### 404 Errors on Refresh
For hosting platforms (Netlify, Vercel):
- Add redirect rules for single-page apps
- Netlify: Create `public/_redirects`:
  ```
  /*    /index.html   200
  ```
- Vercel: Create `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

### Slow Loading
- Enable gzip compression on your hosting
- Consider adding a loading skeleton
- Optimize images if you add any

### Authentication Issues
- Verify coder sheet names match exactly (case-sensitive)
- Check Google Apps Script permissions
- Review Apps Script execution logs

## Environment Variables (Optional)

For better security, use environment variables:

1. Create `.env` file (add to `.gitignore`):
   ```
   REACT_APP_API_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```

2. Update `src/config/api.js`:
   ```javascript
   export const API_BASE_URL = process.env.REACT_APP_API_URL;
   ```

3. Configure on hosting platform:
   - Netlify: Site settings > Environment variables
   - Vercel: Project settings > Environment Variables
   - Firebase: Use Firebase functions config

## Monitoring

### Google Apps Script
- Check execution logs: Apps Script > Executions
- Monitor quota: Apps Script > Quotas
- Review errors: Apps Script > Error logs

### React App
- Use browser DevTools Network tab
- Monitor console for JavaScript errors
- Add error tracking (e.g., Sentry) for production

## Rollback Procedure

### If Apps Script breaks:
1. Go to Deploy > Manage deployments
2. Click "Archive" on current deployment
3. Redeploy previous version

### If React app breaks:
- Netlify: Go to Deploys > select previous deploy > Publish
- Vercel: Similar rollback interface
- GitHub Pages: Revert commit and redeploy

## Scaling Considerations

### Google Sheets Limits
- Max 5 million cells per spreadsheet
- Max 200 sheets per spreadsheet
- Consider splitting data if limits approached

### Apps Script Quotas (Free Tier)
- 20,000 URL Fetch calls per day
- 6 minutes max execution time
- 90 minutes total per day

### Solutions for Large Scale
- Upgrade to Google Workspace
- Use Google Sheets API directly
- Consider migrating to a database (PostgreSQL, MongoDB)

## Security Hardening (Optional)

1. **Restrict Apps Script Access**
   - Change "Who has access" to "Anyone with Google account"
   - Add authentication logic to Apps Script

2. **Add API Keys**
   - Generate API keys for each coder
   - Validate keys in Apps Script

3. **Use HTTPS Only**
   - Ensure hosting uses HTTPS
   - Add CSP headers

4. **Rate Limiting**
   - Add rate limiting to Apps Script
   - Use caching to reduce API calls

## Maintenance

### Regular Tasks
- Monitor Google Sheets size
- Review error logs weekly
- Update dependencies monthly
- Backup data regularly

### Updates
1. Test changes locally
2. Deploy to staging (if available)
3. Test thoroughly
4. Deploy to production
5. Monitor for issues

---

**Need Help?**
- Check the main README.md
- Review Google Apps Script execution logs
- Check browser console for errors
