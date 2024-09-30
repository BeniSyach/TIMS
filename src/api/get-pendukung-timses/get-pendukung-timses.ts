import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { PendukungTimses } from './types';
import { getToken } from '@/core/auth/utils';
import { clientBupati } from '../common/client-bupati';

type Response = {
  data: PendukungTimses[];
};

type Variables = { nik: number; page: number; limit: number, nikPendukung: number | string, name: string };

export const getPendukungTimses = createQuery<Response, Variables, AxiosError>({
  queryKey: ['PendukungTimses'], // Static query key, remove the function
  fetcher: async ({ nik, page, limit, nikPendukung, name }) => {
    const token = getToken();
    let url;
    if(token.role == 'Bupati'){
      if(nikPendukung || name){
        url = `/api/v1/timses/pendukung/list-by-timses/${nik}?name=${name}&nik=${nikPendukung}`;
        console.log('url getPendukung', url);
      }else{
        url = `/api/v1/timses/pendukung/list-by-timses/${nik}?page=${page}&limit=${limit}`;
        console.log('url getPendukung', url);
      }
      return clientBupati.post(url).then((response) => response.data);
    }else{
      if(nikPendukung || name){
        url = `/api/v1/timses/pendukung/list-by-timses/${nik}?name=${name}&nik=${nikPendukung}`;
        console.log('url getPendukung', url);
      }else{
        url = `/api/v1/timses/pendukung/list-by-timses/${nik}?page=${page}&limit=${limit}`;
        console.log('url getPendukung', url);
      }
      return client.post(url).then((response) => response.data);
    }
  },
});
