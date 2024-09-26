import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Button,
  EmptyList,
  FocusAwareStatusBar,
  Option,
  SafeAreaView,
  ScrollView,
  Select,
  Text,
  View,
} from '@/ui';
import { useAuth } from "@/core";
import { RefreshControl } from "react-native";
import { HeaderHome } from "@/components/header-home";
import { getAllKecamatan } from "@/api/kecamatan";
import { getAllDesa } from "@/api/desa";
import { FlashList } from "@shopify/flash-list";
import PlusButton from "@/ui/plus-button";
import { BerkasSaksi, getBerkasSaksi } from "@/api/get-berkas-saksi";
import { CardSaksiComponent } from "@/components/saksi/card-saksi";

export default function Saksi(){
  const signOut = useAuth.use.signOut();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<BerkasSaksi[]>([]);
  const [valueKec, setValueKec] = useState<string | number | undefined>();
  // const { data: dataKec, isPending : isPendingKec, isError : isErrorKec } = getAllKecamatan();
//   const [valueDesa, setValueDesa] = useState<
//   string | number | undefined
// >();
// const { data: dataDesa } = getAllDesa({
//   //@ts-ignore
//   variables: { id: valueKec },
// });
const [hasMoreData, setHasMoreData] = useState(true);

const { data: fetchedData, isPending, isError, refetch } = getBerkasSaksi();

const renderItem = useCallback(({ item }: { item: BerkasSaksi }) => <CardSaksiComponent {...item} />, []);

useEffect(() => {
  console.log('Fetched Data:', fetchedData);
  if (fetchedData?.data) {
    if (page === 1) {
      setData(fetchedData.data); 
    } 
    // else {
    //   setData((prevData) => [...prevData, ...fetchedData.data]); 
    // }
    setHasMoreData(fetchedData.data.length > 0);
  }
}, [fetchedData, page]);

  const onRefresh = React.useCallback(async () => {
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

  const handleBubblePress = () => {
    router.push('saksi-app/add-post-saksi');
  };

  // const optionsKec: Option[] =
  // dataKec?.data?.map((kecamatan) => ({
  //   value: kecamatan.id,
  //   label: kecamatan.name,
  // })) || [];

  // const optionsDesa: Option[] =
  // dataDesa?.data?.map((desa) => ({
  //   value: desa.id,
  //   label: desa.name,
  // })) || [];

  const handleEndReached = () => {
    if (!isPending  && hasMoreData) {
      console.log('Memuat halaman Pendukung:', page + 1);
      setPage((prevPage) => prevPage + 1); 
    }
  };

  if (isPending) {
    return (
      <View className="flex-1 justify-center  p-3">
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  if ( isError ) {
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

  return(
    <SafeAreaView className="flex-1">
       <FocusAwareStatusBar />
       <View className="h-full px-2">
          <HeaderHome />
          <Text className="text-xl font-bold pt-3">Hasil Suara TPS</Text>
          {/* <View className="p-4">
            <Select
              label="Kecamatan"
              options={optionsKec}
              value={valueKec}
              onSelect={(option) => setValueKec(option)}
            />
            <Select
              label="Desa"
              options={optionsDesa}
              value={valueDesa}
              onSelect={(option) => setValueDesa(option)}
            />
            <Button
              label="Cari"
              testID="add-post-button"
              className="mb-10"
              variant="blue"
            />
          </View> */}
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
            <PlusButton
              className="bg-gray-400 dark:bg-gray-500"
              onPress={handleBubblePress}
              size="lg"
            />
          </View>
        </View>
    </SafeAreaView>

  )
}