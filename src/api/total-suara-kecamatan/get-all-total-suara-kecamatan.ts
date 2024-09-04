import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { TotalSuaraKecamatan } from './types';

type ApiResponse = TotalSuaraKecamatan[];
type Variables = { page: number; limit: number };

export const getTotalSuaraKecamatan = createQuery<
  ApiResponse,
  Variables,
  AxiosError
>({
  queryKey: ['TotalSuaraKecamatan'],
  fetcher: async () => {
    try {
      console.log('url', '/api/v1/timses/dashboard/suara-per-kecamatan');
      const response = await client.post<ApiResponse>(
        `/api/v1/timses/dashboard/suara-per-kecamatan`
      );
      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching kecamatan data:', error);
      throw error;
    }
  },
});
