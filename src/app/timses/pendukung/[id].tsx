import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import { HeaderHome } from '@/components/header-home';
import { Title } from '@/components/title';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/ui';
import { CardPendukungTimses } from '@/components/timses/card-detail-pendukung';
import { getPendukungTimses, PendukungTimses } from '@/api/get-pendukung-timses';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function PendukungPage() {
  const local = useLocalSearchParams<{ id: string }>();
  console.log(local);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PendukungTimses[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const {
    data: fetchedData,
    isPending,
    isError,
    isFetching,
    refetch,
  } = getPendukungTimses({
    variables: { nik: Number(local.id), page, limit: 10 },
  });

  const renderItem = React.useCallback(
    ({ item }: { item: PendukungTimses }) => <CardPendukungTimses {...item} />,
    []
  );

  useEffect(() => {
    if (fetchedData?.data) {
      setData((prevData) => {
        const newData = [...prevData, ...fetchedData.data];
        const uniqueData = newData.filter(
          (item, index, self) =>
            index ===
            self.findIndex((t) => t.pendukung_id === item.pendukung_id)
        );
        return uniqueData;
      });
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
      <View className="flex-1 justify-center p-3">
              <Stack.Screen
          options={{
            title: 'Data Pendukung',
            headerBackTitle: 'Data Pendukung',
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
            title: 'Data Pendukung',
            headerBackTitle: 'Data Pendukung',
          }}
        />
        <FocusAwareStatusBar />
        <Text className="text-center">Error Mengambil Data Pendukung</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
          options={{
            title: 'Data Pendukung',
            headerBackTitle: 'Data Pendukung',
          }}
        />
      <FocusAwareStatusBar />
      <View className="h-full px-2">
        <HeaderHome />
        <View className="my-2">
          <Title text="Pendukung" />
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
      </View>
    </SafeAreaView>
  );
}
