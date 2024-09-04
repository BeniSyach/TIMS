import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';

import type { pendukungDesa } from '@/api/get-pendukung-desa';
import { getAllPendukungDesa } from '@/api/get-pendukung-desa';
import { CardTpsDesaDetail } from '@/components/pendukung/detail-tps-desa';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/ui';

export default function TpsDetail() {
  const { desa_kode, tps } = useLocalSearchParams();
  console.log('data desa', desa_kode);
  console.log('data tps', tps);

  const desaKodeStr = Array.isArray(desa_kode) ? desa_kode[0] : desa_kode;
  const tpsStr = Array.isArray(tps) ? tps[0] : tps;

  const { data, isPending, isError } = getAllPendukungDesa({
    variables: { id: desaKodeStr ?? '', tps: tpsStr ?? '' }, // Pastikan nilai bukan undefined
  });

  console.log('data tps', data);

  const renderItem = React.useCallback(
    ({ item }: { item: pendukungDesa }) => <CardTpsDesaDetail {...item} />,
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
        <Text className="text-center">Error loading post Total TPS Desa</Text>
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
        numColumns={1}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
      />
    </View>
  );
}
