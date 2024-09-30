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
        <View className="m-2 w-[180px] rounded-lg bg-white p-4 shadow-lg">
          <Text className="text-center text-black dark:text-black">
            {total_pendukung}
          </Text>
          <Text className="mt-2 text-center text-lg font-bold text-black dark:text-black">
            {nama_desa}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};
