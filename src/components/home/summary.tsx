import React from 'react';

import type { totalSuara } from '@/api/dashboard/total-suara';
import { Text, View } from '@/ui';

interface Props {
  data: totalSuara;
}

const Summary: React.FC<Props> = ({ data }) => {
  return (
    <>
      <View className="flex-row justify-between pt-4">
        {/* <Text className="mr-2 flex-1 text-center text-xl font-bold">
          Total DPT
        </Text> */}
        <Text className="mx-2 flex-1 text-center text-xl font-bold">
          Target Suara
        </Text>
        <Text className="ml-2 flex-1 text-center text-xl font-bold">
          Total TPS
        </Text>
      </View>

      <View className="flex-row justify-between pb-4">
        {/* <Text className="mr-2 flex-1 text-center text-xl font-bold">50</Text> */}
        <Text className="mx-2 flex-1 text-center text-xl font-bold">
          {data.total_target}
        </Text>
        <Text className="ml-2 flex-1 text-center text-xl font-bold">
          {data.jumlah_tps}
        </Text>
      </View>
    </>
  );
};

export default Summary;
