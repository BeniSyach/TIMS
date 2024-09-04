import React, { useState } from 'react';

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
import { getDataBiografi } from '@/api/biografi';

export default function Home() {
  const signOut = useAuth.use.signOut();
  const { data, isPending, isError } = getTotalSuara();
  const {data: dataBiografi, isPending : pendingBiografi, isError: errorBiografi} = getDataBiografi();
  const [selected, setSelected] = useState<string>('penduduk');


  if (pendingBiografi) {
    return (
      <View className="flex-1 justify-center  p-3">
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  if (errorBiografi) {
    return (
      <View className="flex-1 justify-center p-3">
        <FocusAwareStatusBar />
        <Text className="text-center">Error Mengambil Data Profile</Text>
        <Button
          label="Sign Out"
          onPress={signOut}
          className="mt-4"
          variant="blue"
        />
      </View>
    );
  }

  if (isPending) {
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
        <Text className="text-center">Error Mengambil Data Profile</Text>
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
      <ScrollView className="px-2">
        <Header  data={dataBiografi} />
        <Biografi data={dataBiografi} />
        <KategoriButton selected={selected} setSelected={setSelected} />
        <Statistics selected={selected} data={data} />
        <TotalSuara />
        <Summary data={data} />
        <AddPost />
      </ScrollView>
    </SafeAreaView>
  );
}
