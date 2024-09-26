import { Env } from '@env';
import { Stack } from 'expo-router';
import * as React from 'react';
import { Button, Modal, ScrollView, Text, useModal, View } from '@/ui';
import { getToken } from '../../core/auth/utils';
import { PostSaksi, SaksiFormProps } from '@/components/saksi/post-form-saksi';

export default function AddPostSaksi() {

  const [loading, setLoading] = React.useState(false);
  const { ref, present, dismiss } = useModal();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SaksiFormProps['onSubmit'] = async (data) => {
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
    const formData = new FormData();
    formData.append('tps', data.tps);
    formData.append('desa', data.desa);
    formData.append('kecamatan', data.kecamatan);
    formData.append('suara', data.suara);
    formData.append('bukti_photo', {
      uri: data.bukti_photo,
      type: data.mimeType,
      name: data.name,
    } as any);
    try {
      const response = await fetch(
        `${Env.API_URL_SAKSI}/api/v1/saksi/dokumen/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log('data response', result);
      if (response.ok) {
        console.log('berhasil kirim data');
        setError('Berhasil Tambah Data');
        present();
      } else {
        console.error('Tambah Data berkas saksi failed:', result.message);
        setError(result.message);
        present();
      }
    } catch (error) {
      console.error('Error during Tambah Data:', error);
      setError('Gagal Tambah Data');
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
        title="Error Tambah Berkas Saksi"
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
