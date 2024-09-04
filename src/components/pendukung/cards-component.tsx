import { Link } from 'expo-router';
import React from 'react';

import type { TotalSuaraKecamatan } from '@/api/total-suara-kecamatan';
import { Pressable, Text, View } from '@/ui';

type Props = TotalSuaraKecamatan;

export const CardComponent = ({
  nama_kecamatan,
  id_kecamatan,
  total_pendukung,
}: Props) => {
  return (
    <Link href={`relawan/desa/${id_kecamatan}`} asChild>
      <Pressable>
        <View className="m-2 rounded-lg bg-white p-4 shadow-lg">
          <Text>{total_pendukung}</Text>
          <Text className="mt-2 text-lg font-bold">{nama_kecamatan}</Text>
        </View>
      </Pressable>
    </Link>
  );
};
