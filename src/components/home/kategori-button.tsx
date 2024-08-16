import React from 'react';

import { Button, View } from '@/ui';

interface Props {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const KategoriButton: React.FC<Props> = ({ selected, setSelected }) => {
  return (
    <View className="flex-row justify-between p-4">
      <Button
        variant="blue"
        size="default"
        label="Penduduk"
        className="mr-2 flex-1"
        active={selected === 'penduduk' ? true : false}
        onPress={() => setSelected('penduduk')}
      />
      <Button
        variant="blue"
        size="default"
        label="Pendukung"
        className="mx-2 flex-1"
        active={selected === 'pendukung' ? true : false}
        onPress={() => setSelected('pendukung')}
      />
      <Button
        variant="blue"
        size="default"
        label="Relawan"
        className="ml-2 flex-1"
        active={selected === 'relawan' ? true : false}
        onPress={() => setSelected('relawan')}
      />
    </View>
  );
};

export default KategoriButton;
