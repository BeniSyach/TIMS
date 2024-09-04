import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { desa } from './types';

interface ApiResponse {
  data: desa[];
  message: string;
  status: string;
  total: number;
}
type Variables = { id: string }; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const getAllDesa = createQuery<ApiResponse, Variables, AxiosError>({
  queryKey: ['desa'],
  fetcher: async (variables) => {
    try {
      console.log('url', `/api/v1/timses/wilayah/desa/${variables.id}`);
      const response = await client.post<ApiResponse>(
        `/api/v1/timses/wilayah/desa/${variables.id}`
      );
      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching kecamatan data:', error);
      throw error;
    }
  },
});
