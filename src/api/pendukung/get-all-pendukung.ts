import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Pendukung } from './types';

type Response = {
  data: Pendukung[];
};

type Variables = { page: number; limit: number };

export const getPendukung = createQuery<Response, Variables, AxiosError>({
  queryKey: ['pendukungList'], // Static query key, remove the function
  fetcher: async ({ page, limit }) => {
    const url = `/api/v1/timses/pendukung/list?page=${page}&limit=${limit}`;
    console.log('url getPendukung', url);
    // const response = await client.post(url);
    return client.post(url).then((response) => response.data);
  },
});