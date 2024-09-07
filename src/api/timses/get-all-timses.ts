import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Timses } from './types';

type Response = {
  data: Timses[];
};

type Variables = { page: number; limit: number, nama : string, nik : number | string };

export const getTimses = createQuery<Response, Variables, AxiosError>({
  queryKey: ['photos'],
  fetcher: async ({ page, limit, nama, nik }) => {
    let url;
    if(nama || nik){
      url = `/api/v1/timses/timses-mlm/list?name=${nama}&nik=${nik}`;
    }else{
      url = `/api/v1/timses/timses-mlm/list?page=${page}&limit=${limit}`;
    }
    console.log('url getTimses', url);
    // const response = await client.post(url);
    return client.post(url).then((response) => response.data);
  },
});
