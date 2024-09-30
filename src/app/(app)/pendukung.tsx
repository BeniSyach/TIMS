import { Env } from '@env';
import { FlashList } from '@shopify/flash-list';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState, useCallback } from 'react';
import { Alert, RefreshControl } from 'react-native';
import type { Pendukung } from '@/api';
import { getPendukung } from '@/api';
import { HeaderHome } from '@/components/header-home';
import { CardPendukung } from '@/components/pendukung/card';
import { Title } from '@/components/title';
import {
  ActivityIndicator,
  Button,
  EmptyList,
  FocusAwareStatusBar,
  Input,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from '@/ui';
import BubbleButton from '@/ui/bubble-button';
import { Export } from '@/ui/icons/export';
import { Upload } from '@/ui/icons/upload';
import { getToken } from '@/core/auth/utils';
import { useAuth } from '@/core';

export default function PendukungPage() {
  const signOut = useAuth.use.signOut();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [nama, setNama] = useState<string>('');
  const [nik, setNik] = useState<number | string>('');
  const [data, setData] = useState<Pendukung[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [input, setInput] = useState<string>('');

  const handleBubblePress = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionPress = async (option: string) => {
    if (option === 'Export') {
      const url = `${Env.API_URL}/api/v1/timses/dokumen/export`;
      console.log('Export');

      const token = await getToken();
      if (!token?.access) {
        console.error('Token is invalid or missing');
        Alert.alert('Error', 'Gagal mendapatkan token. Silakan coba lagi.');
        return;
      }

      console.log('token', token.access);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            Authorization: `Bearer ${token.access}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to download file.');
        }

        const blob = await response.blob();
        const fileUri = FileSystem.documentDirectory + 'export_TIMS.xlsx';

        const reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];

          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log('File has been downloaded to:', fileUri);

          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          } else {
            Alert.alert('Downloaded', `File has been downloaded to: ${fileUri}`);
          }
        };
      } catch (error) {
        console.error('Error downloading file:', error);
        Alert.alert('Error', 'Failed to download file.');
      }
    } else {
      console.log('Import');
      router.push('export');
    }
  };

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

  const { data: fetchedData, isPending, isError, isFetching, refetch } = getPendukung({
    variables: { page, limit: 10, name : nama, nik },
  });

  useEffect(() => {
    console.log('Fetched Data:', fetchedData);
    if (fetchedData?.data) {
      if (page === 1) {
        setData(fetchedData.data); 
      } else if(nama || nik){
        setData(fetchedData.data);
      } else {
        setData((prevData) => [...prevData, ...fetchedData.data]); 
      }
      setHasMoreData(fetchedData.data.length > 0);
    }
  }, [fetchedData, page]);

  const renderItem = useCallback(({ item }: { item: Pendukung }) => <CardPendukung {...item} />, []);

  const handleEndReached = () => {
    if (!isPending && hasMoreData) {
      console.log('Memuat halaman Pendukung:', page + 1);
      setPage((prevPage) => prevPage + 1); 
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      setPage(1);
      setHasMoreData(true);
    } catch (error) {
      console.error('Error refreshing data:', error);
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
        <Text className="text-center text-black dark:text-black">
          Error Mengambil Data Pendukung
        </Text>
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
          <Title text="Pendukung" />
        </View>
          <Input
            value={input}
            onChangeText={handleInputChange}
            placeholder="Ketikkan pencarian..."
          />
        <FlashList
          data={data}
          renderItem={renderItem}
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
              {/* <Pressable
                onPress={() => handleOptionPress('Export')}
                className="rounded-full bg-green-500 p-3"
              >
                <View className="flex items-center justify-center">
                  <Export color="white" />
                  <Text className="text-white">Export</Text>
                </View>
              </Pressable> */}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
