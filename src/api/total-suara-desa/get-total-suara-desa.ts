import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { TotalSuaraDesa } from './types';

type ApiResponse = TotalSuaraDesa[];
type Variables = { id: string };

export const getTotalSuaraDesa = createQuery<
  ApiResponse,
  Variables,
  AxiosError
>({
  queryKey: ['TotalSuaraDesa'],
  fetcher: async (variables) => {
    try {
      console.log(
        'url',
        `/api/v1/timses/dashboard/suara-per-desa-by-kecamatan/${variables.id}`
      );
      const response = await client.post<ApiResponse>(
        `/api/v1/timses/dashboard/suara-per-desa-by-kecamatan/${variables.id}`
      );
      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching kecamatan data:', error);
      throw error;
    }
  },
});
