import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { getDetailPendukung } from '@/api';
import { Border } from '@/components/border';
import { ProfilHome } from '@/components/profil-home';
import { Title } from '@/components/title';
import { ActivityIndicator, FocusAwareStatusBar, Text, View } from '@/ui';

export default function PendukungDetail() {
  const local = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError } = getDetailPendukung({
    //@ts-ignore
    variables: { id: local.id },
  });

  if (isPending) {
    return (
      <View className="flex-1 justify-center  p-3">
        <Stack.Screen
          options={{
            title: 'Relawan',
            headerBackTitle: 'Relawan',
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
            title: 'Relawan',
            headerBackTitle: 'Relawan',
          }}
        />
        <FocusAwareStatusBar />
        <Text className="text-center">Error loading post Relawan</Text>
      </View>
    );
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Relawan',
          headerBackTitle: 'Relawan',
        }}
      />
      <Border>
        <ProfilHome
          text="Raisa"
          subText="Calon DPRD Kota/Kab"
          profil={data.url}
        />
      </Border>
      <Border>
        <Title text={data.title} />
      </Border>
      <Border>
        <Title text="tes" />
      </Border>
      <Border>
        <Title text="tes" />
      </Border>
    </>
  );
}
