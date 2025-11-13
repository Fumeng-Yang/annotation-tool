# Google Sheets Setup Template

This document provides the exact column headers and sample data for setting up your Google Sheets database.

## Sheet 1: "Papers"

### Column Headers (Row 1)
```
id | title | abstract | link | code_full_paper | contribution | application_domain | ai_roles | human_roles | ai_influence | human_influence | decision_type
```

### Sample Data (Row 2+)

```csv
1,Machine Learning for Medical Diagnosis,This paper presents a novel machine learning approach for automated medical diagnosis using deep learning techniques...,https://example.com/paper1,TRUE,,,,,,,
2,Human-AI Collaboration in Finance,An empirical study examining how financial analysts interact with AI-powered decision support systems...,https://example.com/paper2,TRUE,,,,,,,
3,Explainable AI Systems,This work proposes a framework for creating interpretable machine learning models...,https://example.com/paper3,FALSE,,,,,,,
```

### Notes:
- `id`: Must be unique for each paper
- `code_full_paper`: Use TRUE/FALSE, yes/no, or leave empty (defaults to FALSE)
- Pre-fill `contribution`, `application_domain`, etc. if you have initial data, otherwise leave empty
- These will be filled by coders during annotation

---

## Sheet 2: "Coder_Alice"

### Column Headers (Row 1)
```
id | contribution | application_domain | ai_roles | human_roles | ai_influence | human_influence | decision_type | status | notes
```

### Pre-populated Data (Row 2+)
```
1
2
5
8
12
```

### Notes:
- Only fill the `id` column with IDs from the Papers sheet
- Leave all other columns empty - they'll be filled during annotation
- Each row represents one paper this coder should annotate

---

## Sheet 3: "Coder_Bob"

Same structure as Coder_Alice, different paper assignments:

### Column Headers (Row 1)
```
id | contribution | application_domain | ai_roles | human_roles | ai_influence | human_influence | decision_type | status | notes
```

### Pre-populated Data (Row 2+)
```
3
4
6
9
13
```

---

## Sheet 4: "Coder_Charlie"

Same structure, different assignments:

### Column Headers (Row 1)
```
id | contribution | application_domain | ai_roles | human_roles | ai_influence | human_influence | decision_type | status | notes
```

### Pre-populated Data (Row 2+)
```
7
10
11
14
15
```

---

## Sheet 5: "Coder_David"

Same structure, different assignments:

### Column Headers (Row 1)
```
id | contribution | application_domain | ai_roles | human_roles | ai_influence | human_influence | decision_type | status | notes
```

### Pre-populated Data (Row 2+)
```
1
3
5
7
9
```

---

## Assignment Strategies

### Strategy 1: Non-overlapping (Basic)
Each paper assigned to exactly one coder:
- Alice: papers 1-100
- Bob: papers 101-200
- Charlie: papers 201-300
- David: papers 301-400

**Pros**: Simple, no duplication
**Cons**: No inter-rater reliability check

### Strategy 2: Overlapping (Inter-rater Reliability)
Some papers assigned to multiple coders:
- Alice: papers 1-100 + overlap set (1,5,10,15,20)
- Bob: papers 101-200 + overlap set (1,5,10,15,20)
- Charlie: papers 201-300 + overlap set (1,5,10,15,20)
- David: papers 301-400 + overlap set (1,5,10,15,20)

