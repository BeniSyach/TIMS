import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { getToken } from '../../core/auth/utils'; // Digunakan untuk mendapatkan tokenData
import { client } from '../common';
import type { Timses } from './types';

type Response = Timses;
type Variables = { timses_id: string }; // Masih perlu tipe untuk variabel

// Define the query function
const fetchDetailTimses = async (): Promise<Response> => {
  // Retrieve the token data (assuming it contains timses_id)
  const tokenData = await getToken();
  console.log('url', `/api/v1/timses/timses-mlm/profile/${tokenData.timsesId}`);

  // Use the client with the token already included
  return client
    .post(`/api/v1/timses/timses-mlm/profile/${tokenData.timsesId}`)
    .then((response) => response.data.data);
};

// Create the query with react-query-kit
export const getDetailTimses = createQuery<Response, Variables, AxiosError>({
  queryKey: ['DetailTimses'],
  fetcher: fetchDetailTimses,
});
