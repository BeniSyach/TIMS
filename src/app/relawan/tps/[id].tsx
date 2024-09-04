import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';

import type { getTpsDesa } from '@/api/get-tps-desa';
import { getAllTpsDesa } from '@/api/get-tps-desa';
import { CardTpsDesa } from '@/components/pendukung/cards-tps-desa';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/ui';

export default function PendukungPost() {
  const local = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError } = getAllTpsDesa({
    //@ts-ignore
    variables: { id: local.id },
  });

  console.log('data tps', data);

  const renderItem = React.useCallback(
    ({ item }: { item: getTpsDesa }) => <CardTpsDesa {...item} />,
    []
  );

  if (isPending) {
    return (
      <View className="flex-1 justify-center  p-3">
        <Stack.Screen
          options={{
            title: 'Total Relawan Desa',
            headerBackTitle: 'Total Relawan Desa',
          }}
        />
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <Stack.Screen
          options={{
            title: 'Total Relawan Desa',
            headerBackTitle: 'Total Relawan Desa',
          }}
        />
        <FocusAwareStatusBar />
        <Text className="text-center dark:text-black">
          Error loading post Total TPS Desa
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-3 ">
      <Stack.Screen
        options={{
          title: 'Total Relawan Desa',
          headerBackTitle: 'Total Relawan Desa',
        }}
      />
      <FocusAwareStatusBar />
      <FlashList
        data={data.data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        numColumns={2}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
      />
    </View>
  );
}
