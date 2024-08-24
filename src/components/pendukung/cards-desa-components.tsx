import { Link } from 'expo-router';
import React from 'react';

import type { Pendukung } from '@/api';
import { Image, Pressable, Text, View } from '@/ui';

type Props = Pendukung;

export const CardDesaComponent = ({ title, url, id }: Props) => {
  return (
    <Link href={`relawan/detail/${id}`} asChild>
      <Pressable>
        <View className="m-2 rounded-lg bg-white p-4 shadow-lg">
          <Image source={{ uri: url }} className="h-32 w-full rounded-lg" />
          <Text className="mt-2 text-lg font-bold">{title}</Text>
        </View>
      </Pressable>
    </Link>
  );
};
