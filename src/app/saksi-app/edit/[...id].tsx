import { Env } from '@env';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Button, Modal, ScrollView, Text, useModal, View } from '@/ui';
import { SaksiFormProps } from '@/components/saksi/post-form-saksi';
import { getToken } from '@/core/auth/utils';
import { EditSaksi } from '@/components/saksi/edit-form-saksi';

export default function EditPostSaksi() {
  const local = useLocalSearchParams<{ id: string[], desa: string, kecamatan: string, suara : string, tps: string }>();
  const dataEdit = {
    id : local.id?.[0],
    desa : local.desa,
    kecamatan : local.kecamatan,
    suara : local.suara,
    tps : local.tps
  }
  console.log('data edit', local.id?.[0]);
  const [loading, setLoading] = React.useState(false);
  const { ref, present, dismiss } = useModal();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SaksiFormProps['onSubmit'] = async (data) => {
    console.log('data edit berkas', data);
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
    {data.bukti_photo && (
      formData.append('bukti_photo', {
        uri: data.bukti_photo,
        type: data.mimeType,
        name: data.name,
      } as any)
    )}

    try {
      const response = await fetch(
        `${Env.API_URL_SAKSI}/api/v1/saksi/dokumen/update/${local.id?.[0]}`,
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
        setError('Berhasil Update Data');
        present();
      } else {
        console.error('Update Data berkas saksi failed:', result.message);
        setError(result.message);
        present();
      }
    } catch (error) {
      console.error('Error during Update Data:', error);
      setError('Gagal Update Data');
      present();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Hasil Suara TPS',
          headerBackTitle: 'Edit Hasil Suara TPS',
        }}
      />
      <ScrollView className="flex-1 p-4">
        <EditSaksi onSubmit={onSubmit} loading={loading} dataBerkas={dataEdit}  />
      </ScrollView>
      <Modal
        ref={ref}
        snapPoints={['40%']}
        title="Update Berkas Saksi"
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
