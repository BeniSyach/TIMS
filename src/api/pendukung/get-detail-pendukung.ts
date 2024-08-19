import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Pendukung } from './types';

type Response = Pendukung;
type Variables = { id: string }; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const getDetailPendukung = createQuery<Response, Variables, AxiosError>({
  queryKey: ['photos'],
  fetcher: (variables) => {
    return client
      .get(`photos/${variables.id}`)
      .then((response) => response.data);
  },
});
