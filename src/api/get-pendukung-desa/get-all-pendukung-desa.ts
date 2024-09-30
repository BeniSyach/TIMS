import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { pendukungDesa } from './types';
import { getToken } from '@/core/auth/utils';
import { clientBupati } from '../common/client-bupati';

type Variables = { id: string; tps: string, page: number; limit: number, nik: number | string, name: string };

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
    const token = getToken();
    console.log('segemn', token.role);
    try {
      let response
      if(token.role === 'Bupati'){
        if(variables.nik || variables.name){
          console.log(
            'url',
            `/api/v1/bupati/tps-total/get-total-pendukung-by-tps/${variables.id}/${variables.tps}?page=${variables.page}&limit=${variables.limit}`
          );
          response = await clientBupati.post<ApiResponse>(
            `/api/v1/bupati/tps-total/get-total-pendukung-by-tps/${variables.id}/${variables.tps}?name=${variables.name}&nik=${variables.nik}`
          );
        }else{
          console.log(
            'url',
            `/api/v1/bupati/tps-total/get-total-pendukung-by-tps/${variables.id}/${variables.tps}?page=${variables.page}&limit=${variables.limit}`
          );
          response = await clientBupati.post<ApiResponse>(
            `/api/v1/bupati/tps-total/get-total-pendukung-by-tps/${variables.id}/${variables.tps}?page=${variables.page}&limit=${variables.limit}`
          );
        }
      }else{
        if(variables.nik || variables.name){
          console.log(
            'url',
            `/api/v1/timses/tps/get-total-pendukung-by-tps/${variables.id}/${variables.tps}?page=${variables.page}&limit=${variables.limit}`
          );
          response = await client.post<ApiResponse>(
            `/api/v1/timses/tps/get-total-pendukung-by-tps/${variables.id}/${variables.tps}?name=${variables.name}&nik=${variables.nik}`
          );
        }else{
          console.log(
            'url',
            `/api/v1/timses/tps/get-total-pendukung-by-tps/${variables.id}/${variables.tps}?page=${variables.page}&limit=${variables.limit}`
          );
          response = await client.post<ApiResponse>(
            `/api/v1/timses/tps/get-total-pendukung-by-tps/${variables.id}/${variables.tps}?page=${variables.page}&limit=${variables.limit}`
          );
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching Pendukung Desa data:', error);
      throw error;
    }
  },
});
