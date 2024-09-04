import { Link } from 'expo-router';
import React from 'react';

import type { getTpsDesa } from '@/api/get-tps-desa';
import { Pressable, Text, View } from '@/ui';

type Props = getTpsDesa;

export const CardTpsDesa = ({ tps, desa_kode, total }: Props) => {
  const tpsValue = tps || 0;
  return (
    <Link href={`relawan/${desa_kode}/${tpsValue}`} asChild>
      <Pressable>
        <View className="m-2 rounded-lg bg-white p-4 shadow-lg">
          <Text>{total}</Text>
          <Text className="mt-2 text-lg font-bold">TPS {tpsValue}</Text>
        </View>
      </Pressable>
    </Link>
  );
};