**Pros**: Can calculate inter-rater reliability (Cohen's kappa, etc.)
**Cons**: More work, some duplication

### Strategy 3: Systematic Overlap
Regular pattern of overlap:
- Every 10th paper coded by 2 people
- Every 20th paper coded by all coders

**Pros**: Balance between reliability and efficiency
**Cons**: Requires careful planning

---

## Quick Setup Script (Google Sheets Apps Script)

You can use this script to quickly populate coder sheets:

```javascript
function setupCoderSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const papersSheet = ss.getSheetByName('Papers');
  
  // Get all paper IDs
  const paperData = papersSheet.getRange(2, 1, papersSheet.getLastRow() - 1, 1).getValues();
  const paperIds = paperData.map(row => row[0]).filter(id => id);
  
  // Define coders and their assignments
  const assignments = {
    'Alice': paperIds.filter((_, i) => i % 4 === 0), // Every 4th paper starting at 0
    'Bob': paperIds.filter((_, i) => i % 4 === 1),   // Every 4th paper starting at 1
    'Charlie': paperIds.filter((_, i) => i % 4 === 2), // Every 4th paper starting at 2
    'David': paperIds.filter((_, i) => i % 4 === 3)    // Every 4th paper starting at 3
  };
  
  // Column headers for coder sheets
  const headers = [
    'id', 'contribution', 'application_domain', 'ai_roles', 
    'human_roles', 'ai_influence', 'human_influence', 'decision_type', 
    'status', 'notes'
  ];
  
  // Create/update each coder sheet
  Object.keys(assignments).forEach(coderName => {
    const sheetName = 'Coder_' + coderName;
    let sheet = ss.getSheetByName(sheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    } else {
      sheet.clear(); // Clear existing content
    }
    
    // Set headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    
    // Add paper IDs
    const paperIdsForCoder = assignments[coderName].map(id => [id]);
    if (paperIdsForCoder.length > 0) {
      sheet.getRange(2, 1, paperIdsForCoder.length, 1).setValues(paperIdsForCoder);
    }
    
    // Format the sheet
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  });
  
  Logger.log('Coder sheets created successfully!');
}
```

**To use this script:**
1. In your Google Sheet, go to Extensions > Apps Script
2. Paste this code in a new file
3. Save and run the `setupCoderSheets` function
4. Authorize when prompted
5. Check the created/updated coder sheets

**To modify assignments:**
- Edit the `assignments` object
- For example, to assign specific papers to Alice:
  ```javascript
  'Alice': [1, 5, 10, 15, 20, 25, 30]
  ```

---

## Validation Checklist

Before deploying, verify:

- [ ] "Papers" sheet exists with correct column headers
- [ ] All paper IDs are unique
- [ ] `code_full_paper` column has valid values (TRUE/FALSE/yes/no)
- [ ] All coder sheets exist: Coder_Alice, Coder_Bob, etc.
- [ ] All coder sheets have correct column headers (exact spelling)
- [ ] Each coder sheet has id values filled
- [ ] Paper IDs in coder sheets match IDs in Papers sheet
- [ ] No duplicate column headers in any sheet
- [ ] Sheet names are exact (case-sensitive: "Coder_Alice" not "coder_alice")

---

## Common Mistakes to Avoid

1. **Wrong sheet name**: "Coder Alice" instead of "Coder_Alice" (underscore required)
2. **Missing headers**: Forgetting to add column headers
3. **Wrong column order**: Column order doesn't matter, but names must match exactly
4. **Invalid paper IDs**: Paper IDs in coder sheets that don't exist in Papers sheet
5. **Mixed case**: "id" instead of "id"
6. **Extra spaces**: "id " with trailing space
7. **Wrong data types**: Text in `code_full_paper` like "yes " with space

---

## Testing Your Setup

1. **Manual test**:
   - Add 1-2 test papers to Papers sheet
   - Add those paper IDs to one coder sheet
   - Try logging in with that coder name
   - Verify papers appear in dashboard

2. **Data validation**:
   - Check that all paper IDs in coder sheets exist in Papers sheet
   - Verify no duplicate paper IDs in Papers sheet
   - Confirm all sheets have correct headers

3. **Edge cases**:
   - Test with empty values in Papers sheet
   - Test with very long abstracts
   - Test with special characters in titles

---

## Backup Strategy

1. **Before starting**:
   - File > Make a copy (keep original as backup)

2. **Regular backups**:
   - File > Download > Microsoft Excel (.xlsx)
   - Save with date: `annotations_backup_2025-11-10.xlsx`

3. **Version control**:
   - Keep copies after major milestones
   - Document changes in a separate "Changelog" sheet

---

## Data Export for Analysis

When annotation is complete:

```javascript
function exportAnnotations() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const coders = ['Tae', 'zz', 'Georgia', 'fy'];
  
  // Create new sheet for export
  const exportSheet = ss.insertSheet('Export_All_Annotations');
  const headers = ['coder', 'id', 'contribution', 'application_domain', 
                   'ai_roles', 'human_roles', 'ai_influence', 'human_influence', 
                   'decision_type', 'status', 'notes'];
  
  exportSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  let currentRow = 2;
  
  coders.forEach(coder => {
    const sheet = ss.getSheetByName('Coder_' + coder);
    if (!sheet) return;
    
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const row = [coder, ...data[i]];
      exportSheet.getRange(currentRow, 1, 1, row.length).setValues([row]);
      currentRow++;
    }
  });
  
  Logger.log('Export complete!');
}
```

---

**Ready to start?** Follow the README.md for complete deployment instructions.
