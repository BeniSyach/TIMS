import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { getToken } from '../../core/auth/utils'; // Digunakan untuk mendapatkan tokenData
import { client, clientSaksi } from '../common';
import type { Timses } from './types';
import { useAuth } from '@/core';
import { clientBupati } from '../common/client-bupati';

type Response = Timses;
type Variables = { timses_id: string }; // Masih perlu tipe untuk variabel

// Define the query function
const fetchDetailTimses = async (): Promise<Response> => {
  // Retrieve the token data (assuming it contains timses_id)
  const tokenData = await getToken();
 
  if(tokenData?.role === 'Saksi'){
    console.log('url', `/api/v1/saksi/profil`);
    return clientSaksi
    .post(`/api/v1/saksi/profil`)
    .then((response) => response.data.data);
  }else if(tokenData?.role === 'Bupati'){
    console.log('url', `/api/v1/bupati/user-bupati/profile`);
    return clientBupati
    .post(`/api/v1/bupati/user-bupati/profile`)
    .then((response) => response.data.data);
  }else{
    console.log('url', `/api/v1/timses/timses-mlm/profile/${tokenData.timsesId}`);
    return client
    .post(`/api/v1/timses/timses-mlm/profile/${tokenData.timsesId}`)
    .then((response) => response.data.data);
  }
  // Use the client with the token already included

};

// Create the query with react-query-kit
export const getDetailTimses = createQuery<Response, Variables, AxiosError>({
  queryKey: ['DetailTimses'],
  fetcher: fetchDetailTimses,
});
