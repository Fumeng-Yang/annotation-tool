# Paper Annotation Tool - Complete Code Package

## Overview

This is a complete, production-ready web application for collaborative paper annotation. It uses React.js for the frontend and Google Sheets as the backend database via Google Apps Script.

## What's Included

✅ **Frontend (React.js)**
- Complete React application with routing
- Multi-select dropdown components
- Auto-save functionality
- Progress tracking dashboard
- Responsive design

✅ **Backend (Google Apps Script)**
- RESTful API endpoints
- Data validation
- Multi-coder support
- Automatic data synchronization

✅ **Configuration**
- Customizable annotation schema
- API configuration
- Example data structures

✅ **Documentation**
- Comprehensive README
- Quick start guide
- Deployment guide
- Google Sheets setup guide

## Project Structure

```
paper-annotation-tool/
│
├── google-apps-script/
│   └── Code.gs                          # Backend API (Deploy to Google Apps Script)
│
├── public/
│   └── index.html                       # HTML template
│
├── src/
│   ├── components/
│   │   ├── MultiSelect.js              # Multi-select dropdown component
│   │   └── MultiSelect.css             # Multi-select styles
│   │
│   ├── config/
│   │   ├── api.js                      # API configuration (UPDATE THIS)
│   │   └── annotationSchema.json      # Annotation categories (CUSTOMIZE THIS)
│   │
│   ├── context/
│   │   └── AppContext.js               # Global state management
│   │
│   ├── pages/
│   │   ├── LoginPage.js                # Login interface
│   │   ├── LoginPage.css
│   │   ├── DashboardPage.js            # Paper list & progress tracking
│   │   ├── DashboardPage.css
│   │   ├── AnnotationPage.js           # Annotation interface
│   │   └── AnnotationPage.css
│   │
│   ├── App.js                          # Main application component
│   ├── App.css                         # Global styles
│   ├── index.js                        # Application entry point
│   └── index.css                       # Base styles
│
├── .gitignore                           # Git ignore rules
├── package.json                         # Dependencies and scripts
│
├── README.md                            # Complete documentation
├── QUICKSTART.md                        # 15-minute setup guide
├── DEPLOYMENT.md                        # Production deployment guide
└── SHEETS_SETUP.md                      # Google Sheets configuration guide
```

## Key Features

### For Coders (End Users)
- **Simple Login**: Enter name to access assigned papers
- **Progress Tracking**: Visual dashboard shows completion status
- **Rich Annotations**: Multi-select fields for complex categorization
- **Auto-save**: Changes saved automatically every 2 seconds
- **Easy Navigation**: Previous/Next buttons, keyboard shortcuts
- **Search & Filter**: Find papers quickly by title or status

### For Administrators
- **Easy Setup**: Google Sheets backend, no database required
- **Flexible Assignment**: Assign papers to coders as needed
- **Inter-rater Reliability**: Assign same papers to multiple coders
- **Real-time Monitoring**: Check progress in Google Sheets
- **Export Ready**: Data in spreadsheet format for analysis
- **Customizable Schema**: Modify annotation categories easily

### Technical Features
- **React 18**: Modern React with hooks
- **Context API**: Efficient state management
- **Responsive Design**: Works on desktop and tablet
- **Browser Storage**: Session persistence
- **Error Handling**: User-friendly error messages
- **Debounced Auto-save**: Reduces server load
- **Conditional Rendering**: Smart form based on paper metadata

## Quick Setup Steps

1. **Create Google Sheet** with Papers sheet and Coder sheets
2. **Deploy Google Apps Script** with your spreadsheet ID
3. **Configure React app** with your API URL
4. **Install and run**: `npm install && npm start`
5. **Test**: Login and annotate a test paper

📖 **See [QUICKSTART.md](QUICKSTART.md) for detailed 15-minute setup**

## Configuration Files to Update

### Required Updates

