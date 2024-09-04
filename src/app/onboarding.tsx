import { useRouter } from 'expo-router';
import React from 'react';

import { Cover } from '@/components/cover';
import { useIsFirstTime } from '@/core/hooks';
import { Button, FocusAwareStatusBar, SafeAreaView, Text, View } from '@/ui';
export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center  justify-center">
      <FocusAwareStatusBar />
      <View className="mt-[60%] w-full flex-1">
        <Cover />
      </View>
      <View className="justify-end ">
        <Text className="my-3 text-center text-5xl font-bold">TIMS</Text>
        <Text className="mb-2 text-center text-lg text-gray-600">
          Aplikasi Pemilu
        </Text>

        <Text className="my-1 pt-6 text-left text-lg">🚀 Mudah Digunakan </Text>
        <Text className="my-1 text-left text-lg">🥷 produktivitas</Text>
        <Text className="my-1 text-left text-lg">
          🧩 Satu Suara Untuk Perubahan
        </Text>
        <Text className="my-1 text-left text-lg">💪 Damai</Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="Mulai Login"
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
