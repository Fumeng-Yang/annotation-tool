# Paper Annotation Tool

A collaborative web application for annotating research papers using Google Sheets as the backend database. Built with React.js and Google Apps Script.

## Features

- **Multi-coder Support**: Each coder has their own annotation sheet
- **Multi-select Annotations**: Rich annotation schema with multiple categories
- **Auto-save**: Automatic saving with 2-second debouncing
- **Progress Tracking**: Visual progress indicators and statistics
- **Conditional Fields**: Smart form that adapts based on paper metadata
- **Paper Navigation**: Easy navigation between papers
- **Status Management**: Track papers as not started, in progress, or completed
- **Search & Filter**: Find papers quickly by title or status

## Technology Stack

- **Frontend**: React.js 18
- **Backend**: Google Apps Script (Web App)
- **Database**: Google Sheets
- **Routing**: React Router v6
- **Browser**: Optimized for Chrome

## Project Structure

```
paper-annotation-tool/
├── google-apps-script/
│   └── Code.gs                    # Google Apps Script API
├── public/
│   └── index.html                 # HTML template
├── src/
│   ├── components/
│   │   ├── MultiSelect.js         # Multi-select dropdown component
│   │   └── MultiSelect.css
│   ├── config/
│   │   ├── api.js                 # API configuration
│   │   └── annotationSchema.json  # Annotation schema definition
│   ├── context/
│   │   └── AppContext.js          # Global state management
│   ├── pages/
│   │   ├── LoginPage.js           # Login page
│   │   ├── LoginPage.css
│   │   ├── DashboardPage.js       # Dashboard with paper list
│   │   ├── DashboardPage.css
│   │   ├── AnnotationPage.js      # Annotation interface
│   │   └── AnnotationPage.css
│   ├── App.js                     # Main app component
│   ├── App.css
│   ├── index.js                   # Entry point
│   └── index.css
├── package.json
└── README.md
```

## Setup Instructions

### Part 1: Google Sheets Setup

1. **Create a new Google Sheet** with the following structure:

#### Sheet 1: "Papers" (Main Data Sheet)
Create a sheet named exactly "Papers" with these columns:

| id | title | abstract | link | code_full_paper | contribution | application_domain | ai_roles | human_roles | ai_influence | human_influence | decision_type |
|----|-------|----------|------|----------------|--------------|-------------------|----------|-------------|--------------|-----------------|---------------|

**Column Descriptions:**
- `id`: Unique paper identifier (e.g., 1, 2, 3...)
- `title`: Paper title
- `abstract`: Paper abstract
- `link`: URL to the paper
- `code_full_paper`: TRUE/FALSE or yes/no (determines if influence fields are required)
- `contribution`: Pre-filled contribution type (optional)
- `application_domain`: Pre-filled domain (optional)
- Other fields: Can be left empty initially

#### Sheet 2-5: Coder Sheets
Create one sheet for each coder with the naming convention "Coder_[Name]":
- `Coder_Alice`
- `Coder_Bob`
- `Coder_Charlie`
- `Coder_David`

Each coder sheet should have these columns:

| paper_id | contribution | application_domain | ai_roles | human_roles | ai_influence | human_influence | decision_type | status | notes |
|----------|--------------|-------------------|----------|-------------|--------------|-----------------|---------------|--------|-------|

**Pre-populate the `paper_id` column** with the IDs of papers each coder should annotate. Leave other columns empty.

Example for Coder_Alice:
```
paper_id
1
2
3
...
```

2. **Note your Spreadsheet ID**
   - Your spreadsheet URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part

### Part 2: Google Apps Script Deployment

1. **Open Google Apps Script**
   - In your Google Sheet, go to `Extensions > Apps Script`

2. **Replace Code**
   - Delete any existing code
   - Copy the entire contents of `google-apps-script/Code.gs`
   - Paste it into the Apps Script editor

3. **Update Configuration**
   - Find the line: `const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';`
   - Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID

4. **Deploy as Web App**
   - Click `Deploy > New deployment`
   - Click the gear icon next to "Select type" and choose "Web app"
   - Fill in the deployment settings:
     - **Description**: "Paper Annotation API v1"
     - **Execute as**: "Me"
     - **Who has access**: "Anyone" (or "Anyone with Google account" if you want some security)
   - Click `Deploy`
   - **Important**: Copy the "Web app URL" - you'll need this for the React app

5. **Authorize the Script**
   - The first time you deploy, you'll need to authorize the script
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" if you see a warning, then "Go to [Project Name] (unsafe)"
   - Click "Allow"

### Part 3: React Application Setup

1. **Install Dependencies**
   ```bash
   cd paper-annotation-tool
   npm install
   ```

2. **Configure API Endpoint**
   - Open `src/config/api.js`
   - Replace `YOUR_DEPLOYMENT_ID` with your actual Google Apps Script Web App URL:
   ```javascript
   export const API_BASE_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_DEPLOYMENT_ID/exec';
   ```

3. **Customize Annotation Schema (Optional)**
   - Edit `src/config/annotationSchema.json` to customize your annotation categories
   - Each category should follow this structure:
   ```json
   {
     "field_name": {
       "label": "Display Label",
       "definition": "Description of what this field measures",
       "options": [
         {
           "value": "option_key",
           "label": "Option Display Name",
           "description": "Description of this option"
         }
       ]
     }
   }
   ```

4. **Update Coder Names (Optional)**
   - If you're using different coder names, make sure they match your Google Sheets naming:
   - Sheets must be named: `Coder_[Name]` (e.g., `Coder_John`, `Coder_Mary`)

