import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
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
import { Upload } from '@/ui/icons/upload';
import { Export } from '@/ui/icons/export';

export default function PendukungPage() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Pendukung[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const handleBubblePress = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionPress = (option: string) => {
    console.log(`${option} button pressed`);
    // Lakukan sesuatu di sini saat tombol opsi ditekan
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
          (item, index, self) => index === self.findIndex((t) => t.pendukung_id === item.pendukung_id)
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
        <Text className="text-center">Error Mengambil Data Pendukung</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <FocusAwareStatusBar />
      <View className="h-full px-2">
        <HeaderHome text="TIMS" subText="Aplikasi Tim Sukses" />
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
            // label='Aksi'
            // icon={<Sequares color="white" />} 
            onPress={handleBubblePress}
            active={showOptions}
            size="lg"
          />
                    {showOptions && (
            <View className="absolute bottom-14 right-0 flex flex-col items-end mb-2">
              <Pressable
                onPress={() => handleOptionPress('Upload')}
                className="bg-blue-500 rounded-full p-3 mb-2 text-center"
              >
              <View className="flex items-center justify-center">
                <Upload color="white" />
                <Text className="text-white mt-1">Upload</Text>
              </View>
              </Pressable>
              <Pressable
                onPress={() => handleOptionPress('Export')}
                className="bg-green-500 rounded-full p-3"
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
