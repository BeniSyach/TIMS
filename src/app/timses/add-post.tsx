import { Env } from '@env';
import { Stack } from 'expo-router';
import * as React from 'react';

import type { PendukungFormProps } from '@/components/timses/post-form';
import { PostPendukung } from '@/components/timses/post-form';
import { ScrollView } from '@/ui';

export default function AddPost() {
  const [loading, setLoading] = React.useState(false);
  const onSubmit: PendukungFormProps['onSubmit'] = async (data) => {
    console.log('data login', data);
    setLoading(true);
    try {
      const response = await fetch(`${Env.API_URL}/api/v1/timses/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.title,
          password: data.body,
        }),
      });

      const result = await response.json();
      console.log('data response', result);
      if (response.ok) {
        console.log('berhasil kirim data');
      } else {
        console.error('Login failed:', result.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tambah Data',
          headerBackTitle: 'Tambah Data Pendukung/Relawan',
        }}
      />
      <ScrollView className="flex-1 p-4">
        <PostPendukung onSubmit={onSubmit} loading={loading} />
      </ScrollView>
    </>
  );
}
