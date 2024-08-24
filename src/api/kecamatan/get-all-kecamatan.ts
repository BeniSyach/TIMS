import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { kecamatan } from './types';

type Response = kecamatan[];
type Variables = void; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const getAllKecamatan = createQuery<Response, Variables, AxiosError>({
  queryKey: ['kecamatan'],
  fetcher: () => {
    return client.get(`/api/v1/timses/wilayah/kecamatan`).then((response) => response.data.data);
  },
});
