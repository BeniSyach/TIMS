import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { TotalSuaraKecamatan } from './types';
import { useAuth } from '@/core';
import { getToken } from '@/core/auth/utils';
import { clientBupati } from '../common/client-bupati';

type ApiResponse = TotalSuaraKecamatan[];
type Variables = { page: number; limit: number };

export const getTotalSuaraKecamatan = createQuery<
  ApiResponse,
  Variables,
  AxiosError
>({
  queryKey: ['TotalSuaraKecamatan'],
  fetcher: async () => {
    const token = await getToken();
    let response;
    if(token.role == 'Bupati'){
      console.log('url', '/api/v1/bupati/dashboard/suara-per-kecamatan');
      response = await clientBupati.post<ApiResponse>(
       `/api/v1/bupati/dashboard/suara-per-kecamatan`
     );
    }else{
      console.log('url', '/api/v1/timses/dashboard/suara-per-kecamatan');
       response = await client.post<ApiResponse>(
        `/api/v1/timses/dashboard/suara-per-kecamatan`
      );
    }
    try {

      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching kecamatan data:', error);
      throw error;
    }
  },
});
