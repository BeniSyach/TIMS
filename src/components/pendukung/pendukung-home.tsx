import { Env } from '@env';
import { Link } from 'expo-router';
import { colorScheme } from 'nativewind';
import * as React from 'react';
import { Alert } from 'react-native';

import { getToken } from '@/core/auth/utils';
import { Button, Modal, Pressable, Text, useModal, View } from '@/ui';
import { Pencil, Trash, Users } from '@/ui/icons';
import { AddTimses } from '@/ui/icons/add-timses';

type Props = {
  text: string;
  subText: number;
  profil: string;
  id: string;
  aktif: boolean;
  hp: string;
  kecamatan: string;
  desa: string;
  address: string;
};

export const PendukungHome = ({ text, subText, profil, id, aktif, hp, kecamatan, desa, address }: Props) => {
  const { ref, present, dismiss } = useModal();
  console.log('id', id);
  const maxLength = 40;
  const truncatedText =
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const currentScheme = colorScheme.get();
  const color = currentScheme === 'dark' ? '#FFF' : '#000';

  const PendukungMenjadiTimses = async (nama: string, nik: number, tps: string, no_hp: string, kec: string, des: string, alamat: string) => {
    dismiss();
    console.log('nama', nama);
    console.log('alamat', alamat);
    const token = await getToken();
    if (!token?.access) {
      console.error('Token is invalid or missing');
      Alert.alert('Error', 'Token is invalid or missing');
      return;
    }
    console.log('token', token.access);
    try {
      const response = await fetch(
        `${Env.API_URL}/api/v1/timses/timses-mlm/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
          body: JSON.stringify({
            nik: nik.toString(),
            name:nama,
            phone: no_hp,
            email: `${no_hp}@adil.com`,
            password:`masuk123`,
            kabupaten: `1207`,
            kecamatan:kec,
            desa: des,
            address: alamat,
            tps: tps
          }),
        }
      );

      const result = await response.json();
      console.log('data response', result);
      if (response.ok) {
        console.log('berhasil kirim data');
        Alert.alert('Sukses', 'Data Pendukung berhasil Menjadi Timses');
      } else {
        Alert.alert(
          'Gagal',
          `Gagal Menjadikan Pendukung Ke Timses: ${result.message}`
        );
      }
    } catch (error) {
      console.error('Error Menjadikan Pendukung Ke Timses:', error);
      Alert.alert(
        'Error',
        'Terjadi kesalahan Menjadikan Pendukung Ke Timses'
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
      <View className="flex-row space-x-2">
        <Link href={`detail/${id}`} asChild>
          <Pressable>
            <Pencil className="mx-2" color={color} />
          </Pressable>
        </Link>
        <AddTimses color={color} onPress={() => present()} />
      </View>
      <Modal
        ref={ref}
        snapPoints={['40%']}
        title="Pendukung Menjadi Timses"
        onDismiss={dismiss}
      >
        <View style={{ padding: 20 }}>
          <Text className="text-center dark:text-black">
            Apakah Anda Yakin Menjadikan Timses Pendukung Ini ?
          </Text>
          <Button
            label="Ya"
            variant="blue"
            onPress={() => PendukungMenjadiTimses(text, subText, profil, hp, kecamatan, desa, address )}
          />
          <Button label="Tutup" variant="secondary" onPress={dismiss} />
        </View>
      </Modal>
    </View>
  );
};
