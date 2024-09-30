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
            title: 'Total Pendukung Per Desa',
            headerBackTitle: 'Total Pendukung Per Desa',
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
            title: 'Total Pendukung Per Desa',
            headerBackTitle: 'Total Pendukung Per Desa',
          }}
        />
        <FocusAwareStatusBar />
        <Text className="text-center dark:text-black">
          Error loading post Total Pendukung Per Desa
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-3 ">
      <Stack.Screen
        options={{
          title: 'Total Pendukung Per Desa',
          headerBackTitle: 'Total Pendukung Per Desa',
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
