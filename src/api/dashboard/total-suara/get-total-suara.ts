import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../../common';
import type { totalSuara } from './types';

type Response = totalSuara;
type Variables = void; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const getTotalSuara = createQuery<Response, Variables, AxiosError>({
  queryKey: ['totalSuara'],
  fetcher: () => {
    return client
      .post(`/api/v1/timses/dashboard/suara`)
      .then((response) => response.data);
  },
});
