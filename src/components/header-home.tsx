import * as React from 'react';

import { Image, Text, View } from '@/ui';

type Props = {
  text: string;
  subText: string;
};
export const HeaderHome = ({ text, subText }: Props) => {
  return (
    <View className="flex-row items-center py-4 pb-2">
      <Image
        className="h-12 w-12"
        contentFit="cover"
        source={require('../../assets/icon.png')}
      />
      <View className="flex-col pl-4">
        <Text className="text-xl font-bold">{text}</Text>
        <Text className="text font-bold">{subText}</Text>
      </View>
      <View className="ml-4 h-[2px] flex-1 bg-neutral-300" />
    </View>
  );
};