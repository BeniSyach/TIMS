import { Link } from 'expo-router';
import React from 'react';

import type { Timses } from '@/api';
import { Pressable, Text, View } from '@/ui';

type Props = Timses;

export const CardDetailHomeTimses = ({ name, total_pendukung, nik }: Props) => {
  return (
    <Link href={`timses/pendukung/${nik}`} asChild>
      <Pressable>
        <View className="m-2 h-24 w-[180px] justify-center rounded-lg bg-white p-4 shadow-lg">
          <Text className="text-center dark:text-black">{total_pendukung}</Text>
          <Text className="mt-2 text-center text-lg font-bold dark:text-black">
            {name}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};
