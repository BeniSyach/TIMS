import { Env } from '@env';
import { Stack } from 'expo-router';
import * as React from 'react';
import type { PendukungFormProps } from '@/components/timses/post-form';
import { Button, Modal, ScrollView, Text, useModal, View } from '@/ui';

import { getToken } from '../../core/auth/utils';
import { PostSaksi } from '@/components/saksi/post-form-saksi';

export default function AddPostSaksi() {

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
          title: 'Tambah Hasil Suara TPS',
          headerBackTitle: 'Tambah Hasil Suara TPS',
        }}
      />
      <ScrollView className="flex-1 p-4">
        <PostSaksi onSubmit={onSubmit} loading={loading} />
      </ScrollView>
      <Modal
        ref={ref}
        snapPoints={['40%']}
        title="Error Saksi"
        onDismiss={dismiss}
      >
        <View style={{ padding: 20 }}>
          <Text className="text-center dark:text-black">{error}</Text>
          <Button label="Tutup" variant="blue" onPress={dismiss} />
        </View>
      </Modal>
    </>
  );
}