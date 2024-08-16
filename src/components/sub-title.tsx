import * as React from 'react';

import { Text, View } from '@/ui';

type Props = {
  text: string;
};
export const SubTitle = ({ text }: Props) => {
  return (
    <View className="flex-row  py-1 pb-2">
      <Text className="pr-2 ">{text}</Text>
    </View>
  );
};
