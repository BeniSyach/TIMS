import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Pendukung } from './types';

type Response = { data: Pendukung };
type Variables = { id: string };

export const getDetailPendukung = createQuery<Response, Variables, AxiosError>({
  queryKey: ['detailPendukung'],
  fetcher: (variables) => {
    return client
      .post(`/api/v1/timses/pendukung/profile/${variables.id}`)
      .then((response) => response.data);
  },
});
