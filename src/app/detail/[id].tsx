import { Env } from '@env';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { getDetailPendukung } from '@/api';
import type { PendukungFormProps } from '@/components/pendukung/edit-pendukung';
import { EditPendukung } from '@/components/pendukung/edit-pendukung';
import { getToken } from '@/core/auth/utils';
import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
  Modal,
  ScrollView,
  Text,
  useModal,
  View,
} from '@/ui';

export default function PendukungDetail() {
  const local = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = React.useState(false);
  const { ref, present, dismiss } = useModal();
  const [error, setError] = React.useState<string | null>(null);
  const { data, isPending, isError } = getDetailPendukung({
    //@ts-ignore
    variables: { id: local.id },
  });

  const onSubmit: PendukungFormProps['onSubmit'] = async (Fromdata) => {
    console.log('data edit Pendukung', Fromdata);
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
    console.log('id data pendukung', data.data.pendukung_id);
    try {
      const response = await fetch(
        `${Env.API_URL}/api/v1/timses/pendukung/update/${data.data.pendukung_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
          body: JSON.stringify({
            nik: Number(Fromdata.nik),
            name: Fromdata.name,
            phone: Fromdata.phone,
            email: Fromdata.email,
            password: 'masuk123',
            kabupaten: '1207',
            kecamatan: Fromdata.kecamatan,
            desa: Fromdata.desa,
            address: Fromdata.address,
            tps: Fromdata.tps,
          }),
        }
      );

      const result = await response.json();
      console.log('data response', result);
      if (response.ok) {
        console.log('berhasil kirim data');
        setError('Berhasil Edit Data Pendukung');
        present();
      } else {
        console.error('Tambah Data Pendukung failed:', result.message);
        setError(result.message);
        present();
      }
    } catch (error) {
      console.error('Error during Edit Data Pendukung:', error);
      setError('Gagal Edit Data Pendukung');
      present();
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <View className="flex-1 justify-center  p-3">
        <Stack.Screen
          options={{
            title: 'Edit Pendukung',
            headerBackTitle: 'Edit Pendukung',
          }}
        />
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <Stack.Screen
          options={{
            title: 'Edit Pendukung',
            headerBackTitle: 'Edit Pendukung',
          }}
        />
        <FocusAwareStatusBar />
        <Text className="text-center">Error loading Detail Pendukung</Text>
      </View>
    );
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Data Pendukung',
          headerBackTitle: 'Edit Data Pendukung',
        }}
      />
      <ScrollView className="flex-1 p-4">
        <EditPendukung onSubmit={onSubmit} loading={loading} data={data.data} />
      </ScrollView>
      <Modal
        ref={ref}
        snapPoints={['40%']}
        title="Login Error"
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
