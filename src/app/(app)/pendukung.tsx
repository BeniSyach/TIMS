import { Env } from '@env';
import { FlashList } from '@shopify/flash-list';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import type { Pendukung } from '@/api';
import { getPendukung } from '@/api';
import { HeaderHome } from '@/components/header-home';
import { CardPendukung } from '@/components/pendukung/card';
import { Title } from '@/components/title';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from '@/ui';
import BubbleButton from '@/ui/bubble-button';
import { Export } from '@/ui/icons/export';
import { Upload } from '@/ui/icons/upload';

export default function PendukungPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Pendukung[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const handleBubblePress = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionPress = async (option: string) => {
    if (option === 'Export') {
      const url = `${Env.API_URL}/api/v1/timses/dokumen/export`;
      console.log('Export');

      try {
        // Lokasi penyimpanan file di perangkat
        const fileUri = FileSystem.documentDirectory + 'export_TIMS.xlsx';

        // Mendownload file dari URL
        const { uri } = await FileSystem.downloadAsync(url, fileUri);
        console.log('File has been downloaded to:', uri);

        // Optionally, share the file to view it or perform further actions
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }

        return uri;
      } catch (error) {
        console.error('Error downloading file:', error);
        Alert.alert('Error', 'Failed to download file.');
      }
    } else {
      console.log('Import');
      router.push('export');
    }
  };

  const {
    data: fetchedData,
    isPending,
    isError,
    isFetching,
    refetch,
  } = getPendukung({
    variables: { page, limit: 10 },
  });

  const renderItem = React.useCallback(
    ({ item }: { item: Pendukung }) => <CardPendukung {...item} />,
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
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <FocusAwareStatusBar />
        <Text className="text-center text-black dark:text-black">
          Error Mengambil Data Pendukung
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
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
        <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
          <BubbleButton
            className="bg-gray-400 dark:bg-gray-500"
            onPress={handleBubblePress}
            active={showOptions}
            size="lg"
          />
          {showOptions && (
            <View className="absolute bottom-14 right-0 mb-2 flex flex-col items-end">
              <Pressable
                onPress={() => handleOptionPress('Upload')}
                className="mb-2 rounded-full bg-blue-500 p-3 text-center"
              >
                <View className="flex items-center justify-center">
                  <Upload color="white" />
                  <Text className="mt-1 text-white">Import</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => handleOptionPress('Export')}
                className="rounded-full bg-green-500 p-3"
              >
                <View className="flex items-center justify-center">
                  <Export color="white" />
                  <Text className="text-white">Export</Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
