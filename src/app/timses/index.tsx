import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

import type { Timses } from '@/api';
import { getTimses } from '@/api';
import { CardDetailHomeTimses } from '@/components/timses/card-detail-home';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/ui';

export default function TimsesPage() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Timses[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const { data: fecthed, isPending, isError, isFetching, refetch } = getTimses({
    variables: { page, limit:10 },
  });

  useEffect(() => {
    if (fecthed?.data) {
      setData((prevData) => {
        const newData = [...prevData, ...fecthed.data];
        const uniqueData = newData.filter(
          (item, index, self) => index === self.findIndex((t) => t.timses_id === item.timses_id)
        );
        return uniqueData;
      });
    }
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: Timses }) => <CardDetailHomeTimses {...item} />,
    []
  );

  const handleEndReached = () => {
    if (!isPending && !isFetching && !isLoading && hasMoreData) {
      console.log('halaman', page);
      setIsLoading(true);
      refetch()
        .then((newData) => {
          const newItems = newData?.data?.data ?? [];
          if (newItems.length > 0) {
            setData((prevData) => {
              const combinedData = [...prevData, ...newItems];
              const uniqueData = combinedData.filter(
                (item, index, self) => index === self.findIndex((t) => t.timses_id === item.timses_id)
              );
              return uniqueData;
            });
            setPage((prevPage) => prevPage + 1);
          } else {
            setHasMoreData(false);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  if (isPending && page === 1) {
    return (
      <View className="flex-1 justify-center  p-3">
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
        <Stack.Screen
          options={{
            title: 'Total Timses',
            headerBackTitle: 'Total Timses',
          }}
        />
        <FocusAwareStatusBar />
        <Text className="text-center">Error loading post Total Timses</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-3 ">
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
        numColumns={3}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
        refreshing={isFetching}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={isPending ? <ActivityIndicator /> : null}
      />
    </View>
  );
}
