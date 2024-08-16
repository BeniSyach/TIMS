import React from 'react';

import { Text, View } from '@/ui';

export const Summary = () => {
  return (
    <>
      <View className="flex-row justify-between pt-4">
        <Text className="mr-2 flex-1 text-center text-xl font-bold">
          Total DPT
        </Text>
        <Text className="mx-2 flex-1 text-center text-xl font-bold">
          Target Suara
        </Text>
        <Text className="ml-2 flex-1 text-center text-xl font-bold">
          Total TPS
        </Text>
      </View>

      <View className="flex-row justify-between pb-4">
        <Text className="mr-2 flex-1 text-center text-xl font-bold">50</Text>
        <Text className="mx-2 flex-1 text-center text-xl font-bold">100</Text>
        <Text className="ml-2 flex-1 text-center text-xl font-bold">6</Text>
      </View>
    </>
  );
};