5. **Start Development Server**
   ```bash
   npm start
   ```
   - The app will open at `http://localhost:3000`

### Part 4: Testing

1. **Test Login**
   - Enter a coder name (e.g., "Alice")
   - You should see the dashboard with papers assigned to that coder

2. **Test Annotation**
   - Click on a paper card
   - Try selecting multiple options from dropdowns
   - Add notes
   - Check that auto-save works (watch for "Saved" indicator)
   - Try marking a paper as complete

3. **Verify Data in Google Sheets**
   - Check the coder's sheet to see if annotations are saved
   - Multi-select values should be comma-separated (e.g., "option1,option2")

### Part 5: Deployment (Production)

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Hosting**
   - Deploy the `build` folder to your hosting service:
     - **Netlify**: Drag and drop the `build` folder
     - **Vercel**: Connect your GitHub repo
     - **GitHub Pages**: Use `gh-pages` package
     - **Firebase Hosting**: Use Firebase CLI

3. **Update CORS Settings (if needed)**
   - Google Apps Script web apps generally don't have CORS issues
   - If you encounter any, you may need to update the deployment settings

## Usage Guide

### For Coders

1. **Login**
   - Enter your assigned name (e.g., Alice, Bob, Charlie, David)

2. **Dashboard**
   - View all papers assigned to you
   - See progress statistics
   - Filter by status (All, Not Started, In Progress, Completed)
   - Search for specific papers

3. **Annotate Papers**
   - Click on a paper to start annotating
   - Fill in annotation fields (all support multiple selections)
   - Fields marked with ⓘ have definitions (hover to see)
   - Add optional notes
   - Auto-save happens automatically after 2 seconds of inactivity
   - Manually save with "Save Progress" button or Ctrl+S (Cmd+S on Mac)
   - Use "Mark as Complete" when finished
   - Navigate between papers using Previous/Next buttons

4. **Keyboard Shortcuts**
   - `Ctrl+S` (or `Cmd+S` on Mac): Manual save

### For Administrators

1. **Adding New Papers**
   - Add rows to the "Papers" sheet
   - Assign papers to coders by adding paper_ids to their sheets

2. **Adding New Coders**
   - Create a new sheet named "Coder_[Name]"
   - Add the same column headers as other coder sheets
   - Populate with paper_ids

3. **Monitoring Progress**
   - Check individual coder sheets for their annotations
   - Status column shows: "not_started", "in_progress", or "completed"
   - Export data for analysis as needed

4. **Updating Annotation Schema**
   - Edit `annotationSchema.json`
   - Rebuild and redeploy the React app
   - Note: Changing field names will require updating Google Sheets columns

## Annotation Schema Reference

The default schema includes these fields:

- **Contribution Type**: Main contribution of the paper
- **Application Domain**: Field where research is applied
- **AI Roles**: Role of AI in decision-making
- **Human Roles**: Role of humans in decision-making
- **AI Influence**: Level of AI influence (conditional)
- **Human Influence**: Level of human influence (conditional)
- **Decision Type**: Category of decision being made
- **Notes**: Free-form text field for additional comments

## Troubleshooting

### Login Issues
- **Error: "Sheet not found for coder: [Name]"**
  - Check that the sheet is named exactly "Coder_[Name]" (case-sensitive)
  - Verify the coder name matches the sheet name

### Data Not Saving
- **Check Google Apps Script logs:**
  - Go to Apps Script editor > Executions
  - Look for errors in recent executions
- **Check browser console:**
  - Press F12 to open developer tools
  - Look for network errors or JavaScript errors

### Papers Not Loading
- **Verify Spreadsheet ID** is correct in `Code.gs`
- **Check API URL** in `src/config/api.js`
- **Verify deployment** is published as web app with correct permissions

### Conditional Fields Not Showing
- Check that `code_full_paper` column in "Papers" sheet has correct values
- Valid values: "TRUE", "FALSE", "yes", "no", true, false
- Case-insensitive

## API Reference

### Endpoints

#### GET /login
- **Parameters**: `coder_name`
- **Returns**: Login status and sheet name

#### GET /papers
- **Parameters**: `coder_name`
- **Returns**: Array of papers with annotations

#### POST /save_annotation
- **Body**: `{ coder_name, paper_id, annotations, status }`
- **Returns**: Save confirmation

#### POST /complete_paper
- **Body**: `{ coder_name, paper_id }`
- **Returns**: Completion confirmation

## Data Format

### Multi-select Values
- Stored as comma-separated strings in Google Sheets
- Example: "novel_algorithm,empirical_study"
- Converted to/from arrays by the API

### Status Values
- `not_started`: Paper not yet annotated
- `in_progress`: Annotation started but not completed
- `completed`: Annotation finished

## Browser Support

- **Optimized for**: Chrome
- **Also works**: Firefox, Safari, Edge (modern versions)
- **Note**: Some features may have limited support in older browsers

## Security Notes

- This tool uses **session-based authentication** with names only
- **No password protection** - suitable for trusted environments
- For production with sensitive data:
  - Restrict Google Apps Script web app to "Anyone with Google account"
  - Implement proper authentication
  - Use environment variables for sensitive configuration

## License

This project is provided as-is for research purposes.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review Google Apps Script execution logs
3. Check browser console for errors
4. Verify Google Sheets structure matches specification

## Contributing

To add new features:
1. Update annotation schema in `annotationSchema.json`
2. Modify React components as needed
3. Update Google Apps Script if schema changes affect data structure
4. Test thoroughly with sample data
5. Update documentation

---

**Version**: 1.0.0  
**Last Updated**: November 2025
