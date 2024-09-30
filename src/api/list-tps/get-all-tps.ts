import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { DataTps } from './types';

type Variables = void;

interface ApiResponse {
  data: DataTps[];
  message: string;
  status: string;
}

export const getAllTps = createQuery<ApiResponse, Variables, AxiosError>({
  queryKey: ['DataAllTps'],
  fetcher: async () => {
    try {
      console.log('url', '/api/v1/timses/tps/list');
      const response = await client.post<ApiResponse>(
        `/api/v1/timses/tps/list`
      );
      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching TPS data:', error);
      throw error;
    }
  },
});
