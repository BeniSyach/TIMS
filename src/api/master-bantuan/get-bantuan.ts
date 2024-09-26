import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { MasterBantuan } from './types';

type Variables = void;

interface ApiResponse {
  data: MasterBantuan[];
  message: string;
  status: string;
}

export const getMasterBantuan = createQuery<ApiResponse, Variables, AxiosError>({
  queryKey: ['MasterBantuan'],
  fetcher: async () => {
    try {
      console.log('url', '/api/v1/timses/bantuan?page=1&limit=10');
      const response = await client.post<ApiResponse>(
        `/api/v1/timses/bantuan?page=1&limit=10`
      );
      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching master bantuan data:', error);
      throw error;
    }
  },
});
