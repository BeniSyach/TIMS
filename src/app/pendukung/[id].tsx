import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';

import { usePost } from '@/api';
import { ActivityIndicator, FocusAwareStatusBar, Text, View } from '@/ui';

export default function PendukungPost() {
  const local = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError } = usePost({
    //@ts-ignore
    variables: { id: local.id },
  });

  if (isPending) {
    return (
      <View className="flex-1 justify-center  p-3">
        <Stack.Screen
          options={{ title: 'Pendukung', headerBackTitle: 'Pendukung' }}
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
          options={{ title: 'Pendukung', headerBackTitle: 'Pendukung' }}
        />
        <FocusAwareStatusBar />
        <Text className="text-center">Error loading post Pendukung</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-3 ">
      <Stack.Screen
        options={{ title: 'Pendukung', headerBackTitle: 'Pendukung' }}
      />
      <FocusAwareStatusBar />
      <Text className="text-xl">{data.title}</Text>
      <Text>{data.body} </Text>
    </View>
  );
}
