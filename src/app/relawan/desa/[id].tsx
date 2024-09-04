import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';

import type { TotalSuaraDesa } from '@/api/total-suara-desa';
import { getTotalSuaraDesa } from '@/api/total-suara-desa';
import { CardDesaComponent } from '@/components/pendukung/cards-desa-components';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/ui';

export default function PendukungPost() {
  const local = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError } = getTotalSuaraDesa({
    //@ts-ignore
    variables: { id: local.id },
  });

  const renderItem = React.useCallback(
    ({ item }: { item: TotalSuaraDesa }) => <CardDesaComponent {...item} />,
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
        <Text className="text-center">
          Error loading post Total Relawan Desa
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
