import { colorScheme } from 'nativewind';
import * as React from 'react';

import { Text, View } from '@/ui';
import { Users } from '@/ui/icons';

type Props = {
  text: string;
  subText: number;
  profil: string;
  id: string;
};

export const TimsesHome = ({ text, subText, profil, id }: Props) => {
  console.log('id', id);
  const maxLength = 40;
  const truncatedText =
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const currentScheme = colorScheme.get();
  const color = currentScheme === 'dark' ? '#FFF' : '#000';

  return (
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-row items-center">
        <Users color={color} />
        <View className="flex-col pl-3">
          <Text className="text-sm">{truncatedText}</Text>
          <Text className="text-sm">{subText}</Text>
          <Text className="text-sm">{profil}</Text>
        </View>
      </View>
      {/* <View className="flex-row space-x-2">
        <Link href={`detail/${id}`} asChild>
          <Pressable>
            <Pencil className="mx-2" />
          </Pressable>
        </Link>
        <Trash />
      </View> */}
    </View>
  );
};
