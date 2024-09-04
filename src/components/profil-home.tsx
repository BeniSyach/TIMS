import * as React from 'react';

import { Image, Text, View } from '@/ui';

type Props = {
  text: string;
  subText: string;
  profil: string;
};
const images: { [key: string]: any } = {
  'icon.png': require('../../assets/icon.png'),
  'bupati.jpg': require('../../assets/bupati.jpg'),
  'wakilbupati.jpg': require('../../assets/wakilbupati.jpg'),
};

export const ProfilHome = ({ text, subText, profil }: Props) => {
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const imageSource =
    profil && isValidUrl(profil)
      ? { uri: profil }
      : images[profil] || images['icon.png'];

  return (
    <View className="flex-row items-center py-1">
      <Image
        className="h-20 w-12 rounded-lg"
        contentFit="cover"
        source={imageSource}
      />
      <View className="flex-col pl-3">
        <Text className="text-xl font-bold">{text}</Text>
        <Text className="text font-bold">{subText}</Text>
      </View>
    </View>
  );
};
