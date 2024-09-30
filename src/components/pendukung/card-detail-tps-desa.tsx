import { Env } from '@env';
import { colorScheme } from 'nativewind';
import * as React from 'react';
import { Alert } from 'react-native';

import { getToken } from '@/core/auth/utils';
import {  Text, useModal, View } from '@/ui';
import {  Users } from '@/ui/icons';

type Props = {
  text: string;
  subText: number;
  profil: string;
  id: string;
  aktif: boolean;
};

export const CardDetailTPSDesa = ({ text, subText, profil, id, aktif }: Props) => {
  const { ref, present, dismiss } = useModal();
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
          <Text className="text-sm text-black dark:text-white">
            {truncatedText}
          </Text>
          <Text className="text-sm text-black dark:text-white">{subText}</Text>
          <Text className="text-sm text-black dark:text-white">
            TPS {profil}
          </Text>
          <Text className="text-sm text-black dark:text-white">
            {aktif ? 'Aktif' : 'Tidak Aktif'}
          </Text>
        </View>
      </View>
    </View>
  );
};
