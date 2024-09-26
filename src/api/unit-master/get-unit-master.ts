import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { UnitMaster } from './types';

type Variables = void;

interface ApiResponse {
  data: UnitMaster[];
  message: string;
  status: string;
}

export const getUnitMaster = createQuery<ApiResponse, Variables, AxiosError>({
  queryKey: ['UnitMaster'],
  fetcher: async () => {
    try {
      console.log('url', '/api/v1/timses/unit?page=1&limit=10');
      const response = await client.post<ApiResponse>(
        `/api/v1/timses/unit?page=1&limit=10`
      );
      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching Unit Master data:', error);
      throw error;
    }
  },
});
