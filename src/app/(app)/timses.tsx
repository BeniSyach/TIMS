import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';

import type { Timses } from '@/api';
import { getTimses } from '@/api';
import { HeaderHome } from '@/components/header-home';
import { CardTimses } from '@/components/timses/card';
import { Title } from '@/components/title';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/ui';

export default function TimsesPage() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Timses[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const {
    data: fecthed,
    isPending,
    isError,
    isFetching,
    refetch,
  } = getTimses({ variables: { page, limit: 10 } });
  console.log('data timses', fecthed);

  const renderItem = React.useCallback(
    ({ item }: { item: Timses }) => <CardTimses {...item} />,
    []
  );

  useEffect(() => {
    if (fecthed?.data) {
      setData(fecthed.data);
    }
  }, []);

  const handleEndReached = () => {
    if (!isPending && !isFetching && !isLoading && hasMoreData) {
      console.log('halaman', page);
      setIsLoading(true);
      refetch()
        .then((newData) => {
          const newItems = newData?.data?.data ?? [];
          if (newItems.length > 0) {
            setData((prevData) => [...prevData, ...newItems]);
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
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <FocusAwareStatusBar />
        <Text className="text-center">Error loading Get Timses</Text>
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1">
      <FocusAwareStatusBar />
      <ScrollView className="px-2">
        <HeaderHome text="TIMS" subText="Aplikasi Tim Sukses" />
        <View className="my-2">
          <Title text="Timses" />
        </View>
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => `item-${index}`}
          ListEmptyComponent={<EmptyList isLoading={isPending} />}
          estimatedItemSize={300}
          numColumns={1}
          refreshing={isFetching}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={isPending ? <ActivityIndicator /> : null}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
