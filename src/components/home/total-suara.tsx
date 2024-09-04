import React from 'react';

import type { totalSuara } from '@/api/dashboard/total-suara';
import { Button, Modal, Text, TouchableOpacity, useModal, View } from '@/ui';

import { Border } from '../border';
import { Title } from '../title';

interface Props {
  data: totalSuara;
}

const TotalSuara: React.FC<Props> = ({ data }) => {
  const { ref, present, dismiss } = useModal();
  const totalSuaraPersen = (data.total_pendukung / data.total_penduduk) * 100;
  const roundedPersen = totalSuaraPersen.toFixed(2);
  const roundedPersenStyle = totalSuaraPersen.toFixed(0);
  // Menghitung selisih persentase
  const selisihPersen = 100 - totalSuaraPersen;
  const formattedSelisihPersen = selisihPersen.toFixed(1);

  return (
    <>
      <Title text="Total Suara" />
      <TouchableOpacity onPress={() => present()} style={{ width: '100%' }}>
        <Border>
          <View className="relative h-8 w-full bg-neutral-300">
            {/* Blue bar showing the percentage */}
            <View
              className="absolute left-0 top-0 h-full bg-blue-500"
              style={{ width: `${Number(roundedPersenStyle)}%` }}
            >
              {Number(roundedPersenStyle) > 50 && (
                <Text className="absolute inset-0 flex items-center justify-center text-center text-white">
                  {roundedPersen}%
                </Text>
              )}
            </View>

            {/* Gray bar for remaining percentage */}
            <View
              className="absolute left-0 top-0 h-full bg-gray-500"
              style={{
                width: `${100 - Number(roundedPersenStyle)}%`,
                left: `${Number(roundedPersenStyle)}%`,
              }}
            />
            {Number(roundedPersenStyle) <= 50 && (
              <Text className="absolute inset-0 flex items-center justify-center text-center text-white">
                {roundedPersen}%
              </Text>
            )}
          </View>
        </Border>
      </TouchableOpacity>
      <Modal
        ref={ref}
        snapPoints={['40%']}
        title="Total Suara"
        onDismiss={dismiss}
      >
        <View style={{ padding: 20 }}>
          <Text className="text-center dark:text-black">
            Total Pendukung : {data.total_pendukung}
          </Text>
          <Text className="text-center dark:text-black">
            Total DPT : {data.total_penduduk}
          </Text>
          <Text className="text-center dark:text-black">
            Jumlah Total Suara : {roundedPersen} %
          </Text>
          <Text className="text-center dark:text-black">
            Jumlah Yang Tidak Mendukung : {formattedSelisihPersen} %
          </Text>
          <Button label="Tutup" variant="secondary" onPress={dismiss} />
        </View>
      </Modal>
    </>
  );
};

export default TotalSuara;
