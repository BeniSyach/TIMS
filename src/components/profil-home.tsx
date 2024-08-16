import * as React from 'react';

import { Image, Text, View } from '@/ui';

type Props = {
  text: string;
  subText: string;
  profil: string;
};
const images: { [key: string]: any } = {
  'icon.png': require('../../assets/icon.png'),
};

export const ProfilHome = ({ text, subText, profil }: Props) => {
  return (
    <View className="flex-row items-center py-1">
      <Image
        className="h-12 w-12"
        contentFit="cover"
        source={images[profil] || require('../../assets/icon.png')}
      />
      <View className="flex-col pl-4">
        <Text className="text-xl font-bold">{text}</Text>
        <Text className="text font-bold">{subText}</Text>
      </View>
    </View>
  );
};
