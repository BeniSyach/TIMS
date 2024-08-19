import { FlashList } from '@shopify/flash-list';
import React from 'react';

import type { Relawan } from '@/api';
import { getRelawan } from '@/api';
import { HeaderHome } from '@/components/header-home';
import { CardRelawan } from '@/components/relawan/card';
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

export default function RelawanPage() {
  const { data, isPending, isError } = getRelawan();

  const renderItem = React.useCallback(
    ({ item }: { item: Relawan }) => <CardRelawan {...item} />,
    []
  );

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
        <Text className="text-center">Error loading Get Relawan</Text>
      </View>
    );
  }
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-2">
        <SafeAreaView className="flex-1">
          <HeaderHome text="TIMS" subText="Aplikasi Tim Sukses" />
          <Title text="Relawan" />
          <FlashList
            data={data}
            renderItem={renderItem}
            keyExtractor={(_, index) => `item-${index}`}
            numColumns={1}
            ListEmptyComponent={<EmptyList isLoading={isPending} />}
            estimatedItemSize={300}
          />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
