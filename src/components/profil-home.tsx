import * as React from 'react';

import { Image, Text, View } from '@/ui';

type Props = {
  text: string;
  subText: string;
  profil: string;
  subJabatanBupText : string, 
  subJabatanWaText : string
};
const images: { [key: string]: any } = {
  'paslon.png': require('../../assets/paslon.png'),
  'icon.png': require('../../assets/icon.png'),
  'bupati.jpg': require('../../assets/bupati.jpg'),
  'wakilbupati.jpg': require('../../assets/wakilbupati.jpg'),
};

export const ProfilHome = ({ text, subText, profil, subJabatanBupText, subJabatanWaText }: Props) => {
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
    <View className="flex-col items-center py-1">
      <Image
        className="h-56 w-64"
        contentFit="cover"
        source={imageSource}
      />

        <Text className="text-sm font-bold text-center pt-3">{text} & {subText}</Text>
        <Text className="text-sm font-bold text-center">{subJabatanBupText} & {subJabatanWaText}</Text>
        {/* <Text className="text-lg font-bold">{text}</Text> */}

    </View>
  )
};
