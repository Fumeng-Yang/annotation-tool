# Quick Start Guide

Get the Paper Annotation Tool running in 15 minutes!

## Step 1: Google Sheet (5 minutes)

1. Create a new Google Sheet
2. Create these 5 sheets with exact names:
   - `Papers`
   - `Coder_Alice`
   - `Coder_Bob`
   - `Coder_Charlie`
   - `Coder_David`

3. In **Papers** sheet, add these headers in row 1:
   ```
   id | title | abstract | link | code_full_paper | contribution | application_domain | ai_roles | human_roles | ai_influence | human_influence | decision_type
   ```

4. Add a few test papers (rows 2+):
   ```
   1 | Test Paper 1 | This is a test abstract | http://example.com | TRUE | | | | | | |
   2 | Test Paper 2 | Another test abstract | http://example.com | FALSE | | | | | | |
   ```

5. In each **Coder_[Name]** sheet, add these headers in row 1:
   ```
   paper_id | contribution | application_domain | ai_roles | human_roles | ai_influence | human_influence | decision_type | status | notes
   ```

6. In each coder sheet, add some paper IDs (column A, rows 2+):
   ```
   1
   2
   ```

7. Copy your spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[COPY_THIS_ID]/edit
   ```

## Step 2: Google Apps Script (5 minutes)

1. In your Google Sheet: **Extensions > Apps Script**

2. Delete existing code, paste code from `google-apps-script/Code.gs`

3. Find this line and update it:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```
   Replace with your actual ID

4. Click **Deploy > New deployment**
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click **Deploy**

5. **Authorize** the script (click through security warnings)

6. **Copy the Web App URL** - looks like:
   ```
   https://script.google.com/macros/s/[LONG_ID]/exec
   ```
AKfycbw7L9R_qPXtq0mFXrGtEURywpXyD31r0hcGi0vU_toIXa2pC7CFZ4O6ZdK4t-xbEkcy

https://script.google.com/macros/s/AKfycbw7L9R_qPXtq0mFXrGtEURywpXyD31r0hcGi0vU_toIXa2pC7CFZ4O6ZdK4t-xbEkcy/exec

## Step 3: React App (5 minutes)

1. Open `src/config/api.js`

2. Replace the API URL:
   ```javascript
   export const API_BASE_URL = 'YOUR_WEB_APP_URL_HERE';
   ```

3. Install and run:
   ```bash
   cd paper-annotation-tool
   npm install
   npm start
   ```

4. App opens at `http://localhost:3000`

## Step 4: Test (2 minutes)

1. Login with "Alice"
2. Click on a test paper
3. Select some annotations
4. Check Google Sheets - annotations should be saved!

## ✅ You're Done!

**Next steps:**
- Read the full [README.md](README.md) for detailed info
- Customize [annotationSchema.json](src/config/annotationSchema.json)
- Add your real papers to the Papers sheet
- Deploy to production ([DEPLOYMENT.md](DEPLOYMENT.md))

## Common First-Time Issues

**Can't login?**
- Check sheet names are exactly: `Coder_Alice` (with underscore)
- Check you put the right spreadsheet ID in Code.gs

**Papers not loading?**
- Verify Web App URL in `api.js`
- Check column headers match exactly (case-sensitive)
- Look at browser console (F12) for errors

**Nothing saves?**
- Check Google Apps Script logs (Apps Script > Executions)
- Verify paper_id values in coder sheets match Papers sheet IDs

**Still stuck?**
- Check the [Troubleshooting section in README.md](README.md#troubleshooting)
- Review Google Apps Script execution logs
- Check browser console for errors

---

**Time to complete**: ~15 minutes  
**Difficulty**: Beginner-friendly  
**Prerequisites**: Google account, Node.js installed
