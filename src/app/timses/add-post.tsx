import { Env } from '@env';
import { Stack } from 'expo-router';
import * as React from 'react';

import type { PendukungFormProps } from '@/components/timses/post-form';
import { PostPendukung } from '@/components/timses/post-form';
import { Button, Modal, ScrollView, Text, useModal, View } from '@/ui';

import { getToken } from '../../core/auth/utils';

export default function AddPost() {
  const [loading, setLoading] = React.useState(false);
  const { ref, present, dismiss } = useModal();
  const [error, setError] = React.useState<string | null>(null);
  const onSubmit: PendukungFormProps['onSubmit'] = async (data) => {
    console.log('data login', data);
    setLoading(true);
    const token = await getToken();
    if (!token?.access) {
      console.error('Token is invalid or missing');
      setError('Gagal mendapatkan token. Silakan coba lagi.');
      present();
      setLoading(false);
      return;
    }

    console.log('token', token.access);
    try {
      const response = await fetch(
        `${Env.API_URL}/api/v1/timses/pendukung/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
          body: JSON.stringify({
            nik: data.nik,
            name: data.name,
            phone: data.phone,
            email: data.email,
            password: 'masuk123',
            kabupaten: '1207',
            kecamatan: data.kecamatan,
            desa: data.desa,
            address: data.address,
            tps: data.tps,
          }),
        }
      );

      const result = await response.json();
      console.log('data response', result);
      if (response.ok) {
        console.log('berhasil kirim data');
        setError('Berhasil Tambah Data Pendukung');
        present();
      } else {
        console.error('Tambah Data Pendukung failed:', result.message);
        setError(result.message);
        present();
      }
    } catch (error) {
      console.error('Error during Tambah Data Pendukung:', error);
      setError('Gagal Tambah Data Pendukung');
      present();
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tambah Data Pendukung',
          headerBackTitle: 'Tambah Data Pendukung',
        }}
      />
      <ScrollView className="flex-1 p-4">
        <PostPendukung onSubmit={onSubmit} loading={loading} />
      </ScrollView>
      <Modal
        ref={ref}
        snapPoints={['40%']}
        title="Login Error"
        onDismiss={dismiss}
      >
        <View style={{ padding: 20 }}>
          <Text className="text-center">{error}</Text>
          <Button label="Tutup" onPress={dismiss} />
        </View>
      </Modal>
    </>
  );
}
