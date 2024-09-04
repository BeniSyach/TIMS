import { Link } from 'expo-router';
import React from 'react';

import type { Timses } from '@/api';
import { Image, Pressable, Text, View } from '@/ui';

type Props = Timses;

export const CardDetailHomeTimses = ({ name, nik }: Props) => {

  return (
    <Link href={`timses/pendukung/${nik}`} asChild>
      <Pressable>
        <View className="m-2 rounded-lg bg-white p-4 shadow-lg">

          <Text className="mt-2 text-lg font-bold">{name}</Text>
        </View>
      </Pressable>
    </Link>
  );
};
