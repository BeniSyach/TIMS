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
        <View className="m-2 w-[180px] rounded-lg bg-white p-4 shadow-lg">
          <Text className="text-center text-black dark:text-black">
            {total}
          </Text>
          <Text className="mt-2 text-center text-lg font-bold text-black dark:text-black">
            TPS {tpsValue}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};
