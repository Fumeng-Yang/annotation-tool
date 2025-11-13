// API Configuration
// Replace this with your deployed Google Apps Script Web App URL
export const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxrbnrZPzVrtzMdxfUmsSizDE3wKoKHsUFdFpOqOOJgli85GUcd4OujYMN84X2RGDeYkg/exec';

// API Helper Functions
export const apiGet = async (action, params = {}) => {
  const url = new URL(API_BASE_URL);
  url.searchParams.append('action', action);
  
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  
  const response = await fetch(url.toString());
  return response.json();
};

export const apiPost = async (action, data) => {
  const url = new URL(API_BASE_URL);
  url.searchParams.append('action', action);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  return response.json();
};
