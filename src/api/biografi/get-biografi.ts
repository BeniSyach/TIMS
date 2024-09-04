import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';
import { client } from '../common';
import type { DataBiografi } from './types';

type Response = DataBiografi;

type Variables = void; 

export const getDataBiografi = createQuery<Response, Variables, AxiosError>({
  queryKey: ['Biografi'],
  fetcher: () => {
    return client
      .post(`/api/v1/timses/biografi/list`)
      .then((response) => {
        // Return the first item or null if the array is empty
        return response.data.data?.[0] ?? null;
      });
  },
});
