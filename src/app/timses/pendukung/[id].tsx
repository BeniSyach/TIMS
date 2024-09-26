import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import type { PendukungTimses } from '@/api/get-pendukung-timses';
import { getPendukungTimses } from '@/api/get-pendukung-timses';
import { CardPendukungTimses } from '@/components/timses/card-detail-pendukung';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  Text,
  View,
  Button,
  Input
} from '@/ui';
import { RefreshControl } from 'react-native';
import { useAuth } from '@/core';

export default function PendukungPage() {
  const signOut = useAuth.use.signOut();
  const local = useLocalSearchParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PendukungTimses[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nama, setNama] = useState<string>('');
  const [nik, setNik] = useState<number | string>('');
  const [input, setInput] = useState<string>('')

  const {
    data: fetchedData,
    isPending,
    isError,
    isFetching,
    refetch,
  } = getPendukungTimses({
    variables: { nik: Number(local.id), page, limit: 10, name : nama, nikPendukung : nik },
  });

  const renderItem = React.useCallback(
    ({ item }: { item: PendukungTimses }) => <CardPendukungTimses {...item} />,
    []
  );

  const handleInputChange = (text: string) => {
    setInput(text);
    
    const parsedNumber = Number(text);
    if (!isNaN(parsedNumber) && text.trim() !== '') {
      setNik(parsedNumber);
      setNama(''); 
      setPage(1);
    } else {
      setNama(text);
      setNik(''); 
      setPage(1);
    }
  };

  useEffect(() => {
    if (fetchedData?.data) {
      if (page === 1) {
        setData(fetchedData.data);
        setHasMoreData(fetchedData.data.length >= 10);
      } else {
        setData((prevData) => [...prevData, ...fetchedData.data]);
        setHasMoreData(fetchedData.data.length >= 10);
      }
    }
  }, [fetchedData, page]);

  const handleEndReached = useCallback(() => {
    // console.log('End Reached:', { isPending, isFetching, hasMoreData, page });
    if (!isPending  && hasMoreData) {
      console.log('Memuat halaman Data Pendukung:', page + 1);
      setPage((prevPage) => prevPage + 1); 
    }
  }, [isPending, isFetching, hasMoreData, page]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await refetch();
      if (result.data?.data) {
        // console.log('Data after refresh:', result.data.data);
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

  if (isPending && page === 1 && !nama && !nik) {
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
          title: 'Data Pendukung',
          headerBackTitle: 'Data Pendukung',
        }}
      />
       <View className="h-full px-2 pt-5">
                <Input
            value={input}
            onChangeText={handleInputChange}
            placeholder="Ketikkan pencarian..."
          />
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => `item-${index}`}
          ListEmptyComponent={<EmptyList isLoading={isPending} />}
          estimatedItemSize={300}
          numColumns={1}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isPending ? <ActivityIndicator /> : null}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
        </View>
    </View>
  );
}
