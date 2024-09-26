import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { PendukungTimses } from './types';

type Response = {
  data: PendukungTimses[];
};

type Variables = { nik: number; page: number; limit: number, nikPendukung: number | string, name: string };

export const getPendukungTimses = createQuery<Response, Variables, AxiosError>({
  queryKey: ['PendukungTimses'], // Static query key, remove the function
  fetcher: async ({ nik, page, limit, nikPendukung, name }) => {
    let url;
    if(nikPendukung || name){
      url = `/api/v1/timses/pendukung/list-by-timses/${nik}?name=${name}&nik=${nikPendukung}`;
      console.log('url getPendukung', url);
    }else{
      url = `/api/v1/timses/pendukung/list-by-timses/${nik}?page=${page}&limit=${limit}`;
      console.log('url getPendukung', url);
    }
    return client.post(url).then((response) => response.data);
  },
});
