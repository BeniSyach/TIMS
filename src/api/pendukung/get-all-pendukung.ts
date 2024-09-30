import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Pendukung } from './types';

type Response = {
  data: Pendukung[];
};

type Variables = { page: number; limit: number, name: string, nik: number | string };

export const getPendukung = createQuery<Response, Variables, AxiosError>({
  queryKey: ['pendukungList'], // Static query key, remove the function
  fetcher: async ({ page, limit, name, nik }) => {
    let url;
    if(name || nik){
      url = `/api/v1/timses/pendukung/list?name=${name}&nik=${nik}`;
    }else{
      url = `/api/v1/timses/pendukung/list?page=${page}&limit=${limit}`;
    }
    console.log('url getPendukung', url);
    // const response = await client.post(url);
    return client.post(url).then((response) => response.data);
  },
});
