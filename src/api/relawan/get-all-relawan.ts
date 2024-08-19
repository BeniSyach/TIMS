import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Relawan } from './types';

type Response = Relawan[];
type Variables = { id: string }; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const getRelawan = createQuery<Response, Variables, AxiosError>({
  queryKey: ['photos'],
  fetcher: () => {
    return client.get(`photos?_limit=30`).then((response) => response.data);
  },
});
