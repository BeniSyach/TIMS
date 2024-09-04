import { Link } from 'expo-router';
import React from 'react';

import type { TotalSuaraDesa } from '@/api/total-suara-desa';
import { Pressable, Text, View } from '@/ui';

type Props = TotalSuaraDesa;

export const CardDesaComponent = ({
  nama_desa,
  id_desa,
  total_pendukung,
}: Props) => {
  return (
    <Link href={`relawan/tps/${id_desa}`} asChild>
      <Pressable>
        <View className="m-2 rounded-lg bg-white p-4 shadow-lg">
          <Text>{total_pendukung}</Text>
          <Text className="mt-2 text-lg font-bold">{nama_desa}</Text>
        </View>
      </Pressable>
    </Link>
  );
};
