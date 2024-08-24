import { Link } from 'expo-router';
import React from 'react';

import type { Timses } from '@/api';
import { Image, Pressable, Text, View } from '@/ui';

type Props = Timses;

export const CardDetailHomeTimses = ({ name, timses_id }: Props) => {
  return (
    <Link href={`relawan/desa/${timses_id}`} asChild>
      <Pressable>
        <View className="m-2 rounded-lg bg-white p-4 shadow-lg">
          <Image source={{ uri: timses_id }} className="h-32 w-full rounded-lg" />
          <Text className="mt-2 text-lg font-bold">{name}</Text>
        </View>
      </Pressable>
    </Link>
  );
};