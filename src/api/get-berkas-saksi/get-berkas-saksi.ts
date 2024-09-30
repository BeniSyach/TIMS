import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { clientSaksi } from '../common';
import type { BerkasSaksi } from './types';

type Variables = { kecamatan: string; desa: string };

interface ApiResponse {
  data: BerkasSaksi[];
  message: string;
  status: string;
}

export const getBerkasSaksi = createQuery<
  ApiResponse,
  Variables,
  AxiosError
>({
  queryKey: ['pendukungDesa'],
  fetcher: async (variables) => {
    try {
       const response = await clientSaksi.post<ApiResponse>(
          `/api/v1/saksi/dokumen`
        );
      return response.data;
    } catch (error) {
      console.error('Error fetching get berkas saksi data:', error);
      throw error;
    }
  },
});
