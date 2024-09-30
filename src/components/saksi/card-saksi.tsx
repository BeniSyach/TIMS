import { Link } from 'expo-router';
import React from 'react';
import { Button, Modal, Pressable, Text, useModal, View } from '@/ui';
import { BerkasSaksi } from '@/api/get-berkas-saksi';
import { EyeIcon, Feed, Pencil, Trash, Users } from '@/ui/icons';
import { colorScheme } from 'nativewind';
import { Alert } from 'react-native';
import { getToken } from '@/core/auth/utils';
import { Border } from '../border';

type Props = BerkasSaksi;

export const CardSaksiComponent = ({
  id,
  kecamatan,
  desa,
  tps,
  suara,
  nama_desa,
  nama_kecamatan,
  nama_tps
}: Props) => {
  const currentScheme = colorScheme.get();
  const color = currentScheme === 'dark' ? '#FFF' : '#000';
  
  return (
    <Border>
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-row items-center">
        <Feed color={color} />
        <View className="flex-col pl-3">
          <Text className="text-sm text-black dark:text-white">
            Kecamatan {nama_kecamatan}
          </Text>
          <Text className="text-sm text-black dark:text-white">Desa {nama_desa}</Text>
          <Text className="text-sm text-black dark:text-white">
            TPS {nama_tps}
          </Text>
          <Text className="text-sm text-black dark:text-white">
            Total Suara : {suara}
          </Text>
        </View>
      </View>
      <View className="flex-row space-x-2">
        <Link href={`saksi-app/edit/${id}?kecamatan=${kecamatan}&desa=${desa}&tps=${tps}&suara=${suara}`} asChild>
          <Pressable>
            <Pencil className="mx-2" color={color} />
          </Pressable>
        </Link>
        <Link href={`saksi-app/detail/${id}`} asChild>
          <Pressable>
            <EyeIcon color={color} />
          </Pressable>
        </Link>
      </View>
    </View>
    </Border>
  );
};