import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import type { Timses } from '@/api';
import { getTimses } from '@/api';
import { CardDetailHomeTimses } from '@/components/timses/card-detail-home';
import {
  ActivityIndicator,
  Button,
  EmptyList,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/ui';
import { useAuth } from '@/core';
import { RefreshControl } from 'react-native';

export default function TimsesPage() {
  const signOut = useAuth.use.signOut();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Timses[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const nama =''
  const nik = ''

  const {
    data: fetched,
    isPending,
    isError,
    isFetching,
    refetch,
  } = getTimses({
    variables: { page, limit: 10, nama, nik },
  });

  useEffect(() => {
    if (fetched?.data) {
      if (page === 1) {
        setData(fetched.data);
        setHasMoreData(fetched.data.length >= 10); // Assume 10 is the limit per page
      } else {
        setData((prevData) => [...prevData, ...fetched.data]);
        setHasMoreData(fetched.data.length >= 10);
      }
    }
  }, [fetched, page]);

  const renderItem = useCallback(
    ({ item }: { item: Timses }) => <CardDetailHomeTimses {...item} />,
    []
  );

  const handleEndReached = useCallback(() => {
    if (!isPending && !isFetching && hasMoreData) {
      console.log('Memuat halaman:', page + 1);
      setPage((prevPage) => prevPage + 1);
    }
  }, [isPending, isFetching, hasMoreData, page]);

  const onRefresh = useCallback(async () => {
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
          title: 'Total Timses',
          headerBackTitle: 'Total Timses',
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
        <FocusAwareStatusBar />
        <Stack.Screen
        options={{
          title: 'Total Timses',
          headerBackTitle: 'Total Timses',
        }}
      />
        <Text className="text-center">Error loading post Total Timses</Text>
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
    <View className="flex-1 p-3">
      <Stack.Screen
        options={{
          title: 'Total Timses',
          headerBackTitle: 'Total Timses',
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
        refreshing={isFetching}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={isPending ? <ActivityIndicator /> : null}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
