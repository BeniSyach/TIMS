import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Timses } from './types';
import { getToken } from '@/core/auth/utils';
import { clientBupati } from '../common/client-bupati';

type Response = {
  data: Timses[];
};

type Variables = { page: number; limit: number, nama : string, nik : number | string };

export const getTimses = createQuery<Response, Variables, AxiosError>({
  queryKey: ['TotalTimses'],
  fetcher: async ({ page, limit, nama, nik }) => {
    const tokenData = await getToken();
    let url;
    if(tokenData.role == 'Bupati'){
      url = `/api/v1/bupati/timses/list?name=${nama}&nik=${nik}`;
      return clientBupati.post(url).then((response) => response.data);
    }else{
      if(nama || nik){
        url = `/api/v1/timses/timses-mlm/list?name=${nama}&nik=${nik}`;
      }else{
        url = `/api/v1/timses/timses-mlm/list?page=${page}&limit=${limit}`;
      }
      console.log('url getTimses', url);
      // const response = await client.post(url);
      return client.post(url).then((response) => response.data);
    }

  },
});
