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
  Input,
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
  const [nama, setNama] = React.useState<string>('');
  const [nik, setNik] = React.useState<number | string>('');
  const [input, setInput] = React.useState<string>('');

  const desaKodeStr = Array.isArray(desa_kode) ? desa_kode[0] : desa_kode;
  const tpsStr = Array.isArray(tps) ? tps[0] : tps;

  const { data: fetched, isPending, isError, isFetching, refetch } = getAllPendukungDesa({
    variables: { id: desaKodeStr ?? '', tps: tpsStr ?? '', page, limit: 10, name : nama, nik },
  });

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

  React.useEffect(() => {
    if (fetched?.data) {
      if (page === 1) {
        setData(fetched.data);
        setHasMoreData(fetched.data.length >= 10);
      } else if(nama || nik){
        setData(fetched.data);
        setHasMoreData(fetched.data.length >= 10);
      }  else {
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

  if (isPending && page === 1 && !nama && !nik) {
    return (
      <View className="flex-1 justify-center p-3">
        <Stack.Screen
          options={{
            title: 'Data Pendukung Desa',
            headerBackTitle: 'Data Pendukung Desa',
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
            title: 'Data Pendukung Desa',
            headerBackTitle: 'Data Pendukung Desa',
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
          title: 'Data Pendukung Desa',
          headerBackTitle: 'Data Pendukung Desa',
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
    </View>
  );
}
