import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { pendukungDesa } from './types';

type Variables = { id: string; tps: string };

interface ApiResponse {
  data: pendukungDesa[];
  message: string;
  status: string;
}

export const getAllPendukungDesa = createQuery<
  ApiResponse,
  Variables,
  AxiosError
>({
  queryKey: ['pendukungDesa'],
  fetcher: async (variables) => {
    try {
      console.log(
        'url',
        `/api/v1/timses/tps/get-total-pendukung-by-tps/${variables.id}/${variables.tps}`
      );
      const response = await client.post<ApiResponse>(
        `/api/v1/timses/tps/get-total-pendukung-by-tps/${variables.id}/${variables.tps}`
      );
      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching Pendukung Desa data:', error);
      throw error;
    }
  },
});
