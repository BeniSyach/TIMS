import { Env } from '@env';
import axios from 'axios';

import { getToken } from '../../core/auth/utils';
export const clientSaksi = axios.create({
  baseURL: Env.API_URL_SAKSI,
});

clientSaksi.interceptors.request.use(
  async (config) => {
    // Retrieve the token from storage
    const tokenData = await getToken();
    if (tokenData?.access) {
      config.headers.Authorization = `Bearer ${tokenData.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses and errors (optional)
clientSaksi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response errors if needed
    return Promise.reject(error);
  }
);
