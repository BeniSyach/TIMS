import { Env } from '@env';
import { colorScheme } from 'nativewind';
import * as React from 'react';
import { Alert } from 'react-native';

import { getToken } from '@/core/auth/utils';
import {  Text, useModal, View } from '@/ui';
import {  Users } from '@/ui/icons';

type Props = {
  text: string;
  subText: number;
  profil: string;
  id: string;
  aktif: boolean;
};

export const CardDetailTPSDesa = ({ text, subText, profil, id, aktif }: Props) => {
  const { ref, present, dismiss } = useModal();
  console.log('id', id);
  const maxLength = 40;
  const truncatedText =
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const currentScheme = colorScheme.get();
  const color = currentScheme === 'dark' ? '#FFF' : '#000';

  const hapusDataPendukung = async (id: string) => {
    dismiss();
    console.log('id', id);
    const token = await getToken();
    if (!token?.access) {
      console.error('Token is invalid or missing');
      Alert.alert('Error', 'Token is invalid or missing');
      return;
    }
    console.log('token', token.access);
    try {
      const response = await fetch(
        `${Env.API_URL}/api/v1/timses/pendukung/update/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
          body: JSON.stringify({
            aktif: false,
          }),
        }
      );

      const result = await response.json();
      console.log('data response', result);
      if (response.ok) {
        console.log('berhasil kirim data');
        Alert.alert('Sukses', 'Data Pendukung berhasil dinonaktifkan');
      } else {
        console.error('Tambah Data Pendukung failed:', result.message);
        Alert.alert(
          'Gagal',
          `Gagal menonaktifkan data Pendukung: ${result.message}`
        );
      }
    } catch (error) {
      console.error('Error during Edit Data Pendukung:', error);
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat Menonaktifkan data Pendukung'
      );
    }
  };

  return (
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-row items-center">
        <Users color={color} />
        <View className="flex-col pl-3">
          <Text className="text-sm text-black dark:text-white">
            {truncatedText}
          </Text>
          <Text className="text-sm text-black dark:text-white">{subText}</Text>
          <Text className="text-sm text-black dark:text-white">
            TPS {profil}
          </Text>
          <Text className="text-sm text-black dark:text-white">
            {aktif ? 'Aktif' : 'Tidak Aktif'}
          </Text>
        </View>
      </View>
    </View>
  );
};