1. **`google-apps-script/Code.gs`**
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Line 7
   ```

2. **`src/config/api.js`**
   ```javascript
   export const API_BASE_URL = 'YOUR_WEB_APP_URL_HERE'; // Line 3
   ```

### Optional Customization

3. **`src/config/annotationSchema.json`**
   - Modify annotation categories
   - Add/remove fields
   - Change option labels and descriptions

## Technology Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Native Fetch API
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Build Tool**: React Scripts (Create React App)
- **Language**: JavaScript (ES6+)

## Browser Support

- ✅ **Chrome** (Primary target, fully tested)
- ✅ Firefox (Compatible)
- ✅ Safari (Compatible)
- ✅ Edge (Compatible)

## API Endpoints

### GET Endpoints
- `/login?coder_name={name}` - Authenticate coder
- `/papers?coder_name={name}` - Get papers for coder

### POST Endpoints
- `/save_annotation` - Save paper annotations
- `/complete_paper` - Mark paper as completed

## Data Model

### Papers Sheet
- Paper metadata (id, title, abstract, link)
- `code_full_paper` flag for conditional fields
- Optional pre-filled annotations

### Coder Sheets
- Assigned paper IDs
- Annotation values (multi-select as CSV)
- Status (not_started, in_progress, completed)
- Optional notes

## Default Annotation Schema

1. **Contribution Type** - Main contribution of the paper
2. **Application Domain** - Field where research is applied
3. **AI Roles** - Role of AI in decision-making
4. **Human Roles** - Role of humans in decision-making
5. **AI Influence** - Level of AI influence (conditional)
6. **Human Influence** - Level of human influence (conditional)
7. **Decision Type** - Category of decision being made
8. **Notes** - Free-form text field

## Deployment Options

- **Netlify** - Easiest, drag-and-drop deployment
- **Vercel** - GitHub integration, automatic deploys
- **GitHub Pages** - Free hosting for open source
- **Firebase Hosting** - Google infrastructure
- **Custom Server** - Any static hosting

📖 **See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment details**

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Build for production (creates /build folder)
npm run build

# Run tests
npm test
```

## Security Considerations

### Current Implementation
- ✅ No passwords (simple name-based login)
- ✅ Session-based authentication
- ✅ Suitable for trusted environments
- ⚠️ No data encryption
- ⚠️ Anyone with link can access (if public)

### For Production with Sensitive Data
- 🔒 Restrict Google Apps Script to "Anyone with Google account"
- 🔒 Add API key validation
- 🔒 Implement proper authentication
- 🔒 Use environment variables for config
- 🔒 Enable HTTPS only
- 🔒 Add rate limiting

## Scaling Considerations

### Google Sheets Limits
- 5 million cells per spreadsheet
- 200 sheets per spreadsheet
- Good for: 100-1000 papers, 5-20 coders

### Apps Script Limits (Free)
- 20,000 URL Fetch calls/day
- 6 min max execution time
- 90 min total/day

### When to Migrate
- \>1000 papers: Consider PostgreSQL/MongoDB
- \>20 coders: Consider real database
- Complex queries: Consider dedicated backend

## Customization Guide

### Change Coder Names
1. Update Google Sheet names: `Coder_[NewName]`
2. No code changes needed!

### Add New Annotation Field
1. Edit `src/config/annotationSchema.json`
2. Add column to Google Sheets (Coder sheets)
3. Update `SHEETS_SETUP.md` documentation

### Change UI Theme
- Edit CSS files in `src/pages/` and `src/components/`
- Update colors in `App.css`

### Add Features
- Keyboard shortcuts: Edit `AnnotationPage.js`
- New filters: Edit `DashboardPage.js`
- Export functionality: Add to Google Apps Script

## Testing Checklist

- [ ] Login works for all coders
- [ ] Papers load correctly
- [ ] Multi-select dropdowns work
- [ ] Auto-save functions (2-second delay)
- [ ] Manual save works (button + Ctrl+S)
- [ ] Mark complete updates status
- [ ] Navigation between papers works
- [ ] Filter by status works
- [ ] Search by title works
- [ ] Data saves to Google Sheets correctly
- [ ] Conditional fields show/hide correctly
- [ ] Progress statistics calculate correctly

## Support & Documentation

- 📖 **Full Setup**: [README.md](README.md)
- ⚡ **Quick Setup**: [QUICKSTART.md](QUICKSTART.md)
- 🚀 **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- 📊 **Google Sheets**: [SHEETS_SETUP.md](SHEETS_SETUP.md)

## License

This project is provided as-is for research and educational purposes.

## Contributing

Contributions welcome! To add features:
1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit pull request
5. Update documentation

## Version History

- **v1.0.0** (November 2025) - Initial release
  - Complete React frontend
  - Google Apps Script backend
  - Multi-coder support
  - Auto-save functionality
  - Progress tracking
  - Comprehensive documentation

## Contact & Support

For issues or questions:
1. Check troubleshooting in README.md
2. Review Google Apps Script execution logs
3. Check browser console for errors
4. Review documentation files

---

## Getting Started Now

**Ready to start?** Choose your path:

1. **Quick Start** (15 min): Follow [QUICKSTART.md](QUICKSTART.md)
2. **Detailed Setup**: Read [README.md](README.md)
3. **Just Exploring**: Look at the code structure above

**Files you MUST update:**
- `google-apps-script/Code.gs` - Line 7 (Spreadsheet ID)
- `src/config/api.js` - Line 3 (Web App URL)

**Files you MIGHT want to customize:**
- `src/config/annotationSchema.json` - Annotation categories

Everything else works out of the box! 🚀

---

**Version**: 1.0.0  
**Created**: November 2025  
**Status**: Production Ready ✅
