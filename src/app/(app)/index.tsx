import React, { useState } from 'react';

import { AddPost } from '@/components/home/add-post';
import { Biografi } from '@/components/home/biografi';
import { Header } from '@/components/home/header';
import KategoriButton from '@/components/home/kategori-button';
import Statistics from '@/components/home/statistik';
import { Summary } from '@/components/home/summary';
import TotalSuara from '@/components/home/total-suara';
import { FocusAwareStatusBar, SafeAreaView, ScrollView } from '@/ui';

export default function Home() {
  // const { data, isPending, isError } = usePosts();
  const [selected, setSelected] = useState<string>('penduduk');
  // const renderItem = React.useCallback(
  //   ({ item }: { item: Post }) => <Card {...item} />,
  //   []
  // );

  const id = 30;

  // if (isError) {
  //   return (
  //     <View>
  //       <Text> Error Loading data </Text>
  //     </View>
  //   );
  // }
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-2">
        <SafeAreaView className="flex-1">
          <Header />
          <Biografi />
          <KategoriButton selected={selected} setSelected={setSelected} />
          <Statistics selected={selected} id={id} />
          <TotalSuara />
          <Summary />
          <AddPost />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
