import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { kecamatan } from './types';

type Variables = void; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

interface ApiResponse {
  data: kecamatan[];
  message: string;
  status: string;
  total: number;
}

export const getAllKecamatan = createQuery<ApiResponse, Variables, AxiosError>({
  queryKey: ['kecamatan'],
  fetcher: async () => {
    try {
      console.log('url', '/api/v1/timses/wilayah/kecamatan');
      const response = await client.post<ApiResponse>(
        `/api/v1/timses/wilayah/kecamatan`
      );
      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching kecamatan data:', error);
      throw error;
    }
  },
});
