import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { desa } from './types';

type Response = desa[];
type Variables =  { id: string }; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const getAllDesa = createQuery<Response, Variables, AxiosError>({
  queryKey: ['desa'],
  fetcher: (variables) => {
    return client.get(`/api/v1/timses/wilayah/desa/${variables.id}`).then((response) => response.data.data);
  },
});
