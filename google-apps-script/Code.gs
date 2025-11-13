/**
 * Paper Annotation Tool - Google Apps Script API
 * This script provides REST API endpoints for the React frontend
 */

// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your actual spreadsheet ID
const PAPERS_SHEET_NAME = 'Papers';
const CODER_PREFIX = 'Coder_';

/**
 * Main entry point for GET and POST requests
 */
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'login':
        return handleLogin(e.parameter.coder_name);
      case 'papers':
        return handleGetPapers(e.parameter.coder_name);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    return createResponse(false, error.toString());
  }
}

function doPost(e) {
  const action = e.parameter.action;
  
  try {
    const data = JSON.parse(e.postData.contents);
    
    switch(action) {
      case 'save_annotation':
        return handleSaveAnnotation(data);
      case 'complete_paper':
        return handleCompletePaper(data);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    return createResponse(false, error.toString());
  }
}

/**
 * Handle login request
 */
function handleLogin(coderName) {
  if (!coderName) {
    return createResponse(false, 'Coder name is required');
  }
  
  const sheetName = CODER_PREFIX + coderName;
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return createResponse(false, 'Sheet not found for coder: ' + coderName);
  }
  
  return createResponse(true, {
    coder_name: coderName,
    sheet_name: sheetName
  });
}

/**
 * Get all papers for a specific coder with their annotations
 */
function handleGetPapers(coderName) {
  if (!coderName) {
    return createResponse(false, 'Coder name is required');
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const papersSheet = ss.getSheetByName(PAPERS_SHEET_NAME);
  const coderSheet = ss.getSheetByName(CODER_PREFIX + coderName);
  
  if (!coderSheet) {
    return createResponse(false, 'Coder sheet not found');
  }
  
  // Get papers data
  const papersData = papersSheet.getDataRange().getValues();
  const papersHeaders = papersData[0];
  const papersMap = {};
  
  for (let i = 1; i < papersData.length; i++) {
    const row = papersData[i];
    const paperObj = {};
    papersHeaders.forEach((header, idx) => {
      paperObj[header] = row[idx];
    });
    papersMap[paperObj.id] = paperObj;
  }
  
  // Get coder's annotations
  const coderData = coderSheet.getDataRange().getValues();
  const coderHeaders = coderData[0];
  const papers = [];
  
  for (let i = 1; i < coderData.length; i++) {
    const row = coderData[i];
    const paperId = row[0]; // First column is id
    
    if (!paperId || !papersMap[paperId]) continue;
    
    const paperInfo = papersMap[paperId];
    const annotations = {};
    
    coderHeaders.forEach((header, idx) => {
      if (header === 'id') return;
      
      const value = row[idx];
      if (header === 'status' || header === 'notes') {
        annotations[header] = value || '';
      } else {
        // Multi-select fields: convert comma-separated to array
        annotations[header] = value ? value.toString().split(',').map(v => v.trim()) : [];
      }
    });
    
    papers.push({
      id: paperId.toString(),
      title: paperInfo.title || '',
      abstract: paperInfo.abstract || '',
      link: paperInfo.link || '',
      code_full_paper: parseBoolean(paperInfo.code_full_paper),
      status: annotations.status || 'not_started',
      annotations: annotations
    });
  }
  
  return createResponse(true, { papers: papers });
}

/**
 * Save annotation for a specific paper
 */
function handleSaveAnnotation(data) {
  const { coder_name, id, annotations, status } = data;
  
  if (!coder_name || !id) {
    return createResponse(false, 'Missing required fields');
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const coderSheet = ss.getSheetByName(CODER_PREFIX + coder_name);
  
  if (!coderSheet) {
    return createResponse(false, 'Coder sheet not found');
  }
  
  // Find the row for this id
  const data_range = coderSheet.getDataRange();
  const values = data_range.getValues();
  const headers = values[0];
  
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0].toString() === id.toString()) {
      rowIndex = i;
      break;
    }
  }
  
  if (rowIndex === -1) {
    return createResponse(false, 'Paper ID not found in coder sheet');
  }
  
  // Update the row
  const rowData = values[rowIndex];
  headers.forEach((header, idx) => {
    if (header === 'id') return;
    
    if (header === 'status') {
      rowData[idx] = status || 'in_progress';
    } else if (header === 'notes') {
      rowData[idx] = annotations[header] || '';
    } else if (annotations[header] !== undefined) {
      // Multi-select: convert array to comma-separated string
      rowData[idx] = Array.isArray(annotations[header]) 
        ? annotations[header].join(', ') 
        : annotations[header];
    }
  });
  
  // Write back to sheet
  const range = coderSheet.getRange(rowIndex + 1, 1, 1, headers.length);
  range.setValues([rowData]);
  
  return createResponse(true, { message: 'Annotation saved' });
}

/**
 * Mark a paper as completed
 */
function handleCompletePaper(data) {
  const { coder_name, id } = data;
  
  if (!coder_name || !id) {
    return createResponse(false, 'Missing required fields');
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const coderSheet = ss.getSheetByName(CODER_PREFIX + coder_name);
  
  if (!coderSheet) {
    return createResponse(false, 'Coder sheet not found');
  }
  
  // Find the row and update status
  const data_range = coderSheet.getDataRange();
  const values = data_range.getValues();
  const headers = values[0];
  const statusColIdx = headers.indexOf('status');
  
  if (statusColIdx === -1) {
    return createResponse(false, 'Status column not found');
  }
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0].toString() === id.toString()) {
      coderSheet.getRange(i + 1, statusColIdx + 1).setValue('completed');
      return createResponse(true, { message: 'Paper marked as completed' });
    }
  }
  
  return createResponse(false, 'Paper ID not found');
}

/**
 * Helper function to create JSON response
 */
function createResponse(success, data) {
  const response = success 
    ? { success: true, ...data }
    : { success: false, error: data };
    
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Parse boolean values from sheets
 */
function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  const str = value.toString().toLowerCase();
  return str === 'true' || str === 'yes' || str === '1';
}
