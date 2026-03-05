import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_BASE_URL = 'https://musica.ibbla.eu/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Token management via Keychain
export async function getToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: 'auth_token' });
    return credentials ? credentials.password : null;
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  await Keychain.setGenericPassword('auth', token, { service: 'auth_token' });
}

export async function removeToken(): Promise<void> {
  await Keychain.resetGenericPassword({ service: 'auth_token' });
}

// Request interceptor: inject token
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export default api;
