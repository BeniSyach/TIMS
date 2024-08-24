import { Link } from 'expo-router';
import * as React from 'react';

import { Image, Pressable, Text, View } from '@/ui';
import { Pencil, Trash } from '@/ui/icons';

type Props = {
  text: string;
  subText: number;
  profil: string;
  id: string;
};
const images: { [key: string]: any } = {
  'icon.png': require('../../../assets/icon.png'),
};

export const PendukungHome = ({ text, subText, profil, id }: Props) => {
  console.log('id', id);
  const maxLength = 40;
  const truncatedText =
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  // const truncatedSubText =
  //   subText.length > maxLength
  //     ? `${subText.substring(0, maxLength)}...`
  //     : subText;

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
          <Text className="text-sm">{subText}</Text>
          <Text className="text-sm">{profil}</Text>
        </View>
      </View>
      <View className="flex-row space-x-2">
        <Link href={`detail/${id}`} asChild>
          <Pressable>
            <Pencil className="mx-2" />
          </Pressable>
        </Link>
        <Trash />
      </View>
    </View>
  );
};
