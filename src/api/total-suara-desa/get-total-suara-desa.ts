import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { TotalSuaraDesa } from './types';
import { getToken } from '@/core/auth/utils';
import { clientBupati } from '../common/client-bupati';

type ApiResponse = TotalSuaraDesa[];
type Variables = { id: string };

export const getTotalSuaraDesa = createQuery<
  ApiResponse,
  Variables,
  AxiosError
>({
  queryKey: ['TotalSuaraDesa'],
  fetcher: async (variables) => {
    const Token = getToken();
    let response;
    try {
      if(Token.role === 'Bupati'){
        console.log(
          'url',
          `/api/v1/bupati/dashboard/suara-per-desa-by-kecamatan/${variables.id}`
        );
         response = await clientBupati.post<ApiResponse>(
          `/api/v1/bupati/dashboard/suara-per-desa-by-kecamatan/${variables.id}`
        );
      }else{
        console.log(
          'url',
          `/api/v1/timses/dashboard/suara-per-desa-by-kecamatan/${variables.id}`
        );
         response = await client.post<ApiResponse>(
          `/api/v1/timses/dashboard/suara-per-desa-by-kecamatan/${variables.id}`
        );
      }

      return response.data; // Mengambil data dari respons
    } catch (error) {
      console.error('Error fetching kecamatan data:', error);
      throw error;
    }
  },
});
