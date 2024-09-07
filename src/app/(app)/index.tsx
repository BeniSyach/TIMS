import React, { useState } from 'react';
import { getDataBiografi } from '@/api/biografi';
import { getTotalSuara } from '@/api/dashboard/total-suara';
import { AddPost } from '@/components/home/add-post';
import { Biografi } from '@/components/home/biografi';
import { Header } from '@/components/home/header';
import KategoriButton from '@/components/home/kategori-button';
import Statistics from '@/components/home/statistik';
import Summary from '@/components/home/summary';
import TotalSuara from '@/components/home/total-suara';
import { useAuth } from '@/core';
import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/ui';
import { RefreshControl } from 'react-native';

export default function Home() {
  const signOut = useAuth.use.signOut();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isPending, isError, refetch } = getTotalSuara();
  const {
    data: dataBiografi,
    isPending: pendingBiografi,
    isError: errorBiografi,
    refetch: refreshDataBiografi,
  } = getDataBiografi();
  const [selected, setSelected] = useState<string>('penduduk');

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      await refreshDataBiografi();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, refreshDataBiografi]);

  // Loading state
  if (pendingBiografi || isPending) {
    return (
      <View className="flex-1 justify-center p-3">
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  // Error state
  if (errorBiografi || isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <FocusAwareStatusBar />
        <Text className="text-center">Error Mengambil Data</Text>
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
      <ScrollView
        className="px-2"
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Header data={dataBiografi} />
        <Biografi data={dataBiografi} />
        <KategoriButton selected={selected} setSelected={setSelected} />
        <Statistics selected={selected} data={data} />
        <TotalSuara data={data} />
        <Summary data={data} />
        <AddPost />
      </ScrollView>
    </SafeAreaView>
  );
}
