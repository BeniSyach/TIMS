import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { getTpsDesa } from './types';

type Variables = { id: string };

interface ApiResponse {
  data: getTpsDesa[];
  message: string;
  status: string;
}

export const getAllTpsDesa = createQuery<ApiResponse, Variables, AxiosError>({
  queryKey: ['getTPSDesa'],
  fetcher: async (variables) => {
    const idKec = variables.id.substring(0, 6);
    try {
      console.log(
        'url',
        `/api/v1/timses/tps/get-total-pendukung-by-kec-desa/${idKec}/${variables.id}`
      );
      const response = await client.post<ApiResponse>(
        `/api/v1/timses/tps/get-total-pendukung-by-kec-desa/${idKec}/${variables.id}`
      );
      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching tps desa data:', error);
      throw error;
    }
  },
});
