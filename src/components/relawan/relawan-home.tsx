import * as React from 'react';

import { Image, Text, View } from '@/ui';
import { Pencil, Trash } from '@/ui/icons';

type Props = {
  text: string;
  subText: string;
  profil: string;
};
const images: { [key: string]: any } = {
  'icon.png': require('../../../assets/icon.png'),
};

export const RelawanHome = ({ text, subText, profil }: Props) => {
  const maxLength = 40;
  const truncatedText =
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  const truncatedSubText =
    subText.length > maxLength
      ? `${subText.substring(0, maxLength)}...`
      : subText;

  return (
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-row items-center">
        <Image
          className="h-12 w-12"
          contentFit="cover"
          source={images[profil] || require('../../../assets/icon.png')}
        />
        <View className="flex-col pl-3">
          <Text className="text-sm">{truncatedText}</Text>
          <Text className="text-sm">{truncatedSubText}</Text>
          <Text className="text-sm">{truncatedSubText}</Text>
        </View>
      </View>
      <View className="flex-row space-x-2">
        <Pencil />
        <Trash />
      </View>
    </View>
  );
};
