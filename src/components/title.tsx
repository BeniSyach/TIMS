import * as React from 'react';

import { Text, View } from '@/ui';

type Props = {
  text: string;
};
export const Title = ({ text }: Props) => {
  return (
    <View className="flex-row items-center justify-center pb-2">
      <Text className="pr-2 text-2xl font-bold">{text}</Text>
      <View className="h-[2px] flex-1 bg-neutral-300" />
    </View>
  );
};
