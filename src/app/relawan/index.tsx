import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import * as React from 'react';

import type { TotalSuaraKecamatan } from '@/api/total-suara-kecamatan';
import { getTotalSuaraKecamatan } from '@/api/total-suara-kecamatan';
import { CardComponent } from '@/components/pendukung/cards-component';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/ui';

export default function RelawanPost() {
  const { data, isPending, isError } = getTotalSuaraKecamatan();
  console.log('data kecamatan home', data);
  const renderItem = React.useCallback(
    ({ item }: { item: TotalSuaraKecamatan }) => <CardComponent {...item} />,
    []
  );

  if (isPending) {
    return (
      <View className="flex-1 justify-center  p-3">
        <Stack.Screen
          options={{
            title: 'Total Pendukung Setiap Kecamatan',
            headerBackTitle: 'Total Pendukung Setiap Kecamatan',
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
            title: 'Total Pendukung Setiap Kecamatan',
            headerBackTitle: 'Total Pendukung Setiap Kecamatan',
          }}
        />
        <FocusAwareStatusBar />
        <Text className="text-center">
          Error loading post Total Pendukung Setiap Kecamatan
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-3 ">
      <Stack.Screen
        options={{
          title: 'Total Pendukung Setiap Kecamatan',
          headerBackTitle: 'Total Pendukung Setiap Kecamatan',
        }}
      />
      <FocusAwareStatusBar />
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        numColumns={2}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
      />
    </View>
  );
}
