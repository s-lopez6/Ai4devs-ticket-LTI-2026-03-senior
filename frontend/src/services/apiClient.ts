import axios from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:3010';

function getApiBaseUrl(): string {
  const trimmed = process.env.REACT_APP_API_BASE_URL?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_API_BASE_URL;
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

