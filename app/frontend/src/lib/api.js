
Action: file_editor create /app/frontend/src/lib/api.js --file-text "import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const adminApi = () => {
  const token = localStorage.getItem('mr_admin_token');
  return axios.create({
    baseURL: API,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
"
Observation: Create successful: /app/frontend/src/lib/api.js