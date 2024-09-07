import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState, useCallback } from 'react';
import type { Timses } from '@/api';
import { getTimses } from '@/api';
import { HeaderHome } from '@/components/header-home';
import { CardTimses } from '@/components/timses/card';
import { Title } from '@/components/title';
import {
  ActivityIndicator,
  Button,
  EmptyList,
  FocusAwareStatusBar,
  Input,
  SafeAreaView,
  Text,
  View,
} from '@/ui';
import { RefreshControl } from 'react-native';
import { useAuth } from '@/core';

export default function TimsesPage() {
  const signOut = useAuth.use.signOut();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Timses[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [input, setInput] = useState<string>('');
  const [nama, setNama] = useState<string>('');
  const [nik, setNik] = useState<number | string>('');

  const { data: fetched, isPending, isError, isFetching, refetch } = getTimses({
    variables: { page, limit: 10, nama: nama, nik : nik },
  });

  console.log('data timses', fetched)

  useEffect(() => {
    if (fetched?.data) {
      if (page === 1) {
        setData(fetched.data);
        setHasMoreData(fetched.data.length >= 10); // Assumes 10 is the limit per page
      }else if(nama || nik){
        setData(fetched.data);
      } else {
        setData((prevData) => [...prevData, ...fetched.data]);
        setHasMoreData(fetched.data.length >= 10);
      }
    }
  }, [fetched, page]);

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

  const handleEndReached = useCallback(() => {
    if (!isPending && !isFetching && hasMoreData) {
      console.log('Memuat halaman Timses:', page + 1);
      setPage((prevPage) => prevPage + 1); // Increment halaman
    }
  }, [isPending, isFetching, hasMoreData, page]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await refetch();
      if (result.data?.data) {
        setData(result.data.data);
        setPage(1);
        setHasMoreData(result.data.data.length >= 10); // Assumes 10 is the limit per page
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
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <FocusAwareStatusBar />
        <Text className="text-center">Error loading Timses</Text>
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
    <SafeAreaView className="flex-1">
      <FocusAwareStatusBar />
      <View className="h-full px-2">
        <HeaderHome />
        <View className="my-2">
          <Title text="Timses" />
        </View>
        <Input
            value={input}
            onChangeText={handleInputChange}
            placeholder="Ketikkan pencarian..."
          />
        <FlashList
          data={data}
          renderItem={({ item }) => <CardTimses {...item} />}
          keyExtractor={(_, index) => `item-${index}`}
          ListEmptyComponent={<EmptyList isLoading={isPending} />}
          estimatedItemSize={300}
          numColumns={1}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
}
