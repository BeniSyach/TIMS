import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import type { pendukungDesa } from '@/api/get-pendukung-desa';
import { getAllPendukungDesa } from '@/api/get-pendukung-desa';
import { CardTpsDesaDetail } from '@/components/pendukung/detail-tps-desa';
import {
  ActivityIndicator,
  Button,
  EmptyList,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/ui';
import { RefreshControl } from 'react-native';
import { useAuth } from '@/core';

export default function TpsDetail() {
  const signOut = useAuth.use.signOut();
  const { desa_kode, tps } = useLocalSearchParams();
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<pendukungDesa[]>([]);
  const [hasMoreData, setHasMoreData] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const desaKodeStr = Array.isArray(desa_kode) ? desa_kode[0] : desa_kode;
  const tpsStr = Array.isArray(tps) ? tps[0] : tps;

  const { data: fetched, isPending, isError, isFetching, refetch } = getAllPendukungDesa({
    variables: { id: desaKodeStr ?? '', tps: tpsStr ?? '', page, limit: 10 },
  });

  React.useEffect(() => {
    if (fetched?.data) {
      if (page === 1) {
        setData(fetched.data);
        setHasMoreData(fetched.data.length >= 10);
      } else {
        setData((prevData) => [...prevData, ...fetched.data]);
        setHasMoreData(fetched.data.length >= 10);
      }
    }
  }, [fetched, page]);

  const handleEndReached = () => {
    if (!isPending  && hasMoreData) {
      console.log('Memuat halaman:', page + 1);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderItem = React.useCallback(
    ({ item }: { item: pendukungDesa }) => <CardTpsDesaDetail {...item} />,
    []
  );

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await refetch();
      if (result.data?.data) {
        setData(result.data.data);
        setPage(1);
        setHasMoreData(result.data.data.length >= 10);
      }
    } catch (error) {
      console.error('Error saat refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  if (isPending && page === 1) {
    return (
      <View className="flex-1 justify-center p-3">
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
        <Button
          label="Sign Out"
          onPress={signOut}
          className="mt-4"
          variant="blue"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 px-2">
      <FocusAwareStatusBar />
      <Stack.Screen
        options={{
          title: 'Total Relawan Desa',
          headerBackTitle: 'Total Relawan Desa',
        }}
      />
 
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        numColumns={1}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />

    </View>
  );
}
